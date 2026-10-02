# YAML + Power Fx authoring guide (White Board app)

This guide is for agents who write paste-able Power Apps canvas YAML for the White Board app. The person pasting it is **not a developer**: everything you hand over must paste first time, so follow this guide exactly.

- Behaviour of each screen: `app-spec.md`. List and data rules (delegation, write helper, status model): `list-design.md`. Where this guide and `list-design.md` disagree on data, `list-design.md` wins.
- Checked on 2026-10-02 against the sources in section 13. Labels used below:
  - **VERIFIED**: seen in Microsoft docs or source, or in real Studio-generated `.pa.yaml` files.
  - **UNCERTAIN**: secondary source, inference, or conflicting sources. Section 11 lists the fallback to use.
  - **POLICY**: our own rule, chosen for safety. Not a Power Apps requirement, but follow it anyway.

---

## 1. The rules on one page

1. **Classic controls only**, using the exact type strings in section 6. **Never** use `Text@…`, `Button@…`, `TextInput@…` or any `Modern…` type. Those are modern (Fluent) controls with different property names. (POLICY; the type strings are VERIFIED)
2. **Every property value is a formula that starts with `=`**: `Width: =320`, `Text: ="Punch"`, `Visible: =true`. (VERIFIED)
3. **Use a `|-` block** for any formula that contains `:`, `#`, `{`, a line break, an emoji, or any other non-ASCII character such as ▲ ✓ 📅. The `=` goes at the start of the first content line, never on the `|-` line. (VERIFIED rule; "any colon/hash" is POLICY)
4. **Indent with 2 spaces. Never use tabs.** (VERIFIED)
5. **Control names** use only letters, digits and `_`, start with a letter, and are **unique across the whole app**, not just the screen. Use the scheme in section 4.4. (VERIFIED + POLICY)
6. **Children order is z-order.** The first child is at the back and the last is on top. In an AutoLayout container, it is the left→right or top→bottom order instead. (VERIFIED)
7. **Gallery template controls go directly in the gallery's `Children:`.** There is no template node. `Parent.TemplateWidth` and `Parent.TemplateHeight` work **only on direct children** of the gallery. (VERIFIED)
8. **Always write `Variant`** on Gallery (`Vertical`, `Horizontal` or `VariableHeight`) and GroupContainer (`ManualLayout` or `AutoLayout`). **Never write `Variant`** on any other control. (VERIFIED strings; POLICY)
9. **An AutoLayout container always sets `LayoutDirection`.** Each of its children always sets `FillPortions` (`=0` for a fixed size, `=1` to stretch) and the matching `LayoutMinWidth` or `LayoutMinHeight`. (VERIFIED properties; POLICY to always write them)
10. **The canvas is fixed at 1366 × 768 (Tablet, Scale to fit on).** Position screen-level controls with absolute `X`, `Y`, `Width` and `Height`. Use AutoLayout only for rows and stacks inside a panel. (POLICY from `app-spec.md`)
11. **Set every visual property yourself:** `Fill`, `Color`, `BorderColor`/`BorderThickness`, `HoverFill`, `PressedFill`, `PressedColor` and `FocusedBorderThickness`. Defaults come from the theme and are light-on-light. (VERIFIED defaults; POLICY)
12. **One screen per paste**, written as `Screens:` + screen name + `Properties` + `Children`. For a change to an existing screen, prefer a **property patch** (section 3.6) over re-pasting the screen.
13. **The App object can't be pasted.** `App.Formulas`, `App.OnStart` and `App.StartScreen` are typed into the formula bar, **without** the leading `=`. (VERIFIED)
14. **Paste order:** data source → `App.Formulas` → `App.StartScreen` → screens. A screen that refers to a name that doesn't exist yet pastes with errors. (POLICY)
15. **Behaviour functions** (`Set`, `UpdateContext`, `Patch`, `Navigate`, `Notify`, `Refresh`, `Reset`, `Copy`, `Select`) only go in `On…` properties. (VERIFIED)
16. **Every query that reaches `TheWhiteBoard` must be delegable** (`list-design.md` pitfall 1). Everything else runs on `ActiveJobs` or `IncomingJobs`. (VERIFIED)
17. **Every write uses the write helper** (`list-design.md` pitfall 3), wrapped in `IfError(…, Notify(…))`. (VERIFIED functions)
18. **Inside galleries, use `Classic/Button` for anything that writes.** Don't attach `OnChange` or `OnCheck` writes to a Toggle, CheckBox, DatePicker or ComboBox in a gallery. They fire when data refreshes, not just when a person taps them. (VERIFIED, Learn gallery best practices)
19. **Never size or count from `Gallery.AllItems` or `AllItemsCount`.** These only hold the items loaded into view. Use `CountRows(<the Items expression>)`. (VERIFIED)
20. **Run `palint.py` (appendix A) on every snippet** before handing it over. It must report 0 errors. (POLICY)

---

## 2. One-time setup the person does (before any paste)

Give these steps as written. Each one says where to click.

1. **Browser.** Use Microsoft Edge or Chrome at https://make.powerapps.com. The first time they paste, the browser asks for clipboard access: click **Allow**. If pasting does nothing, go to Edge **Settings → Cookies and site permissions → Clipboard** and add `https://make.powerapps.com` to **Allow**. (VERIFIED, Learn code view)
2. **Create the app.**
   - In make.powerapps.com, open the environment IT gave you ('Production PowerApps', top-right environment picker).
   - Go to **Create → Blank app → Blank canvas app**. Name it `White Board`, choose Format **Tablet**, and click **Create**.
3. **Display settings.** Open **Settings** (gear icon, top bar) **→ Display**. Make sure **Scale to fit** is **On** and **Lock aspect ratio** is **On**. The size is the default 16:9 (1366 × 768).
4. **Row limit.** Go to **Settings → General → Data row limit** and set it to **2000**. (VERIFIED: the allowed range is 1–2000)
5. **New analysis engine** (only needed if a snippet uses user-defined functions). Go to **Settings → Updates → New**. Make sure **New analysis engine** is **On**; it's on by default for new apps. (VERIFIED, UDF GA blog 2025-09)
6. **Leave formula-level error management on.** Under **Settings → Updates → Retired**, keep "Disable formula-level error management" **Off**. (VERIFIED)
7. **Data.**
   - Click the **Data** icon (cylinder) on the left rail, then **Add data**.
   - Search for **SharePoint**, pick the connection and then the team site.
   - Tick **TheWhiteBoard** and click **Connect**.
8. **Named formulas.**
   - In the **Tree view** (layers icon on the left rail), click **App**.
   - In the property dropdown at the top-left of the formula bar, choose **Formulas**.
   - Paste the text the agent gives you.
9. **Start screen.** Still on **App**, choose **StartScreen** in the property dropdown and paste the text the agent gives you. Do this after the screens it names exist.

---

## 3. The paste procedure

### 3.1 Pasting a whole screen (`Screens:` snippet)

1. Copy the whole YAML block. Use the copy button on the code block; don't select by hand, because a missed first or last line breaks it.
2. In Studio, open **Tree view** (layers icon on the left rail) and the **Screens** tab.
3. **Right-click any screen name** (or hover it and click **…**) and choose **Paste**. Older builds call it **Paste code**.
4. A new screen appears in the list with the name from the YAML. (Microsoft: "You can also now copy and paste screens!" PnP snippets use this exact step.)
5. Check the screen's name in the Tree view.
   - If it ends in `_1`, `_2` and so on, a screen or control with that name already existed. **Delete the pasted copy**, then follow 3.5.
6. Run the checks in 3.4.

### 3.2 Pasting controls into an existing screen or container (`- Name:` list snippet)

1. Copy the block.
2. In **Tree view**, right-click the **target**:
   - the **screen** name, to paste at screen level, or
   - a **container**, to paste inside it (VERIFIED by PnP: "select the screen or parent container… Right click → Paste").
3. Choose **Paste**. Keyboard alternative: click the target in Tree view and press **Ctrl+V**.
4. Never have a **gallery** selected when you paste unless the agent says so. The controls would land inside the gallery template.

### 3.3 Pasting a formula into a property (not YAML)

1. Select the control in **Tree view**.
2. Choose the property in the dropdown at the top-left of the formula bar (for example `OnSelect`).
3. Click into the formula bar, press **Ctrl+A**, paste, and press **Enter**.
4. Formula-bar text **never starts with `=`**. That `=` exists only in YAML.

### 3.4 After every paste: checks

1. **Red errors.** Look for red ⊗ marks in Tree view, or open **App checker** (stethoscope icon, top right).
   - If an error says *"Name isn't recognized"* for a control that does exist, the reference was pasted before its target existed. Fix: select the control, open that property, click into the formula bar, type a space at the end, delete it, and press **Enter**. This re-evaluates the formula. PnP gives the same advice ("re-paste the formula back so that the control names resolve correctly").
2. **Delegation warnings** (yellow triangle, blue underline). Any warning on a formula that uses `TheWhiteBoard` is a bug: report it to the agent.
3. **Look at the screen** in Preview (**F5** or ▷ at the top right). Press **Esc** to leave.
   - Timers only run in Preview, not in the editor. (VERIFIED)
4. **Save**: **Ctrl+S**, or the save icon at the top right.

### 3.5 Replacing a screen that already exists

Studio does not overwrite on paste. It adds a copy and renames anything whose name clashes, which leaves formulas pointing at the old controls (UNCERTAIN in detail, but the `_1` suffixes are real).

1. **Back up** the old screen: right-click it in Tree view → **Copy**, paste into Notepad, and save the file. Screens can be copied as code (GA blog).
2. Delete the old screen: right-click → **Delete**. This frees every control name on it.
3. Paste the new screen (3.1), then check that no name ends in `_1`.
4. Other screens' `Navigate(scrPunch…)` formulas may show errors until they are re-evaluated (UNCERTAIN). Open App checker and apply the "type a space" fix from 3.4 to each flagged formula.
5. If anything goes wrong, delete the new screen and paste the backup back.
6. **Agents:** only ask for this when the structure changes, meaning controls were added, removed or re-nested. For anything else, use 3.6.

### 3.6 Property patch format (preferred for small changes)

Agents hand small fixes over as a table. The person applies them with 3.3.

| Screen | Control | Property | New formula (paste into formula bar) |
|---|---|---|---|
| scrPunch | btnPunGaugeNeed | Fill | `If(ThisItem.Need14, clrYellow, clrGrey)` |

Rules for the agent:
- Write the formula exactly as it goes in the formula bar: **no leading `=`**, no YAML indentation.
- If the formula is long, give it as its own code block under the table.

### 3.7 When a paste fails

Ask the person to send:
- the **exact error text** (a screenshot is fine);
- the **paste number** from the hand-over;
- what was selected in Tree view when they pasted.

Studio validates the code before it creates anything. A failed paste therefore creates **nothing**, so it's safe to paste again after a fix. (VERIFIED: "The code is validated before the new control is created.")

### 3.8 Hand-over format (agents)

Number every paste and give each one this header:

```
PASTE 3 of 7: screen scrPunch (new screen)
Before this: Pastes 1-2 done (App.Formulas, StartScreen). TheWhiteBoard connected.
Where: Tree view → right-click any screen → Paste.
After: run the 3.4 checks. Expected: 0 errors.
```

Keep each paste under about 800 YAML lines. No size limit is documented, but large pastes are hard to debug. Split big screens: paste the screen with its outer containers first, then paste each panel's children into its container (3.2).

---

## 4. YAML shape

### 4.1 Whole screen

```yaml
Screens:
  scrPunch:
    Properties:
      Fill: =clrPage
      OnVisible: |-
        =UpdateContext({locPanel: ""});
        Set(gblScreen, "punch")
    Children:
      - conPunHeader:
          Control: GroupContainer@1.5.0
          Variant: AutoLayout
          Properties:
            LayoutDirection: =LayoutDirection.Horizontal
          Children:
            - lblPunTitle:
                Control: Label@2.5.1
                Properties:
                  FillPortions: =1
                  LayoutMinWidth: =120
                  Text: ="Punch"
```

- A screen allows **only** `Properties` and `Children`. There is no `Control:` line, and `Screen` is not a control type. (VERIFIED, schema)
- Screen properties we use: `Fill`, `OnVisible`, `OnHidden`. Leave out `Width` and `Height`; the Tablet defaults are right.
- `Screens:` starts in column 0, the screen name is indented 2 spaces, and its keys 4.

### 4.2 Control list (pasted into a screen or container)

```yaml
- lblPunBanner:
    Control: Label@2.5.1
    Properties:
      Text: ="Ship dates moved"
- btnPunAck:
    Control: Classic/Button@2.2.0
    Properties:
      Text: ="OK"
```

- Every item is `- Name:` followed by a body indented 4 spaces past the dash column. Several top-level items in one paste are fine. (VERIFIED)
- Keys allowed in a control body (POLICY subset of the VERIFIED schema): `Control`, `Variant`, `Properties`, `Children`, in that order.
  - Never write `Layout`, `Group`, `IsLocked`, `MetadataKey` or `ComponentName`.
  - Never write an empty `Properties:`. That gives `Named object value cannot be null`.
- `Children:` is allowed only on `Gallery` and `GroupContainer`.

### 4.3 Version suffix

- Always write the exact `Type@x.y.z` from section 6. These are the versions in a Studio export from Sept 2026. (VERIFIED)
- Studio uses its own current runtime version and upgrades older ones ("Runtime version of the control is defined by the authoring version", Learn).
- Never mix two versions of the same type in one paste.
- If a paste fails with a message that names a version, follow section 11, item U1.

### 4.4 Names (POLICY, unique app-wide)

The pattern is `<type prefix><screen code><Thing>`, for example `galPunBoard`, `btnTurGauge`, `lblTvClock`.

| Type prefixes | Screen codes |
|---|---|
| `con` container, `gal` gallery, `lbl` label, `btn` button | `Hom` home, `Pun` punch, `Asm` assembly |
| `txt` text input, `dd` dropdown, `dp` date picker | `Nes` nesting, `Tur` turret, `Ben` bending |
| `tgl` toggle, `chk` check box, `ico` icon | `Tv` TV, `Imp` import |
| `rec` rectangle, `cir` circle, `tmr` timer | `T1`/`T2`/`T3` test snippets only |

- Screens are named `scrHome`, `scrPunch`, `scrAssembly`, `scrNesting`, `scrTurret`, `scrBending`, `scrTV` and `scrImport` (from `app-spec.md`).
- Variables: `gbl…` for globals (`Set`), `loc…` for screen-local (`UpdateContext`). Named formulas: `clr…` for colours, plus the data names `ActiveJobs` and `IncomingJobs`.
- A name that `app-spec.md` gives explicitly (for example `varMachine`) wins over this scheme.
- Never reuse a name, even on another screen, and never give a variable or named formula the same name as a control.

### 4.5 Order and z-order

- Within `Children`, list backgrounds first and overlays last. A panel that must cover the board, such as the edit panel, is the **last** child of the screen.
- Within an AutoLayout container, the list order **is** the visual order.
- Inside a ManualLayout container, positions are relative to the container's top-left.

---

## 5. Writing formulas inside YAML

### 5.1 Inline or block?

Write a formula **inline** (`Prop: =…` on one line) only if **all** of these are true:
- it fits on one line, under about 100 characters;
- it has **no `:`** anywhere, including inside strings (`"h:mm"`, `"Jobs: "`) and records;
- it has **no `#`** anywhere (`"Find job #"`, `"#0f172a"`);
- it has **no `{` or `}`**, so no records, `UpdateContext({…})` or `$"…{x}…"`;
- it is **plain ASCII**, so no 📅 ✨ ⚠ ▲ ▼ ✓ ✎ • – or curly quotes;
- it has no trailing spaces.

Use a `|-` block for **everything else**:

```yaml
            OnSelect: |-
              =UpdateContext({locPanel: "edit", locId: ThisItem.ID});
              Reset(txtPunEditNotes)
            Text: |-
              ="📅 " & Text(ThisItem.ShipDate, "m/d")
```

Why (VERIFIED): YAML ends a plain value at `": "` and treats `" #"` as the start of a comment. The comment case is silent: `HintText: ="Find job #"` is cut to `="Find job` and then fails as an unterminated string. Studio itself switches to a block for `" #"`, `": "`, line breaks and emoji. The parse error `While scanning a plain scalar value, found invalid mapping` names no control and no line, which makes it expensive to find afterwards.

### 5.2 Block rules (VERIFIED)

- Write `|-`, then put the formula on the next lines, indented **2 spaces more than the property name**.
- The `=` is the first character of the first content line.
- **Every** following line must be indented at least as far as that first line. A line indented less ends the block and breaks the paste. Blank lines inside are fine.
- Inside a block, nothing needs escaping. Power Fx strings use `"…"`, and a quote inside a string is `""`. Names with spaces use `'…'`.
- Don't use `>` or `>-` folded blocks; they join lines. Don't use YAML `'…'` or `"…"` quoting for formulas, because Power Fx `'names'` and `""` make the escaping error-prone.

### 5.3 Other formula rules

- **Comments:** use Power Fx `//` or `/* */` inside a block (VERIFIED). Never put a YAML `# comment` in a snippet: Studio throws it away, and a misplaced `#` cuts a formula.
- **No empty formulas.** Leave the property out instead of writing `OnSelect: =` (Studio writes that, but we don't need it).
- **Separators:** write en-US syntax. `,` separates arguments, `;` chains behaviour steps, `.` is the decimal point. Studio stores YAML in this invariant form. (VERIFIED for the file format; for a person whose Studio uses `;` separators, see U7.)
- **Colours:** use `RGBA(r, g, b, a)` or the `clr…` named formulas (8.2). Never use `ColorValue("#…")`, because it brings `#` into the YAML.
- **Enums** are written in full: `=FontWeight.Bold`, `=Align.Center`, `=LayoutDirection.Horizontal`, `=Icon.ChevronUp`, `=DisplayMode.Disabled`, `=NotificationType.Error`.
- **Booleans** are `=true` and `=false`. Text is `="…"`. Numbers are bare: `=56`.
- **Unicode glyphs** may go in a `|-` block. The safer alternative is `UniChar(9650)` for ▲ and `UniChar(9660)` for ▼, which keeps the YAML ASCII.

---

## 6. Approved controls (exact strings)

Versions come from the Sept 2026 Studio export (KCoderVA/578-EHRM-TrainingBookingApp) and its control templates; property names and defaults come from those templates. (VERIFIED)

| Use | `Control:` | `Variant:` | Main output |
|---|---|---|---|
| Text | `Label@2.5.1` | none | none |
| Button, pill, badge | `Classic/Button@2.2.0` | none | `.Pressed` |
| Text box | `Classic/TextInput@2.3.2` | none | `.Text` |
| Drop-down | `Classic/DropDown@2.3.1` | none | `.Selected.Value` |
| Date picker | `Classic/DatePicker@2.6.0` | none | `.SelectedDate` |
| Toggle switch | `Classic/Toggle@2.1.0` | none | `.Value` |
| Check box | `Classic/CheckBox@2.1.0` | none | `.Value` |
| Icon | `Classic/Icon@2.5.0` | none | none |
| Rectangle | `Rectangle@2.3.0` | none | none |
| Circle | `Circle@2.3.0` | none | none |
| Timer | `Timer@2.1.0` | none | `.Value` |
| Gallery | `Gallery@2.15.0` | `Vertical`, `Horizontal` or `VariableHeight` | `.Selected`, `.AllItems` (see rule 19) |
| Container | `GroupContainer@1.5.0` | `ManualLayout` or `AutoLayout` | none |
| HTML box | `HtmlViewer@2.1.0` | none | none (avoid; see 11) |
| Image | `Image@2.2.3` | none | none (not needed in v1) |

Don't use Form, data cards, ComboBox, Data table, charts, Pen input, or any modern control.

### 6.1 Label: `Label@2.5.1`

- `Text`, `Color` (text colour; default dark grey), `Fill` (default transparent)
- `Size` (default 14), `FontWeight`, `Font` (`=Font.'Segoe UI'`), `Italic`
- `Align` (`Align.Left/Center/Right`), `VerticalAlign` (default `Middle`)
- `Wrap` (default **true**; set `=false` for one-line text), `AutoHeight` (default false), `Overflow`
- `PaddingLeft/Right/Top/Bottom` (default **5** each; set to `=0` when aligning text)
- `BorderColor`, `BorderThickness`, `X`, `Y`, `Width` (default 150), `Height` (default 40), `Visible`, `OnSelect`, `Tooltip`
- **No radius properties.** For a rounded coloured chip, use a `Classic/Button` (6.2) or put the label in a rounded container.

### 6.2 Button: `Classic/Button@2.2.0`

- `Text`, `OnSelect`, `Fill` (default near-black), `Color` (default white), `Size` (default 13), `FontWeight`
- `BorderThickness` (default **2**; set `=0`), `BorderColor`
- `RadiusTopLeft/TopRight/BottomLeft/BottomRight` (default 10 each; **four separate properties**, no single radius). Use `=1000` or half the height for a pill. (VERIFIED in a Microsoft sample)
- `HoverFill`, `HoverColor`, `PressedFill` (default `Self.Color`), `PressedColor` (default `Self.Fill`). The defaults swap the colours when pressed, so **always set** `PressedFill` and `PressedColor`.
- `DisabledFill`, `DisabledColor`, `DisplayMode` (`DisplayMode.Edit` or `.Disabled`), `FocusedBorderThickness` (default 4; set `=0` on touch screens), `AutoDisableOnSelect`
- `Align`, `VerticalAlign`, `Padding…`, `Visible`, `Tooltip`
- Use Button for gauge pills, ✓ PB/P4, the Nested pill, pair badges (`Text: =Text(ThisItem.PairNo)`) and every tap-to-toggle in a gallery.

### 6.3 Text input: `Classic/TextInput@2.3.2`

- **Always set `Default: =""`**, or the box shows the placeholder "Text input".
- `HintText`, `Mode` (`TextMode.SingleLine`, `.MultiLine` or `.Password`; the enum is `TextMode`), `Format` (`TextFormat.Text` or `.Number`)
- `OnChange`, `DelayOutput` (`=true` waits for typing to pause), `Clear` (an × button; SingleLine only), `MaxLength`, `Reset`, `VirtualKeyboardMode`
- `Fill` (default white), `Color`, `BorderColor`, `BorderThickness` (default 1), `Radius…` (default 5), `Size`, `PaddingLeft` (default 12)
- The output is `.Text`. To clear it from a button: `Reset(txtPunFind)`.

### 6.4 Drop-down: `Classic/DropDown@2.3.1`

```yaml
            Items: =Choices(TheWhiteBoard.Machine)
            Items.Value: =Value
            Default: =If(IsBlank(locMachine), "SB8", locMachine)
```

- For a fixed list, use `Items: =["Auto", "1", "2", "3", "4"]`.
- `Items.Value` is how Studio stores the display column. It's VERIFIED in real files with `Choices(…)`; copy it as shown.
- `Default` is the **text** to preselect (template default `1`; always set it).
- Other properties: `AllowEmptySelection`, `OnChange`, `Reset`, `Fill`, `Color`, `ChevronBackground`, `ChevronFill`, `SelectionFill`, `SelectionColor`, `HoverFill`, `PressedFill`, `BorderColor`.
- The output is `.Selected.Value`. Don't use the deprecated `SelectedText`.

### 6.5 Date picker: `Classic/DatePicker@2.6.0`

- `DefaultDate` (default `Today()`; use `=Blank()` for an empty one), `SelectedDate` (output)
- `Format` (`DateTimeFormat.ShortDate`), `DateTimeZone` (`DateTimeZone.Local`, the default; keep it)
- `IsEditable`, `StartOfWeek` (`StartOfWeek.Monday`), `StartYear`, `EndYear`, `Reset`, `OnChange`, `InputTextPlaceholder`
- Colours: `Fill`, `Color`, `IconFill`, `IconBackground`, `BorderColor`, `CalendarHeaderFill`, `SelectedDateFill`
- Use it only in panels, never inside a gallery (rule 18).

### 6.6 Toggle: `Classic/Toggle@2.1.0`

- `Default`, `TrueFill`, `FalseFill`, `HandleFill`, `ShowLabel` (default true; set `=false` and put your own Label next to it), `TrueText`, `FalseText`, `TextPosition`, `Color`
- `OnChange`, `OnCheck`, `OnUncheck`, `Reset`. The output is `.Value`.
- `ValueFill` and `ValueHoverFill` (listed on Learn) **are not in 2.1.0**; don't use them.
- Use for screen-level filters only ("Show completed"), read through `tglPunShowDone.Value`. No writes from a Toggle.

### 6.7 Check box: `Classic/CheckBox@2.1.0`

- `Text`, `Default`, `OnCheck`, `OnUncheck` (**there is no `OnChange`**), `CheckboxSize` (default 40), `CheckmarkFill`, `CheckboxBackgroundFill`, `CheckboxBorderColor`, `Color`. The output is `.Value`.
- Prefer the Toggle (or a Button) for this app.

### 6.8 Icon: `Classic/Icon@2.5.0`

- `Icon` (`=Icon.ChevronUp`, `Icon.ChevronDown`, `Icon.ChevronLeft`, `Icon.Edit`, `Icon.Check`, `Icon.Cancel`, `Icon.Add`, `Icon.Home`, `Icon.Reload`, `Icon.Warning`, `Icon.Clock`, `Icon.Trash`; all VERIFIED in the 2.5.0 template)
- `Color` (default black), `Fill` (default transparent), `OnSelect`, `Rotation`, `Padding…`, `AccessibleLabel`, `Tooltip`
- Default size is 64 × 64. Touch targets should be **at least 48 × 48**.

### 6.9 Rectangle `Rectangle@2.3.0` / Circle `Circle@2.3.0`

- `Fill`, `BorderColor`, `BorderThickness`, `OnSelect`, `Visible`, `X`, `Y`, `Width`, `Height`
- **No radius** on Rectangle. A rounded shape is a `GroupContainer` with `Radius…`.
- Use a Rectangle for the dark overlay behind a panel: full screen, `Fill: =RGBA(0, 0, 0, 0.55)`.

### 6.10 Timer: `Timer@2.1.0`

- `Duration` (ms; default 60000), `Repeat`, `AutoStart`, `AutoPause` (default true, which pauses when you leave the screen), `OnTimerEnd`, `OnTimerStart`, `Start`, `Reset`
- Always set `Visible: =false`. Example in 8.10.

### 6.11 Gallery: `Gallery@2.15.0`

| Variant | Meaning (template variant, VERIFIED by matching) |
|---|---|
| `Vertical` | blank vertical gallery (`galleryVertical`) |
| `Horizontal` | blank horizontal gallery (`galleryHorizontal`) |
| `VariableHeight` | blank flexible-height gallery (`variableTemplateHeightGallery`) |

- **Always set:** `Items`, `TemplateSize` (row height, or column width for Horizontal; default formula 280–320), `TemplatePadding` (default **5**; we use `=0` and put spacing in the card), `X`, `Y`, `Width`, `Height`.
- **Also set:**
  - `Fill: =RGBA(0, 0, 0, 0)` and `BorderThickness: =0`;
  - `ShowScrollbar` (default true);
  - `DelayItemLoading: =false` and `LoadingSpinner: =LoadingSpinner.None` (blank galleries default to true and `.Data`);
  - `TemplateFill` (default transparent) for a selected-row highlight.
- Optional: `WrapCount` (columns, 1–10), `OnSelect`, `Selectable`, `Transition` (`Transition.None`).
- **Never write** `Layout`. It's hidden and set by the Variant; Studio never writes it.
- Don't write `Default` either. It isn't needed, and one community source reports an error.
- Inside the template, `ThisItem` is the current row. `Parent.TemplateWidth` and `Parent.TemplateHeight` only work on direct children.
- **Pattern:** the gallery's first child is a **card container** (ManualLayout) sized `Width: =Parent.TemplateWidth`, `Height: =Parent.TemplateHeight - gap`. Every other control goes inside the card.
- Nesting: at most **2 levels** (a gallery in a gallery). (VERIFIED)

### 6.12 Container: `GroupContainer@1.5.0`

| You want | Write |
|---|---|
| Free positioning (cards, panels) | `Variant: ManualLayout` |
| Row (left→right) | `Variant: AutoLayout` + `LayoutDirection: =LayoutDirection.Horizontal` |
| Stack (top→bottom) | `Variant: AutoLayout` + `LayoutDirection: =LayoutDirection.Vertical` |

- **Container properties:** `Fill`, `BorderColor`, `BorderThickness`, `BorderStyle`, `RadiusTopLeft/TopRight/BottomLeft/BottomRight` (default 0), `DropShadow` (`DropShadow.None`, `.Light`, `.Semilight`, `.Regular`, `.Semibold`, `.Bold`, `.ExtraBold`; write `=DropShadow.None` on a flat dark UI), `PaddingTop/Bottom/Left/Right` (default 0), `Visible`, `X`, `Y`, `Width`, `Height`.
- **AutoLayout only:**
  - `LayoutGap`;
  - `LayoutAlignItems` (cross-axis: `LayoutAlignItems.Start`, the default, `.Center`, `.End` or `.Stretch`);
  - `LayoutJustifyContent` (main axis: `LayoutJustifyContent.Start`, the default, `.Center`, `.End` or `.SpaceBetween`);
  - `LayoutWrap` (default false);
  - `LayoutOverflowX` and `LayoutOverflowY` (`LayoutOverflow.Hide`, the default, or `.Scroll`).
- **On each child of an AutoLayout container:**
  - `FillPortions`: `=0` means fixed at `Width`/`Height`; `=1` or more takes a share of the free space. **Always write it.** Containers and galleries default to 1 and everything else to 0, which is easy to get wrong.
  - `LayoutMinWidth` (horizontal parent) or `LayoutMinHeight` (vertical parent): **always write it**. Use the fixed size for `FillPortions: =0` children and a sensible minimum for stretching ones.
  - `AlignInContainer` (`AlignInContainer.SetByContainer`, the default, `.Start`, `.Center`, `.End` or `.Stretch`): only to override the parent's `LayoutAlignItems`.
  - Leave out `X` and `Y`; AutoLayout ignores them.
- **Never write** `LayoutMode` (implied by the Variant) or `Variant: GridLayout` (preview).
- Never use the 2024 preview names `horizontalAutoLayoutContainer`, `verticalAutoLayoutContainer` or `manualLayoutContainer`.
- `FlexibleHeight` and `FlexibleWidth` are **not properties**. The Studio "Flexible width" switch is `FillPortions`.

### 6.13 Enum values (VERIFIED)

| Enum | Values |
|---|---|
| FontWeight | Normal, Semibold, Bold, Lighter |
| Align / VerticalAlign | Left, Center, Right, Justify / Top, Middle, Bottom |
| DisplayMode | Edit, View, Disabled |
| TextMode / TextFormat | SingleLine, MultiLine, Password / Text, Number |
| LayoutDirection | Horizontal, Vertical |
| LayoutAlignItems | Start, Center, End, Stretch |
| LayoutJustifyContent | Start, Center, End, SpaceBetween |
| AlignInContainer | SetByContainer, Start, Center, End, Stretch |
| LayoutOverflow | Hide, Scroll |
| BorderStyle | Solid, Dashed, Dotted, None |
| NotificationType | Error, Warning, Success, Information |
| ScreenTransition | None, Fade, Cover, CoverRight, UnCover |
| StartOfWeek | Sunday, Monday |
| SortOrder | Ascending, Descending |
| TimeUnit | Days, Months, Years, Hours, Minutes |

---

## 7. Layout recipes for this app

### 7.1 Screen skeleton (fixed 1366 × 768)

| Region | Control | Position |
|---|---|---|
| Header bar | AutoLayout Horizontal container | X 0, Y 0, W 1366, H 64 |
| Left tray (Punch, Assembly) | ManualLayout container with a Vertical gallery inside | X 0, Y 64, W 300, H 704 |
| Board | containers and galleries | X 300 (or 0), Y 64, W rest, H 704 |
| Overlay | Rectangle, then panel container | last children; full screen / centred |

- Screen-level controls use literal numbers or `Parent.Width` and `Parent.Height`. Formulas that refer to sibling controls (`conPunHeader.Height`) work, but each one is a paste-order risk (3.4). Prefer constants.

### 7.2 Panels and overlays

- A panel is a ManualLayout container with `Visible: =locPanel = "edit"`. Put a full-screen Rectangle overlay just before it in `Children`, with the same `Visible` and `OnSelect: =UpdateContext({locPanel: ""})` (in a `|-` block).
- Both go **last** in the screen's `Children`, so they sit on top.
- Open a panel with `UpdateContext({locPanel: "edit", locId: ThisItem.ID})` and close it with `UpdateContext({locPanel: ""})`.
- Controls inside the panel read the job through `LookUp(ActiveJobs, ID = locId)`. Put that `LookUp` in a named formula or a `With()`; never use `gal.Selected` (rule 18 and 8.8).

### 7.3 Cards

- A card is a ManualLayout container: `Fill: =clrCard`, `BorderColor: =clrBorder`, `BorderThickness: =1`, all four `Radius…` = 8–10, `DropShadow: =DropShadow.None`.
- Children are positioned with `X` and `Y` relative to the card.
- To centre a control vertically: `Y: =(Parent.Height - Self.Height) / 2`. To right-align it: `X: =Parent.Width - Self.Width - 12`.
- A dimmed card (Bending, not TurretDone): there is no opacity property on a container. Instead, swap to muted colours, for example `Color: =If(ThisItem.TurretDone, clrText, clrMuted)`. For pill fills, `ColorFade(c, -50%)` darkens a colour toward black.

### 7.4 Pills and badges

- A pill is a `Classic/Button` with `Radius… = Height/2`, `BorderThickness: =0`, a fixed `Width`, and explicit `Fill`, `Color`, `HoverFill`, `PressedFill` and `PressedColor`.
- Six gauge pills in a row: a Horizontal AutoLayout container (`LayoutGap: =6`, `FillPortions: =0` on each pill) inside the card. Alternatively, six buttons with `X: =12 + n * 52`. Both work; the container is easier to keep aligned.
- To hide a pill: `Visible: =…`. Whether a hidden child gives up its space in AutoLayout is UNCERTAIN (U5). For rows whose members appear and disappear, use ManualLayout with computed X.

### 7.5 Day bands (Punch, Assembly, TV)

- Use a nested gallery (Example 3): an outer `VariableHeight` gallery of bands, and inside it an inner `Vertical` gallery of cards with `Height: =CountRows(ThisItem.Cards) * <row>`.
- Build the band rows **with their card table as a column** in the outer `Items`:

```
AddColumns(
    BandDays As b,
    Cards, SortByColumns(Filter(ActiveJobs, Machine.Value = "SB8" && PunchDay = b.Day), "GroupOrder", SortOrder.Ascending, "PairNo", SortOrder.Ascending, "PunchOrder", SortOrder.Ascending, "ID", SortOrder.Ascending)
)
```

- `BandDays` is a local table of band dates, and the sort keys follow `list-design.md` pitfall 11. All of this runs locally, because ActiveJobs is already in memory.
- Inside the inner gallery, `ThisItem` is the **card**. Any band field a card needs must be copied into the card rows when they are built.
- Two machine columns side by side: two outer galleries (`galPunSB8`, `galPunSB15`), each 520 px wide. That's simpler than a Horizontal outer gallery.

---

## 8. Power Fx rules for this app

### 8.1 Where formulas go

| Kind | Where | Leading `=`? |
|---|---|---|
| Control and screen properties | YAML `Properties:` | yes |
| `App.Formulas`, `App.StartScreen`, `App.OnStart` | formula bar on **App** (2.8, 2.9) | **no** |
| Property patches | formula bar (3.3) | **no** |

### 8.2 Named formulas (`App.Formulas`): VERIFIED GA

- Syntax: `Name = expression;`. Every definition ends with `;`, and they can appear in any order.
- They can refer to each other, but not in a circle.
- **No behaviour functions** (`Set`, `Patch`, `Collect`, `Notify`…).
- They always recalculate: when a `Patch` or `Refresh(TheWhiteBoard)` changes the data, every formula and gallery that uses them updates. That's why the working set lives here and not in collections (`list-design.md` pitfall 2).
- Whether they pick up **other people's** changes after `Refresh()` is UNCERTAIN (U9); test it.
- Don't make `StartScreen` depend on a variable set in `OnStart`.

Colour tokens, as typed into **App → Formulas** (no leading `=`):

```
clrPage = RGBA(15, 23, 42, 1);
clrCard = RGBA(30, 41, 59, 1);
clrBorder = RGBA(51, 65, 85, 1);
clrText = RGBA(229, 231, 235, 1);
clrMuted = RGBA(148, 163, 184, 1);
clrGrey = RGBA(71, 85, 105, 1);
clrGreen = RGBA(34, 197, 94, 1);
clrYellow = RGBA(234, 179, 8, 1);
clrAmber = RGBA(245, 158, 11, 1);
clrRed = RGBA(239, 68, 68, 1);
clrBlue = RGBA(37, 99, 235, 1);
clrSB8 = RGBA(56, 189, 248, 1);
clrSB15 = RGBA(167, 139, 250, 1);
clrBending = RGBA(20, 184, 166, 1);
clrPairs = [RGBA(245, 158, 11, 1), RGBA(34, 211, 238, 1), RGBA(244, 114, 182, 1), RGBA(74, 222, 128, 1), RGBA(167, 139, 250, 1), RGBA(250, 204, 21, 1), RGBA(251, 113, 133, 1), RGBA(96, 165, 250, 1)];
```

- `clrGrey` (#475569) is our choice for "not needed" pills; the spec only says grey.
- Pair colour: `Index(clrPairs, Mod(rank - 1, 8) + 1).Value`, where `rank` is the pair's rank on that board (`list-design.md`). `Index` is VERIFIED; the fallback is `Last(FirstN(clrPairs, n)).Value`.
- The data formulas (`ActiveJobs`, `IncomingJobs` and their added columns) follow `list-design.md` exactly. Add them **below** the colours in the same Formulas box.

### 8.3 User-defined functions (UDFs): VERIFIED GA (2025-09)

They need **New analysis engine** on (2.5).

```
JobLabelOf(num: Text, fan: Text): Text = num & If(!IsBlank(fan), "-" & fan);
SlackDays(assy: Date, ship: Date): Number = DateDiff(assy, ship, TimeUnit.Days);
```

- Behaviour UDF: `Name(p: Number): Void = { Patch(…); Notify(…) };`
- Every parameter and the return type must be typed. **No recursion.**
- **Record or table parameters** need user-defined types (GA May 2026, **Settings → Updates → New → User-defined types**). Avoid them: pass scalars (`id: Number`, `value: Boolean`) instead. That's why the write helper stays an inline pattern rather than one UDF taking a record (U8).

### 8.4 Behaviour vs value properties

- **Behaviour** properties are `OnSelect`, `OnChange`, `OnCheck`, `OnUncheck`, `OnVisible`, `OnHidden`, `OnTimerEnd`, `OnTimerStart`, and `App.OnStart`. Only these may contain `Set`, `UpdateContext`, `Collect`, `ClearCollect`, `Patch`, `Navigate`, `Back`, `Notify`, `Refresh`, `Reset`, `Select`, `Copy` and `Launch`.
- Chain steps with `;`.
- `Navigate` is not allowed in `App.OnStart`. Use `StartScreen`.
- **Value** properties are everything else (`Text`, `Fill`, `Visible`, `Items`…). They must be pure expressions.

### 8.5 Variables

- `Set(gblX, v)` is app-wide. `UpdateContext({locX: v})` belongs to one screen; use it for panel state.
- Read an uninitialised variable and you get Blank. Give panels a known start in the screen's `OnVisible`: `UpdateContext({locPanel: ""})`.
- **Don't bind gallery `Items` to a variable or collection** unless you must. Galleries need the schema when the app loads (VERIFIED, Learn). Bind them to named formulas.

### 8.6 Table shaping (VERIFIED)

- Column names are **plain identifiers** in `AddColumns(T, NewCol, expr)`, `DropColumns(T, Col)`, `RenameColumns(T, Old, New)` and `ShowColumns(T, Col)`. The old `"Quoted"` form is retired.
- **Exception:** `SortByColumns` still takes **strings**:

```
SortByColumns(T, "ShipDate", SortOrder.Ascending, "ID", SortOrder.Ascending)
```

- `Sort(T, expression, SortOrder.Ascending)` takes a formula, which is useful for computed keys, but on a data source the formula can only be one column. That limit doesn't matter on ActiveJobs.
- Use `As` to name the outer row in a nested scope: `AddColumns(ActiveJobs As j, GroupShip, Min(Filter(ActiveJobs, PairNo = j.PairNo), ShipDate))`. Inside it, a bare `PairNo` is the inner row and `j.PairNo` the outer one.
  - `Min` over a Date column is UNCERTAIN (U10). The fallback is `First(Sort(Filter(…), ShipDate)).ShipDate`.
- `With({id: ThisItem.ID, v: !ThisItem.PBDone}, …)` freezes values before a write. Use it in every write (`list-design.md` pitfall 3).
- `CountRows(Filter(ActiveJobs, …))` is for counts, never `gal.AllItemsCount`.

### 8.7 Delegation (summary; `list-design.md` pitfall 1 rules)

**Delegable on SharePoint (VERIFIED, Learn table):**
- `=` on Text, Number, Yes/No, Date and Choice `.Value`;
- `<`, `<=`, `>`, `>=` on Number and Date (**not** on Text, Yes/No, Choice `.Value` or **ID**);
- `StartsWith` on Text (not on Choice);
- `And` / `&&`, `Or` / `||`;
- `Col = Blank()`;
- Sort on a single Number, Text or Date column;
- `Today()` and variables (sent as constants).

**Not delegable:**
- `Not` / `!`, `<>`, `IsBlank()`, `in`, `Search`, and `Sort` on a Choice;
- aggregates (`CountRows`, `Min`, `Sum` on the list);
- `AddColumns` over the list; `UpdateIf` and `RemoveIf`;
- `First`, `Index`, `Last`, `FirstN` and `LastN` on the list. Use `LookUp(TheWhiteBoard, …)` to get one row.

**Only these may touch `TheWhiteBoard` directly:**
- the two named formulas;
- `LookUp(TheWhiteBoard, ID = id)` before a Patch;
- the Import screen's key lookups (`LookUp(TheWhiteBoard, Title = key)`);
- the Find box (`Filter(TheWhiteBoard, JobNumber = txtPunFind.Text)`).

### 8.8 Writes and errors (VERIFIED functions)

```
With({id: ThisItem.ID, v: !ThisItem.PBDone},
    IfError(
        Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {PBDone: v}),
        Refresh(TheWhiteBoard);
        IfError(
            Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {PBDone: v}),
            Notify("Save failed: " & FirstError.Message, NotificationType.Error, 0)
        )
    )
)
```

- That is the shape of the `list-design.md` write helper. Follow that file's version exactly if it differs. In YAML it is a `|-` block, because it contains `{…: …}` and `: `.
- **Value shapes in Patch:**
  - Choice: `{JobStatus: {Value: "Done"}}`
  - Yes/No: `true`
  - Number: `Value(txtX.Text)` or `3`
  - Date: `Date(2026, 10, 2)`, `Today()` or `dpX.SelectedDate`
  - Clear a value: `Blank()`
  - Text: `"…"`
- The Choice shape is VERIFIED in practice (real `.pa.yaml`), not in Microsoft docs. Clearing a Choice with `Blank()` is UNCERTAIN.
- `Patch` returns the saved record. `FirstError.Message` gives the reason.
- `Notify(message, NotificationType.X, timeoutMs)`: the default timeout is 10 s, and `0` means it stays until dismissed. Use it in behaviour properties only.
- **Inside a gallery**, use `ThisItem.…` in a child's `OnSelect`, **never** `galX.Selected`. Event order is undefined. (VERIFIED, Learn)

### 8.9 Start screen and deep links (VERIFIED)

Type this into **App → StartScreen** (no `=`):

```
Switch(Lower(Param("screen")), "punch", scrPunch, "assembly", scrAssembly, "nesting", scrNesting, "sb8", scrTurret, "sb15", scrTurret, "bending", scrBending, "tv", scrTV, "import", scrImport, scrHome)
```

- `Param` names are case-sensitive, and values are always text. `screen` is not a reserved name.
- `StartScreen` can't read variables or collections from `OnStart`. If it errors, the app falls back to the first screen.
- Bookmark URL: `https://apps.powerapps.com/play/e/<environment id>/a/<app id>?tenantId=<tenant id>&screen=punch`.
- On scrTurret: `Coalesce(varMachine, If(Lower(Param("screen")) = "sb15", "SB15", "SB8"))`. `varMachine` is the name `app-spec.md` uses.

### 8.10 Auto-refresh timer (VERIFIED properties)

```yaml
      - tmrPunRefresh:
          Control: Timer@2.1.0
          Properties:
            AutoPause: =true
            AutoStart: =true
            Duration: =60000
            OnTimerEnd: |-
              =If(IsBlank(locPanel), Refresh(TheWhiteBoard))
            Repeat: =true
            Visible: =false
```

- Duration is in ms (60 s here, 30 s on the stations). There is no documented minimum; don't go below 30 s.
- Timers run only in Preview or in the played app, not in the editor.
- Browsers throttle timers in **hidden** tabs, so keep the TV and station tabs in front.

### 8.11 Import screen helpers (VERIFIED functions)

Parse the pasted JSON:

```
IfError(
    With({j: ParseJSON(txtImpPaste.Text)},
        ClearCollect(colImpPaste,
            ForAll(Table(j.jobs) As r,
                {Number: Text(r.Value.number), Unit: Text(r.Value.unit), Ship: Text(r.Value.shipDate), Model: Text(r.Value.model)}))),
    Notify("That isn't valid JSON: " & FirstError.Message, NotificationType.Error, 0)
)
```

- This is a behaviour formula for the Import button's `OnSelect`. A collection is fine here: it holds transient import data, not the working set.
- If a field arrives as a JSON **number**, convert it with `Text(Value(r.Value.x))`. Microsoft's two pages disagree on whether `Text()` alone converts numbers.
- Parse dates with `DateValue(Text(r.Value.shipDate))`, which works on ISO `YYYY-MM-DD` strings.
- Numbers: `Value(j.days)`. A missing field is Blank.
- Compare ship dates **as text**, as `list-design.md` requires.
- No size limit is documented for `ParseJSON` or for a text box (U11).

Regex with named captures:

```
With({m: Match(Upper(ThisItem.ProductModel), "CASRTU\s*(?<sz>\d+)")}, If(!IsBlank(m) && Value(m.sz) >= 1 && Value(m.sz) <= 4, Value(m.sz), Blank()))
```

This is the JobSize parse from `list-design.md`.

- Pattern and options must be constants.
- Use only **named** captures, so it keeps working when Power Apps moves to the V1.0 regex engine.
- `IsMatch` defaults to a whole-string match. `Match` finds a match anywhere in the text.

Clipboard: `IfError(Copy(txtX.Text), Notify("Copy isn't supported here", NotificationType.Warning))`. `Copy` doesn't work in Teams, SharePoint or Power BI embeds.

### 8.12 Dates and text

- `Text(d, "m/d")` gives `10/2` and `Text(d, "ddd mmm d")` gives `Thu Oct 2`. Both contain no colon. **`"h:mm"` contains one, so use a block.**
- `DateDiff(a, b, TimeUnit.Days)`, `DateAdd(d, n, TimeUnit.Days)`.
- `Weekday(d, StartOfWeek.Monday)` returns 1–7 with Monday = 1, so workdays are ≤ 5.
- `Upper(Trim(x))`, `Left(x, 12)`, `Coalesce(a, b)`, `IsBlank(x)`.
- **Date-only columns and time zones:** write with `Date(y, m, d)` or `dp.SelectedDate`, with no manual offsets. The site and devices share one time zone (`list-design.md`). Show the time part while testing, if you suspect an off-by-one-day bug.

---

## 9. Complete known-good examples

These three snippets use only VERIFIED pieces: type strings and properties from the Sept 2026 templates, structure as in Microsoft and PnP Studio exports. They passed `palint.py` and a YAML parser. They use inline sample data and RGBA literals, so they paste into a **blank app**. Use them as a **smoke test** before the first real screen:

- Paste Example 1 as a screen (3.1).
- Select `scrYamlTest` and paste Examples 2 and 3 into it (3.2).
- Press **F5** and tap the buttons: each one shows a banner.
- Then delete `scrYamlTest`, which frees the `T1`/`T2`/`T3` names.

If the smoke test fails, stop and report it (3.7) before writing more YAML.

### Example 1: whole screen with a gallery whose template holds a card container and controls

What it shows:
- the `Screens:` shape;
- a gallery with `Variant: Vertical`;
- template controls directly under the gallery;
- a ManualLayout card using `Parent.TemplateWidth`;
- `|-` blocks for a colon, a record table, an emoji and a behaviour formula;
- a Classic/Button pill and Classic/Icon chevrons.

```yaml
Screens:
  scrYamlTest:
    Properties:
      Fill: =RGBA(15, 23, 42, 1)
    Children:
      - lblT1Title:
          Control: Label@2.5.1
          Properties:
            Color: =RGBA(229, 231, 235, 1)
            FontWeight: =FontWeight.Bold
            Height: =48
            PaddingLeft: =0
            Size: =20
            Text: |-
              ="Test 1: gallery with template children"
            Width: =600
            X: =24
            Y: =76
      - galT1Jobs:
          Control: Gallery@2.15.0
          Variant: Vertical
          Properties:
            BorderThickness: =0
            DelayItemLoading: =false
            Fill: =RGBA(0, 0, 0, 0)
            Height: =600
            Items: |-
              =Table(
                  {Job: "24101-1", Customer: "ACME FANS INC", Size: 2, Ship: Date(2026, 10, 9), Done: false},
                  {Job: "24102", Customer: "NORTHWIND", Size: 3, Ship: Date(2026, 10, 14), Done: true},
                  {Job: "24103-2", Customer: "CONTOSO", Size: Blank(), Ship: Date(2026, 10, 20), Done: false}
              )
            LoadingSpinner: =LoadingSpinner.None
            ShowScrollbar: =false
            TemplatePadding: =0
            TemplateSize: =100
            Width: =620
            X: =24
            Y: =132
          Children:
            - conT1Card:
                Control: GroupContainer@1.5.0
                Variant: ManualLayout
                Properties:
                  BorderColor: =RGBA(51, 65, 85, 1)
                  BorderThickness: =1
                  DropShadow: =DropShadow.None
                  Fill: =RGBA(30, 41, 59, 1)
                  Height: =Parent.TemplateHeight - 8
                  RadiusBottomLeft: =10
                  RadiusBottomRight: =10
                  RadiusTopLeft: =10
                  RadiusTopRight: =10
                  Width: =Parent.TemplateWidth
                  X: =0
                  Y: =4
                Children:
                  - lblT1Job:
                      Control: Label@2.5.1
                      Properties:
                        Color: =RGBA(229, 231, 235, 1)
                        FontWeight: =FontWeight.Bold
                        Height: =34
                        PaddingLeft: =0
                        Size: =18
                        Text: =ThisItem.Job
                        Width: =190
                        X: =16
                        Y: =8
                  - lblT1Size:
                      Control: Label@2.5.1
                      Properties:
                        Color: =If(IsBlank(ThisItem.Size), RGBA(239, 68, 68, 1), RGBA(229, 231, 235, 1))
                        FontWeight: =FontWeight.Semibold
                        Height: =34
                        PaddingLeft: =0
                        Size: =15
                        Text: =If(IsBlank(ThisItem.Size), "SET SIZE", "Size " & ThisItem.Size)
                        Width: =110
                        X: =210
                        Y: =8
                  - lblT1Ship:
                      Control: Label@2.5.1
                      Properties:
                        Color: =RGBA(148, 163, 184, 1)
                        Height: =30
                        PaddingLeft: =0
                        Size: =13
                        Text: |-
                          ="📅 " & Text(ThisItem.Ship, "m/d") & "   " & Left(ThisItem.Customer, 12)
                        Width: =320
                        X: =16
                        Y: =50
                  - btnT1Done:
                      Control: Classic/Button@2.2.0
                      Properties:
                        BorderThickness: =0
                        Color: =RGBA(15, 23, 42, 1)
                        Fill: =If(ThisItem.Done, RGBA(34, 197, 94, 1), RGBA(234, 179, 8, 1))
                        FocusedBorderThickness: =0
                        FontWeight: =FontWeight.Bold
                        Height: =56
                        HoverColor: =Self.Color
                        HoverFill: =ColorFade(Self.Fill, -10%)
                        OnSelect: |-
                          =Notify("Tapped " & ThisItem.Job, NotificationType.Information)
                        PressedColor: =Self.Color
                        PressedFill: =ColorFade(Self.Fill, -25%)
                        RadiusBottomLeft: =28
                        RadiusBottomRight: =28
                        RadiusTopLeft: =28
                        RadiusTopRight: =28
                        Size: =16
                        Text: =If(ThisItem.Done, "Done", "To do")
                        Width: =130
                        X: =Parent.Width - Self.Width - 76
                        Y: =(Parent.Height - Self.Height) / 2
                  - icoT1Up:
                      Control: Classic/Icon@2.5.0
                      Properties:
                        AccessibleLabel: ="Move up"
                        Color: =RGBA(229, 231, 235, 1)
                        Height: =40
                        Icon: =Icon.ChevronUp
                        OnSelect: |-
                          =Notify("Move up " & ThisItem.Job, NotificationType.Information)
                        Width: =56
                        X: =Parent.Width - Self.Width - 8
                        Y: =4
                  - icoT1Down:
                      Control: Classic/Icon@2.5.0
                      Properties:
                        AccessibleLabel: ="Move down"
                        Color: =RGBA(229, 231, 235, 1)
                        Height: =40
                        Icon: =Icon.ChevronDown
                        OnSelect: |-
                          =Notify("Move down " & ThisItem.Job, NotificationType.Information)
                        Width: =56
                        X: =Parent.Width - Self.Width - 8
                        Y: =Parent.Height - Self.Height - 4
```

### Example 2: horizontal auto-layout header bar (control list; paste into a screen)

What it shows:
- `Variant: AutoLayout` + `LayoutDirection.Horizontal`;
- `FillPortions` and `LayoutMinWidth` on every child (the title stretches; the rest are fixed);
- a classic text input with `Default: =""`;
- a toggle read by a button;
- `"Find job #"` in a block (an inline value would be cut at ` #`).

```yaml
- conT2Header:
    Control: GroupContainer@1.5.0
    Variant: AutoLayout
    Properties:
      DropShadow: =DropShadow.None
      Fill: =RGBA(30, 41, 59, 1)
      Height: =64
      LayoutAlignItems: =LayoutAlignItems.Center
      LayoutDirection: =LayoutDirection.Horizontal
      LayoutGap: =12
      LayoutJustifyContent: =LayoutJustifyContent.Start
      PaddingLeft: =16
      PaddingRight: =16
      Width: =Parent.Width
      X: =0
      Y: =0
    Children:
      - lblT2Title:
          Control: Label@2.5.1
          Properties:
            Color: =RGBA(56, 189, 248, 1)
            FillPortions: =1
            FontWeight: =FontWeight.Bold
            Height: =44
            LayoutMinWidth: =120
            PaddingLeft: =0
            Size: =22
            Text: ="Punch"
      - lblT2Clock:
          Control: Label@2.5.1
          Properties:
            Align: =Align.Right
            Color: =RGBA(148, 163, 184, 1)
            FillPortions: =0
            Height: =44
            LayoutMinWidth: =110
            Size: =14
            Text: |-
              =Text(Now(), "h:mm AM/PM")
            Width: =110
      - txtT2Find:
          Control: Classic/TextInput@2.3.2
          Properties:
            BorderColor: =RGBA(51, 65, 85, 1)
            Clear: =true
            Color: =RGBA(229, 231, 235, 1)
            Default: =""
            Fill: =RGBA(15, 23, 42, 1)
            FillPortions: =0
            Height: =44
            HintText: |-
              ="Find job #"
            LayoutMinWidth: =200
            Size: =14
            Width: =200
      - tglT2ShowDone:
          Control: Classic/Toggle@2.1.0
          Properties:
            Default: =false
            FalseFill: =RGBA(71, 85, 105, 1)
            FillPortions: =0
            HandleFill: =RGBA(229, 231, 235, 1)
            Height: =36
            LayoutMinWidth: =64
            ShowLabel: =false
            TrueFill: =RGBA(34, 197, 94, 1)
            Width: =64
      - lblT2ShowDone:
          Control: Label@2.5.1
          Properties:
            Color: =RGBA(229, 231, 235, 1)
            FillPortions: =0
            Height: =44
            LayoutMinWidth: =130
            PaddingLeft: =0
            Size: =14
            Text: ="Show completed"
            Width: =130
      - btnT2Refresh:
          Control: Classic/Button@2.2.0
          Properties:
            BorderThickness: =0
            Color: =RGBA(255, 255, 255, 1)
            Fill: =RGBA(37, 99, 235, 1)
            FillPortions: =0
            FocusedBorderThickness: =0
            Height: =44
            HoverColor: =Self.Color
            HoverFill: =ColorFade(Self.Fill, -15%)
            LayoutMinWidth: =110
            OnSelect: |-
              =Notify("Refresh tapped. Show completed is " & If(tglT2ShowDone.Value, "on", "off"), NotificationType.Information)
            PressedColor: =Self.Color
            PressedFill: =ColorFade(Self.Fill, -30%)
            Size: =15
            Text: ="Refresh"
            Width: =110
      - btnT2Home:
          Control: Classic/Button@2.2.0
          Properties:
            BorderThickness: =0
            Color: =RGBA(255, 255, 255, 1)
            Fill: =RGBA(71, 85, 105, 1)
            FillPortions: =0
            FocusedBorderThickness: =0
            Height: =44
            HoverColor: =Self.Color
            HoverFill: =ColorFade(Self.Fill, -15%)
            LayoutMinWidth: =100
            OnSelect: |-
              =Notify("Home tapped. Search box holds: " & txtT2Find.Text, NotificationType.Information)
            PressedColor: =Self.Color
            PressedFill: =ColorFade(Self.Fill, -30%)
            Size: =15
            Text: ="Home"
            Width: =100
```

### Example 3: nested gallery (bands → cards; control list)

What it shows:
- an outer `VariableHeight` gallery whose rows carry a `Cards` table column;
- the inner `Vertical` gallery as a **direct child** of the outer one, so it may use `Parent.TemplateWidth`;
- inner `Height` from `CountRows(ThisItem.Cards)`, not `AllItems`;
- pair badges as round Classic/Buttons coloured with `Index(...)`.

```yaml
- galT3Bands:
    Control: Gallery@2.15.0
    Variant: VariableHeight
    Properties:
      BorderThickness: =0
      DelayItemLoading: =false
      Fill: =RGBA(0, 0, 0, 0)
      Height: =680
      Items: |-
        =Table(
            {Band: "Unscheduled", Cards: Table({Job: "24101-1", Size: 2, Pair: 0}, {Job: "24102", Size: 3, Pair: 7})},
            {Band: "Thu Oct 2", Cards: Table({Job: "24103-2", Size: 1, Pair: 7})},
            {Band: "Fri Oct 3", Cards: Table({Job: "24104", Size: 4, Pair: 0}, {Job: "24105", Size: 2, Pair: 0}, {Job: "24106-1", Size: 3, Pair: 9})}
        )
      LoadingSpinner: =LoadingSpinner.None
      ShowScrollbar: =true
      TemplatePadding: =0
      TemplateSize: =44
      Width: =660
      X: =680
      Y: =76
    Children:
      - lblT3Band:
          Control: Label@2.5.1
          Properties:
            Color: =RGBA(148, 163, 184, 1)
            FontWeight: =FontWeight.Semibold
            Height: =36
            PaddingLeft: =4
            Size: =14
            Text: |-
              =ThisItem.Band & "  (" & CountRows(ThisItem.Cards) & ")"
            Width: =Parent.TemplateWidth
            X: =0
            Y: =0
      - galT3Cards:
          Control: Gallery@2.15.0
          Variant: Vertical
          Properties:
            BorderThickness: =0
            DelayItemLoading: =false
            Fill: =RGBA(0, 0, 0, 0)
            Height: =CountRows(ThisItem.Cards) * 64
            Items: =ThisItem.Cards
            LoadingSpinner: =LoadingSpinner.None
            ShowScrollbar: =false
            TemplatePadding: =0
            TemplateSize: =64
            Width: =Parent.TemplateWidth
            X: =0
            Y: =36
          Children:
            - conT3Card:
                Control: GroupContainer@1.5.0
                Variant: ManualLayout
                Properties:
                  BorderColor: =RGBA(51, 65, 85, 1)
                  BorderThickness: =1
                  DropShadow: =DropShadow.None
                  Fill: =RGBA(30, 41, 59, 1)
                  Height: =Parent.TemplateHeight - 6
                  RadiusBottomLeft: =8
                  RadiusBottomRight: =8
                  RadiusTopLeft: =8
                  RadiusTopRight: =8
                  Width: =Parent.TemplateWidth
                  X: =0
                  Y: =0
                Children:
                  - lblT3Job:
                      Control: Label@2.5.1
                      Properties:
                        Color: =RGBA(229, 231, 235, 1)
                        FontWeight: =FontWeight.Bold
                        Height: =36
                        PaddingLeft: =0
                        Size: =16
                        Text: =ThisItem.Job
                        Width: =180
                        X: =14
                        Y: =(Parent.Height - Self.Height) / 2
                  - lblT3Size:
                      Control: Label@2.5.1
                      Properties:
                        Color: =RGBA(229, 231, 235, 1)
                        Height: =36
                        PaddingLeft: =0
                        Size: =14
                        Text: ="Size " & ThisItem.Size
                        Width: =90
                        X: =200
                        Y: =(Parent.Height - Self.Height) / 2
                  - btnT3Pair:
                      Control: Classic/Button@2.2.0
                      Properties:
                        BorderThickness: =0
                        Color: =RGBA(15, 23, 42, 1)
                        Fill: |-
                          =Index(
                              [RGBA(245, 158, 11, 1), RGBA(34, 211, 238, 1), RGBA(244, 114, 182, 1), RGBA(74, 222, 128, 1),
                               RGBA(167, 139, 250, 1), RGBA(250, 204, 21, 1), RGBA(251, 113, 133, 1), RGBA(96, 165, 250, 1)],
                              Mod(ThisItem.Pair - 1, 8) + 1
                          ).Value
                        FocusedBorderThickness: =0
                        FontWeight: =FontWeight.Bold
                        Height: =32
                        HoverColor: =Self.Color
                        HoverFill: =Self.Fill
                        PaddingLeft: =0
                        PaddingRight: =0
                        PressedColor: =Self.Color
                        PressedFill: =Self.Fill
                        RadiusBottomLeft: =16
                        RadiusBottomRight: =16
                        RadiusTopLeft: =16
                        RadiusTopRight: =16
                        Size: =13
                        Text: =Text(ThisItem.Pair)
                        Visible: =ThisItem.Pair > 0
                        Width: =32
                        X: =Parent.Width - Self.Width - 14
                        Y: =(Parent.Height - Self.Height) / 2
```

- Whether the flexible-height row really grows with the inner gallery's Height is UNCERTAIN (U4). The Microsoft shiftplanner sample and a PnP feed use this pattern.
- If the smoke test shows rows overlapping or clipped, use the **fallback** in U4.

---

## 10. DO NOT (these break pasting, layout or delegation)

**Paste breakers**
1. A property value without a leading `=` (`Text: Punch`, `Width: 320`).
2. An inline value containing `": "` (`Text: ="Jobs: " & n`) or `" #"` (`HintText: ="Find job #"`). Use `|-`.
3. A record literal inline (`OnSelect: =UpdateContext({locPanel: "edit"})`). Use `|-`.
4. `=` on the `|-` line (`Text: |- =…`), or a block line indented less than the first line.
5. Tabs; YAML `#` comments; `>` folded blocks.
6. Two controls with the same name, in one paste or across the app.
7. Keys other than `Control`/`Variant`/`Properties`/`Children` on a control. Empty `Properties:`. `Children:` on a non-container.
8. `Control: Screen`, a `Control:` line on a screen, or a screen key other than `Properties`/`Children`.
9. Copying App-object YAML (`App:`) or `ComponentDefinitions:` into a paste. `App` can't be pasted.
10. Modern or unversioned look-alikes: `Text@…`, `Button@…`, `TextInput@…`, `Toggle@1.x`, `DropDown@0.x`, `ModernText@…` and so on. Also preview names (`galleryVertical`, `verticalAutoLayoutContainer`) and `Variant: GridLayout`.
11. Properties a control doesn't have: Radius on Label or Rectangle, `ValueFill` on Toggle, `OnChange` on CheckBox, `TextInputMode.*`, `LayoutMode`, `FlexibleHeight`, `Layout` on Gallery.
12. Forms, data cards, components, code components (PCF), Data table, charts.

**Layout breakers**
13. `Parent.TemplateWidth` or `Parent.TemplateHeight` below the first level of a gallery template.
14. An AutoLayout container without `LayoutDirection`, or children without `FillPortions`. A fixed `Width` is silently overridden when `FillPortions` is not 0.
15. A third level of gallery nesting.
16. Sizing or counting from `gal.AllItems` or `gal.AllItemsCount`.
17. Leaving colours to the theme on a dark screen (unreadable dark-on-dark text, a white Button `PressedFill`).

**Delegation and data breakers**
18. `!`, `<>`, `IsBlank()`, `in`, `Search`, `<`/`>` on Text or ID, or `Sort` on a Choice, in any formula that reaches `TheWhiteBoard`.
19. Galleries bound to `TheWhiteBoard` directly, or to collections. Use the named formulas.
20. Writes from Toggle/CheckBox/DatePicker/ComboBox `OnChange`/`OnCheck` inside a gallery. Reading `gal.Selected` in a child control's event.
21. `Patch` without the write helper (`LookUp` base, explicit values, `IfError`, refresh + retry, `Notify`).
22. `UpdateIf`, `RemoveIf` or `Remove` on `TheWhiteBoard`. Rows are never deleted.
23. `Navigate` in `App.OnStart`. Behaviour functions in value properties or named formulas.
24. Typing a leading `=` in the formula bar.

---

## 11. UNCERTAIN: avoid, or use the fallback

| # | Question | What to do |
|---|---|---|
| U1 | Will Studio accept our exact `@versions` forever? They're current as of Sept 2026, and Studio upgrades older ones (community: warning "PA2105", non-blocking). | Keep the versions in section 6. If a paste fails with a version message, ask the person for the real string: insert that control from **Insert** (Classic section), right-click it in Tree view → **View code** → **Copy code**, and paste it into chat. Use that version everywhere. Last resort: drop the `@x.y.z` suffix ("If no version is specified, the most current version is used", Learn; untested for paste). |
| U2 | Pasting a `Screens:` block whose screen or control names already exist. | Studio adds `_1`-style suffixes (strong secondary evidence). Always follow 3.5 (back up, then delete the old screen first) and check names after the paste. |
| U3 | Formulas that refer to controls defined **later** in the same paste, or on another screen, show "Name isn't recognized" after the paste. | Re-enter the formula (3.4). Prefer `Parent`, `Self` and constants to sibling names. Order siblings so referenced ones come first when z-order allows. |
| U4 | A flexible-height (`VariableHeight`) row growing to fit an inner gallery whose Height is computed. | **Fallback (flat list):** one `Vertical` gallery whose rows are either band headers or cards. Build `Items` = `SortByColumns(Ungroup(Table({Rows: HeaderRows}, {Rows: CardRows}), Rows), "BandKey", SortOrder.Ascending, "IsHeader", SortOrder.Descending, "SortKey", SortOrder.Ascending)`, where both row tables have the same columns. In the template, header controls get `Visible: =ThisItem.IsHeader` and card controls `Visible: =!ThisItem.IsHeader`, with one `TemplateSize`. Test `Ungroup` on a sample first. Second fallback: a `Vertical` outer gallery with a fixed `TemplateSize` large enough for the busiest band, and a scrolling inner gallery. |
| U5 | Whether `Visible: =false` children free their space (and gap) in an AutoLayout container. | A Microsoft sample assumes they do. If it matters (pill rows), use ManualLayout with computed `X`. |
| U6 | Paste size limit. | None documented. Keep each paste under about 800 lines; split as in 3.8. |
| U7 | Studio language with `;` argument separators (some European locales). | YAML is stored in the invariant en-US form, so pasting YAML should be unaffected. Formula-bar text (App.Formulas, patches) would need local separators. The person is assumed to use English (US); ask if formulas show errors everywhere. |
| U8 | UDFs with record or table parameters (user-defined types). | Avoid them. Use scalar parameters or inline patterns. |
| U9 | Named formulas showing **other users'** changes after `Refresh(TheWhiteBoard)`. | Test it in the first station build: tick on one device, wait for the timer on another. If it doesn't update, put `Refresh(TheWhiteBoard)` in the timer **and** have galleries read the named formula (already the plan). Report it before adding collections. |
| U10 | `Min()` over a Date column. | Prefer `First(Sort(Filter(…), ShipDate)).ShipDate`. |
| U11 | `ParseJSON` size limit for a 150 KB paste into a MultiLine text box. | Test it with a real CASMFG copy early. |
| U12 | `HtmlViewer`, emoji rendering on the TV browser. | Use Labels and Buttons, not HTML. If an emoji shows as a box on a device, switch to `UniChar()` glyphs or plain text. |
| U13 | Clearing a Choice with `Patch(…, {Machine: Blank()})`. `list-design.md` specifies this; Microsoft documents `Blank()` only in general terms. | Include it in the go-live test. If it fails, report it; don't invent a workaround. |
| U14 | Preview-era snippets (no version, old variant names): "cannot paste" (Learn) vs "should work" (GA blog). | Never use them. |

---

## 12. Agent self-check before handing over YAML

1. Run `python3 palint.py <file>.yaml` (appendix A) on each paste, and once on **all screens together** to catch duplicate names across the app. Fix everything until it reports 0 errors.
2. Re-read section 10 against the snippet.
3. Every name used in a formula exists: in the paste, in an earlier paste, in `App.Formulas`, or as `TheWhiteBoard` and its column names from `list-design.md`.
4. Every gallery: `Items`, `TemplateSize`, `TemplatePadding`, a card container, explicit colours.
5. Every write: write helper, `ThisItem` (not `Selected`), Button not Toggle.
6. Every `TheWhiteBoard` query is in the allowed list (8.7).
7. The hand-over header (3.8) is present, with prerequisites and paste location.

### Appendix A: `palint.py`

Copy this to your scratchpad and run it with `python3 palint.py file.yaml`. It needs PyYAML (`import yaml`).

```python
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
```

---

## 13. Sources

**Microsoft documentation** (read from the MicrosoftDocs GitHub source, commit 1bd0194, 2026-10-01):
- Code view: https://learn.microsoft.com/power-apps/maker/canvas-apps/code-view
- YAML format and versions: https://learn.microsoft.com/power-apps/maker/canvas-apps/power-apps-yaml
- SharePoint delegation table: https://learn.microsoft.com/power-apps/maker/canvas-apps/connections/connection-sharepoint-online
- Gallery best practices (AllItems, OnChange loops, Selected): https://learn.microsoft.com/power-apps/maker/canvas-apps/gallery-best-practice
- Gallery control (nesting): https://learn.microsoft.com/power-apps/maker/canvas-apps/controls/control-gallery
- Flexible-height galleries: https://learn.microsoft.com/power-apps/maker/canvas-apps/gallery-dynamic-sizing
- Power Fx reference pages: object-app (named formulas, UDFs, StartScreen), function-table-shaping, function-sort, function-patch, function-iferror, function-param, function-parsejson, function-ismatch, function-copy, control-timer.

**Microsoft blogs:**
- Code view GA (copy and paste screens): https://www.microsoft.com/en-us/power-platform/blog/2025/03/03/code-view-is-now-generally-available/
- UDFs GA (needs the new analysis engine): https://www.microsoft.com/en-us/power-platform/blog/power-apps/power-apps-user-defined-functions-ga/
- User-defined types GA: https://www.microsoft.com/power-platform/blog/2026/05/13/power-fx-user-defined-types-generally-available/

**Schema and parser:**
- Schema: https://raw.githubusercontent.com/microsoft/PowerApps-Tooling/refs/heads/master/schemas/pa-yaml/v3.0/pa.schema.yaml
- Parser and writer: https://github.com/microsoft/PowerApps-Tooling/blob/master/src/Persistence/PaYaml/Serialization/PFxExpressionYamlConverter.cs
- Child layout defaults: https://github.com/microsoft/PowerApps-Tooling/blob/master/src/PAModel/ControlTemplates/DynamicProperties.cs
- Microsoft canvas-app authoring references (YamlSyntax, LayoutGuide, ControlGuide): https://github.com/microsoft/power-platform-skills/tree/main/plugins/canvas-apps/references

**Real Studio output:**
- Sept 2026 export with control templates: https://github.com/KCoderVA/578-EHRM-TrainingBookingApp (`src/powerApps/.unpacked/layoutDefault/Other/Src`, `pkgs/*.xml`)
- Microsoft EAM sample, used to match YAML variants to template variants: https://github.com/microsoft/scmsamples-EnterpriseAssetManagement/tree/main/CanvasAppSource
- Microsoft shiftplanner sample (nested flexible gallery): https://github.com/microsoft/shiftplanner
- PnP snippets (paste steps, nested feed, @1.5.0 AutoLayout): https://github.com/pnp/powerplatform-snippets/tree/main/power-apps
