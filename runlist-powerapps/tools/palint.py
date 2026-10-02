#!/usr/bin/env python3
"""palint.py: offline checks for hand-written Power Apps paste YAML.
Usage: python3 palint.py snippet.yaml [more.yaml ...]   (exit 1 on any ERROR)"""
import re, sys, yaml

ALLOWED_KEYS = {"Control", "Variant", "Properties", "Children"}  # subset we permit
APPROVED = {
    "Label@2.5.1", "Classic/Button@2.2.0", "Classic/TextInput@2.3.2",
    "Classic/DropDown@2.3.1", "Classic/DatePicker@2.6.0", "Classic/Toggle@2.1.0",
    "Classic/CheckBox@2.1.0", "Classic/Icon@2.5.0", "Rectangle@2.3.0",
    "Circle@2.3.0", "Timer@2.1.0", "Gallery@2.15.0", "GroupContainer@1.5.0",
    "HtmlViewer@2.1.0", "Image@2.2.3",
}
VARIANTS = {"Gallery": {"Vertical", "Horizontal", "VariableHeight"},
            "GroupContainer": {"AutoLayout", "ManualLayout"}}
NAME_RE = re.compile(r"^[A-Za-z][A-Za-z0-9_]*$")
errors, warns, names = [], [], {}

class Loader(yaml.SafeLoader):
    pass
# PyYAML (YAML 1.1) reads a bare '=' as a special tag; treat it as text like Studio does
Loader.yaml_implicit_resolvers = {k: [r for r in v if r[0] != "tag:yaml.org,2002:value"]
                                  for k, v in yaml.SafeLoader.yaml_implicit_resolvers.items()}
def _map(loader, node, deep=False):
    keys = set()
    for k, _ in node.value:
        key = loader.construct_object(k, deep=deep)
        if key in keys:
            errors.append(f"line {k.start_mark.line+1}: duplicate key '{key}'")
        keys.add(key)
    return loader.construct_mapping(node, deep)
Loader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, _map)

def raw_checks(text):
    for i, line in enumerate(text.splitlines(), 1):
        if "\t" in line:
            errors.append(f"line {i}: TAB character")
        m = re.match(r"^\s+[A-Za-z][A-Za-z0-9.]*:\s(=.*)$", line)
        if m:  # single-line (plain) formula
            f = m.group(1)
            if ": " in f or " #" in f or f.rstrip().endswith(":"):
                errors.append(f"line {i}: plain formula contains ': ' or ' #' -> use |-")
            if "{" in f:
                warns.append(f"line {i}: record/{{ in plain formula -> prefer |-")
            if any(ord(c) > 127 for c in f):
                errors.append(f"line {i}: non-ASCII in plain formula -> use |-")
        if re.match(r"^\s+[A-Za-z][A-Za-z0-9.]*:\s*[|>][+-]?\s*=", line):
            errors.append(f"line {i}: '=' must start the first CONTENT line of a block, not the |- line")

def control(name, body, parent_type, parent_variant, parent_dir, path):
    where = f"{path}/{name}"
    if not NAME_RE.match(name):
        errors.append(f"{where}: name must be letters/digits/underscore")
    if name in names:
        errors.append(f"{where}: duplicate control name (also at {names[name]})")
    names[name] = where
    if not isinstance(body, dict):
        errors.append(f"{where}: control body must be a mapping"); return
    for k in body:
        if k not in ALLOWED_KEYS:
            errors.append(f"{where}: key '{k}' not allowed")
    ctype = body.get("Control", "")
    base = ctype.split("@")[0]
    if ctype not in APPROVED:
        errors.append(f"{where}: Control '{ctype}' not on the approved list")
    var = body.get("Variant")
    if base in VARIANTS and var not in VARIANTS[base]:
        errors.append(f"{where}: {base} needs Variant in {sorted(VARIANTS[base])}")
    if base not in VARIANTS and var is not None:
        errors.append(f"{where}: Variant not allowed on {base}")
    props = body.get("Properties") or {}
    if "Properties" in body and not props:
        errors.append(f"{where}: empty Properties (delete the key)")
    for p, v in props.items():
        if not isinstance(v, str) or not v.startswith("="):
            errors.append(f"{where}.{p}: value must be a string starting with '='")
        elif v.strip() == "=":
            warns.append(f"{where}.{p}: empty formula; omit the property")
        if "TemplateWidth" in str(v) or "TemplateHeight" in str(v):
            if parent_type != "Gallery" and "Parent.Template" in str(v):
                errors.append(f"{where}.{p}: Parent.TemplateWidth/Height only on DIRECT gallery children")
    if base == "GroupContainer" and var == "AutoLayout" and "LayoutDirection" not in props:
        errors.append(f"{where}: AutoLayout container must set LayoutDirection")
    if base == "GroupContainer" and var == "ManualLayout":
        for p in props:
            if p.startswith("Layout") and p not in ("LayoutMinWidth", "LayoutMinHeight", "LayoutMaxWidth", "LayoutMaxHeight"):
                errors.append(f"{where}.{p}: layout property on a ManualLayout container")
    if base == "Gallery":
        for p in ("Items", "TemplateSize", "TemplatePadding"):
            if p not in props:
                errors.append(f"{where}: Gallery must set {p}")
    if parent_type == "GroupContainer" and parent_variant == "AutoLayout":
        if "FillPortions" not in props:
            errors.append(f"{where}: child of AutoLayout must set FillPortions")
        mn = "LayoutMinWidth" if parent_dir == "Horizontal" else "LayoutMinHeight"
        if mn not in props:
            warns.append(f"{where}: child of {parent_dir} AutoLayout should set {mn}")
        if "X" in props or "Y" in props:
            warns.append(f"{where}: X/Y are ignored inside AutoLayout")
    kids = body.get("Children")
    if kids is not None:
        if base not in ("Gallery", "GroupContainer"):
            errors.append(f"{where}: {base} cannot have Children")
        d = str(props.get("LayoutDirection", "")).replace("=LayoutDirection.", "").strip()
        seq(kids, base, var, d, where)

def seq(items, ptype, pvar, pdir, path):
    if not isinstance(items, list):
        errors.append(f"{path}: Children must be a '- name:' list"); return
    for it in items:
        if not isinstance(it, dict) or len(it) != 1:
            errors.append(f"{path}: each child must be one '- Name:' item"); continue
        (n, b), = it.items()
        control(str(n), b, ptype, pvar, pdir, path)

def main(fn):
    text = open(fn, encoding="utf-8").read()
    raw_checks(text)
    try:
        doc = yaml.load(text, Loader=Loader)
    except yaml.YAMLError as e:
        errors.append(f"YAML parse error: {e}"); return
    if isinstance(doc, dict) and set(doc) == {"Screens"}:
        for sname, s in doc["Screens"].items():
            if not NAME_RE.match(str(sname)):
                errors.append(f"screen '{sname}': bad name")
            names[str(sname)] = "Screens"
            for k in s:
                if k not in ("Properties", "Children"):
                    errors.append(f"screen {sname}: key '{k}' not allowed")
            for p, v in (s.get("Properties") or {}).items():
                if not isinstance(v, str) or not v.startswith("="):
                    errors.append(f"screen {sname}.{p}: must start with '='")
            seq(s.get("Children") or [], "Screen", None, "", str(sname))
    elif isinstance(doc, list):
        seq(doc, "Screen", None, "", "(paste)")
    else:
        errors.append("top level must be 'Screens:' or a '- Name:' list")

if __name__ == "__main__":
    for f in sys.argv[1:]:
        main(f)
    for w in warns: print("WARN ", w)
    for e in errors: print("ERROR", e)
    print(f"{len(errors)} error(s), {len(warns)} warning(s), {len(names)} names")
    sys.exit(1 if errors else 0)
