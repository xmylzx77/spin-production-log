// ==UserScript==
// @name         CASMFG → White Board: copy jobs
// @namespace    captiveaire.runlist.copy
// @version      1.0.2
// @description  One button in CASMFG's top bar: "Copy jobs for White Board". Click it and it reads CASMFG's In-Process CASRTU jobs for the next 180 days under your own sign-in and copies them to the clipboard, ready to paste into the White Board app's Import screen. Read-only.
// @match        https://casmfg.captiveaire.com/*
// @noframes
// @run-at       document-idle
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// ==/UserScript==

/*
 * WHAT THIS DOES
 *   Adds one button, "Copy jobs for White Board", to CASMFG's blue top bar (just left of the "+").
 *   When you click it:
 *     1. It reads the CASMFG sign-in already open in this tab (the same way the older helpers do).
 *     2. It asks CASMFG for the job list once: ship dates from today to 180 days out. If that
 *        fails, or finds no jobs, it asks once more for the old 16-day window instead.
 *     3. It keeps the In-Process jobs whose model contains CASRTU.
 *     4. It copies them to the clipboard as one line of text (import contract v1, see
 *        design/list-design.md). Paste that into the White Board app's Import screen.
 *   The Tampermonkey menu has the same command ("Copy jobs for White Board").
 *
 * WHAT IT NEVER DOES
 *   - It never writes anything to CASMFG. It only reads the job list.
 *   - It never signs in and stores no password, key or token. No sign-in = it just says so.
 *   - It never runs by itself: no schedule, no polling, no keep-alive. Nothing happens until
 *     someone clicks the button, and then it makes that one CASMFG read (two only when the
 *     180-day read fails or finds no jobs, and it asks again for 16 days).
 *   - It talks to nothing but CASMFG itself (same site as this page). Not the NUC, not the
 *     White Board, not anything else. The CASMFG sign-in never leaves CASMFG.
 *   - It never creates CASMFG's browser database if it isn't there.
 *
 * HOW TO INSTALL (on each supervisor PC)
 *   Tampermonkey icon > Create a new script > select everything in the editor and delete it >
 *   paste this whole file > File > Save (Ctrl+S). Reload the CASMFG tab: the button appears in
 *   the top bar.
 *   On any PC that uses this, keep the old "CASMFG → RunList Sync" script DISABLED in Tampermonkey
 *   (toggle it off on the Dashboard). That one signs in by itself and posts to the NUC; this one
 *   replaces it.
 *
 * Version history
 *   1.0.0  2026-10-02  first version: the read-only copy button for the Power Apps White Board.
 *   1.0.1  2026-10-05  the button is just a clipboard icon (hover for its name).
 *   1.0.2  2026-10-05  the icon uses CASMFG's own top-bar colour, so it matches the other icons.
 */
(function () {
  'use strict';

  // ---- settings ----
  const LABEL = 'Copy jobs for White Board';
  const JOBS_PATH = '/api/v1/production/jobs';   // CASMFG's own job list (same site as this page)
  const SCOPE = 'ca';
  const WATCH_DAYS = 180;          // the normal look-ahead (the White Board needs to see moved ship dates)
  const WATCH_TIMEOUT_MS = 60000;  // a 180-day list is big; give it a minute
  const NARROW_DAYS = 16;          // the old window - only if the 180-day read fails or comes back empty
  const NARROW_TIMEOUT_MS = 20000;
  const MODEL_MATCH = 'casrtu';    // the RTU line (any capitals)
  const LI_ID = 'wb-copy-li';
  const FLOAT_ID = 'wb-copy-float';
  const TOAST_ID = 'wb-copy-toast';
  const OK_TOAST_MS = 20000;       // a good result closes itself after this; warnings stay until closed
  const DB_TIMEOUT_MS = 5000;      // CASMFG's browser database must answer within this, or we give up
  const CLIP_TIMEOUT_MS = 5000;    // a clipboard write must report back within this, or we try the next way
  const TIMED_OUT = 'timed out';   // marker for "did not answer in time"

  let busy = false;                // one copy at a time (no double clicks)
  let navMissingSince = 0;

  const log = (...a) => console.log('[copy jobs]', ...a);
  const str = (v) => (v === null || v === undefined) ? '' : String(v);
  // Wait for p, but at most ms; after that answer onTimeout instead (so nothing can hang the button).
  const withTimeout = (p, ms, onTimeout) => new Promise((res) => {
    const t = setTimeout(() => res(onTimeout), ms);
    p.then((v) => { clearTimeout(t); res(v); }, () => { clearTimeout(t); res(onTimeout); });
  });

  // ---------------------------------------------------------------- the CASMFG sign-in (this tab)
  // CASMFG keeps its sign-in token in its own browser database ('engine' / 'state'). Read it the same
  // way the older helpers do. Never CREATE the database: open() on a missing name makes an empty one,
  // which can wedge CASMFG's own upgrade - so if it would be created, abort and treat it as signed out.
  // The open can also never answer at all (e.g. CASMFG's own upgrade is blocked by another, older
  // CASMFG tab), so it gives up after DB_TIMEOUT_MS and answers TIMED_OUT. A connection that turns
  // up after that is closed straight away, so it can't hold up CASMFG.
  const openDB = (name) => new Promise((res) => {
    let done = false;
    let timer = 0;
    const finish = (v) => { if (done) return false; done = true; clearTimeout(timer); res(v); return true; };
    timer = setTimeout(() => finish(TIMED_OUT), DB_TIMEOUT_MS);
    try {
      const r = indexedDB.open(name);
      r.onupgradeneeded = () => { try { r.transaction.abort(); } catch (e) { /* ignore */ } finish(null); };
      r.onsuccess = () => {
        const db = r.result;
        if (!finish(db)) { try { db.close(); } catch (e) { /* ignore */ } return; }   // too late - let go of it
        db.onversionchange = () => { try { db.close(); } catch (e) { /* ignore */ } }; // never block CASMFG's upgrade
      };
      r.onerror = () => finish(null);
    } catch (e) { finish(null); }
  });
  const getAll = (db, store) => new Promise((res) => { try { const tx = db.transaction(store, 'readonly'); const rq = tx.objectStore(store).getAll(); rq.onsuccess = () => res(rq.result); rq.onerror = () => res([]); } catch (e) { res([]); } });
  function findToken(o) { if (!o) return null; if (typeof o === 'string') return /^eyJ/.test(o) ? o : null; if (typeof o === 'object') { for (const k in o) { const t = findToken(o[k]); if (t) return t; } } return null; }
  // The token string, null (not signed in), or TIMED_OUT (CASMFG's database did not answer).
  async function getToken() {
    const db = await openDB('engine'); if (!db || db === TIMED_OUT) return db;
    const rows = await withTimeout(getAll(db, 'state'), DB_TIMEOUT_MS, TIMED_OUT);
    try { db.close(); } catch (e) { /* ignore */ }
    return rows === TIMED_OUT ? TIMED_OUT : findToken(rows);
  }
  const deviceFromToken = (token) => { try { return JSON.parse(atob(token)).deviceId || ''; } catch (e) { return ''; } };

  // ---------------------------------------------------------------- dates
  // Both take the same "now" (queryJobs passes one), so a click just before midnight that finishes
  // after it still labels the copy with the dates it actually asked CASMFG for.
  // Ship-date window: today 07:00Z → today+N 04:59:59.999Z (the same shape as the CASMFG grid).
  function dateWindow(days, now) {
    const n = now || new Date(), y = n.getFullYear(), m = n.getMonth(), d = n.getDate();
    return { fromDate: new Date(Date.UTC(y, m, d, 7, 0, 0, 0)).toISOString(), toDate: new Date(Date.UTC(y, m, d + days, 4, 59, 59, 999)).toISOString() };
  }
  // The same range as plain LOCAL calendar dates, which is what the White Board app reasons about.
  function windowYmd(days, now) {
    const n = now || new Date();
    const a = new Date(n.getFullYear(), n.getMonth(), n.getDate());
    const b = new Date(n.getFullYear(), n.getMonth(), n.getDate() + days);
    const f = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
    return { fromYmd: f(a), toYmd: f(b) };
  }

  // ---------------------------------------------------------------- the one CASMFG read
  // POST with a HARD timeout that also covers reading the answer: the 180-day list is big, and a
  // download that stalls halfway would otherwise leave the button stuck on "Copying…".
  async function postJson(url, opts, ms) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    try {
      const res = await fetch(url, Object.assign({}, opts, { signal: ctrl.signal }));
      if (!res.ok) return { ok: false, why: 'HTTP ' + res.status };
      return { ok: true, body: await res.json() };
    } finally { clearTimeout(timer); }
  }

  // One query at a given look-ahead. Same body and headers as the NUC helper's queryJobs().
  // Returns { ok, jobs, ymd } with jobs already filtered and in the import shape (ymd = the local
  // dates this query asked for), or { ok:false, why }. Never throws.
  async function queryJobs(token, days, timeoutMs) {
    try {
      const now = new Date();
      const win = dateWindow(days, now);
      const ymd = windowYmd(days, now);
      const r = await postJson(JOBS_PATH, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'authorization': 'Bearer ' + token, 'x-device-id': deviceFromToken(token) },
        body: JSON.stringify({ scope: SCOPE, status: null, fromDate: win.fromDate, toDate: win.toDate, jobNumber: null, unitNumber: null, forProcessing: false })
      }, timeoutMs);
      if (!r.ok) return r;
      const all = r.body;
      if (!Array.isArray(all)) return { ok: false, why: 'not an array' };
      // THE RULE: In-Process, and the model contains CASRTU (any capitals).
      const jobs = all
        .filter(x => x && x.job && x.job.productionStatus === 'In-Process' && x.product && String(x.product.model || '').toLowerCase().includes(MODEL_MATCH))
        .map(x => ({
          id: str(x.id),
          number: str(x.job.number),
          name: str(x.job.name),
          shipDate: str(x.job.shipDate).slice(0, 10),
          runNumber: str(x.job.runNumber),
          status: str(x.job.productionStatus),
          model: str(x.product.model),
          unit: str(x.product.unitNumber)
        }));
      return { ok: true, jobs, ymd, raw: all.length };
    } catch (e) {
      const why = e && e.name === 'AbortError' ? 'no answer in ' + Math.round(timeoutMs / 1000) + ' s' : ((e && e.message) || String(e));
      return { ok: false, why };
    }
  }

  // ---------------------------------------------------------------- the clipboard
  // Tampermonkey's own copy first: it works even after the long wait for CASMFG, when the browser
  // no longer counts the click as "just now". Then the browser's two ways. Returns true if copied.
  // Each way only counts once it reports success (within CLIP_TIMEOUT_MS), so a copy that quietly
  // failed never shows "Copied" over an older paste still sitting in the clipboard.
  async function copyText(text) {
    try {
      if (typeof GM_setClipboard === 'function') {
        // Tampermonkey calls back once the clipboard is really set.
        const ok = await withTimeout(new Promise((res) => GM_setClipboard(text, 'text', () => res(true))), CLIP_TIMEOUT_MS, false);
        if (ok) return true;
        log('GM_setClipboard did not confirm the copy');
      }
    } catch (e) { log('GM_setClipboard failed', e); }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        const ok = await withTimeout(navigator.clipboard.writeText(text).then(() => true, (e) => { log('clipboard.writeText failed', e); return false; }), CLIP_TIMEOUT_MS, false);
        if (ok) return true;
      }
    } catch (e) { log('clipboard.writeText failed', e); }
    const ta = document.createElement('textarea');
    const before = document.activeElement;
    try {
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0;';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      if (document.execCommand('copy')) return true;
    } catch (e) { log('execCommand copy failed', e); }
    finally {
      ta.remove();   // never leave the hidden copy of the jobs in the page
      try { if (before && before.focus) before.focus(); } catch (e) { /* ignore */ }
    }
    return false;
  }

  // ---------------------------------------------------------------- the click
  async function copyJobs() {
    // Already copying: say so (the menu command can run on pages where the button isn't shown).
    if (busy) { toast('warn', 'Already copying', ['Wait for it to finish.']); return; }
    busy = true;
    paint();
    try { await copyOnce(); }
    catch (e) { toast('warn', 'Nothing was copied', ['Something went wrong: ' + ((e && e.message) || e)]); }
    finally { busy = false; paint(); }
  }

  async function copyOnce() {
    // getToken gives up by itself; the outer limit is a second guard so "Copying…" can't stick.
    const token = await withTimeout(getToken(), DB_TIMEOUT_MS * 3, TIMED_OUT);
    if (token === TIMED_OUT) {
      toast('warn', 'Nothing was copied', ["CASMFG's sign-in store in this browser did not answer.",
        'Close any other CASMFG tabs, reload this one, then click the button again.']);
      return;
    }
    if (!token) { toast('warn', 'Sign in to CASMFG first', ['Then click "' + LABEL + '" again.']); return; }

    // WIDE FIRST: 180 days is what lets the White Board see a ship date that moved far out.
    let days = WATCH_DAYS;
    let q = await queryJobs(token, WATCH_DAYS, WATCH_TIMEOUT_MS);
    let fellBack = '';           // why the 180-day read wasn't used (only set when days = 16)
    // FALL BACK to the old 16-day read if the wide one fails or finds nothing (same as the NUC helper).
    if (!q.ok || !q.jobs.length) {
      const why = q.ok ? 'no matching jobs' : q.why;
      const narrow = await queryJobs(token, NARROW_DAYS, NARROW_TIMEOUT_MS);
      if (narrow.ok && (!q.ok || narrow.jobs.length)) {
        log('wide ' + WATCH_DAYS + 'd query unusable (' + why + ') - fell back to ' + NARROW_DAYS + 'd');
        q = narrow; days = NARROW_DAYS; fellBack = why;
      } else if (!q.ok) {
        // Both reads failed: report both reasons, and ask for a fresh sign-in if either says so.
        const both = WATCH_DAYS + '-day: ' + why + '; ' + NARROW_DAYS + '-day: ' + narrow.why;
        const lines = ['CASMFG did not give the job list (' + both + ').'];
        if (/HTTP 40[13]/.test(why) || /HTTP 40[13]/.test(narrow.why)) lines.push('CASMFG says this tab is not signed in. Sign in again, then click the button again.');
        else lines.push('Try again in a minute. Your clipboard was not changed.');
        toast('warn', 'Nothing was copied', lines);
        return;
      }
    }

    // The import payload (contract v1 - keep these keys exactly; the White Board app reads them).
    const ymd = q.ymd;           // the local dates of the read actually used
    const payload = { v: 1, pulledAt: new Date().toISOString(), fromYmd: ymd.fromYmd, toYmd: ymd.toYmd, days, jobs: q.jobs };
    const text = JSON.stringify(payload);
    const n = q.jobs.length;
    log('copying', n, 'jobs,', days + 'd window,', q.raw, 'records read');

    if (!(await copyText(text))) { showManualCopy(text, n, days); return; }

    const title = 'Copied ' + n + ' job' + (n === 1 ? '' : 's') + ' (' + days + '-day look-ahead).';
    const lines = ["Paste them into the White Board app's Import screen."];
    if (days === NARROW_DAYS) lines.push('Warning: the ' + WATCH_DAYS + '-day look-ahead failed (' + fellBack + '), so only the next ' + NARROW_DAYS +
      " days were copied. Ship dates moved further out can't be seen - copy again later.");
    if (!n) lines.push('Warning: CASMFG returned no In-Process CASRTU jobs. If that looks wrong, try again in a minute.');
    toast(days === NARROW_DAYS || !n ? 'warn' : 'ok', title, lines);
  }

  // ---------------------------------------------------------------- the message box
  let toastSeq = 0;
  function toastBox(kind) {
    let t = document.getElementById(TOAST_ID);
    if (t) t.remove();
    t = document.createElement('div');
    t.id = TOAST_ID;
    const border = kind === 'ok' ? '#34d399' : '#f59e0b';
    t.style.cssText = 'position:fixed;top:6px;left:50%;transform:translateX(-50%);z-index:2147483000;max-width:600px;' +
      'background:#1d242e;color:#e6edf3;border:2px solid ' + border + ';border-radius:8px;padding:10px 34px 10px 14px;' +
      'font:13px "Segoe UI",sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.45);';
    const x = document.createElement('span');
    x.textContent = '×';
    x.style.cssText = 'position:absolute;top:6px;right:10px;cursor:pointer;font-size:16px;color:#8b97a7;';
    x.addEventListener('click', () => t.remove());
    t.appendChild(x);
    document.body.appendChild(t);
    return t;
  }
  function toast(kind, title, lines) {
    const t = toastBox(kind);
    const h = document.createElement('div');
    h.textContent = title;
    h.style.cssText = 'font-weight:600;margin-bottom:' + (lines && lines.length ? '6px' : '0') + ';';
    t.appendChild(h);
    (lines || []).forEach((l) => { const d = document.createElement('div'); d.textContent = l; d.style.margin = '2px 0'; t.appendChild(d); });
    // A good result closes itself; a warning stays until closed. (Only touches this page.)
    const seq = ++toastSeq;
    if (kind === 'ok') setTimeout(() => { if (seq === toastSeq && t.isConnected) t.remove(); }, OK_TOAST_MS);
  }
  // Last resort: the browser refused every way of copying. Show the text, already selected, so a
  // Ctrl+C does it by hand.
  function showManualCopy(text, n, days) {
    ++toastSeq;
    const t = toastBox('warn');
    const h = document.createElement('div');
    h.textContent = 'The browser blocked the copy. ' + n + ' job' + (n === 1 ? '' : 's') + ' (' + days + '-day look-ahead) are in the box below.';
    h.style.cssText = 'font-weight:600;margin-bottom:6px;';
    const d = document.createElement('div');
    d.textContent = "Click in the box, press Ctrl+A then Ctrl+C, and paste into the White Board app's Import screen.";
    d.style.margin = '2px 0 6px';
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'width:100%;height:90px;box-sizing:border-box;font:11px Consolas,monospace;background:#11161d;color:#e6edf3;border:1px solid #3a4556;';
    t.appendChild(h); t.appendChild(d); t.appendChild(ta);
    try { ta.focus(); ta.select(); } catch (e) { /* ignore */ }
  }

  // ---------------------------------------------------------------- the button
  // A small white clipboard icon (drawn here so it shows whatever icon font CASMFG loads). Built
  // element by element, not with innerHTML, so it still works if CASMFG ever locks innerHTML down.
  const SVG_NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs).forEach((k) => el.setAttribute(k, attrs[k]));
    return el;
  }
  function clipIcon() {
    const svg = svgEl('svg', { width: '17', height: '17', viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false', style: 'vertical-align:-3px;' });
    svg.appendChild(svgEl('path', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', d: 'M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2' }));
    svg.appendChild(svgEl('rect', { x: '8', y: '2', width: '8', height: '4', rx: '1', fill: 'currentColor' }));
    return svg;
  }

  function navList() { return document.querySelector('ul.nav.navbar-nav.pull-right'); }

  function buildItem() {
    const li = document.createElement('li');
    li.id = LI_ID;
    const a = document.createElement('a');
    a.href = '';
    a.className = 'btn';
    a.setAttribute('role', 'button');
    a.title = LABEL + ": copies CASMFG's In-Process CASRTU jobs, then paste them into the White Board app's Import screen";
    a.setAttribute('aria-label', LABEL);
    // No colour of our own: the icon draws in currentColor, so it takes CASMFG's own top-bar colour.
    a.style.cssText = 'font-weight:600;font-size:12px;white-space:nowrap;';
    const label = document.createElement('span');
    label.setAttribute('data-label', '');
    a.appendChild(clipIcon());
    a.appendChild(label);
    a.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); copyJobs(); });
    li.appendChild(a);
    paintItem(li);
    return li;
  }

  // Show "Copying…" and grey the button out while a copy runs.
  function paintItem(li) {
    const a = li && li.querySelector('a');
    if (!a) return;
    a.querySelector('[data-label]').textContent = busy ? ' …' : '';   // icon only; '…' while a copy runs
    a.setAttribute('aria-disabled', busy ? 'true' : 'false');
    a.style.opacity = busy ? '0.55' : '';
    a.style.cursor = busy ? 'wait' : '';
    a.style.pointerEvents = busy ? 'none' : '';
  }
  function paint() { paintItem(document.getElementById(LI_ID)); }

  // Put the button in CASMFG's top bar, and put it back if CASMFG redraws the bar. Same approach as
  // the hammer button: first item of the right-hand list (just left of the "+").
  function ensureButton() {
    const existing = document.getElementById(LI_ID);
    const float = document.getElementById(FLOAT_ID);
    const ul = navList();
    if (ul) {
      navMissingSince = 0;
      if (float) float.remove();
      if (existing && existing.parentElement === ul) return;
      if (existing) existing.remove();
      ul.insertBefore(buildItem(), ul.firstElementChild);
      return;
    }
    // No top bar. On the sign-in page that is normal (no header at all): no button there (the
    // Tampermonkey menu still works). If the header IS there but the list isn't for 10 s, a CASMFG
    // update moved it: fall back to a floating button.
    if (!document.querySelector('header')) { if (float) float.remove(); navMissingSince = 0; return; }
    if (existing && float && float.contains(existing)) return;
    if (!navMissingSince) { navMissingSince = Date.now(); return; }
    if (Date.now() - navMissingSince < 10000) return;
    if (existing) existing.remove();
    const f = float || document.createElement('div');
    f.id = FLOAT_ID;
    f.style.cssText = 'position:fixed;top:6px;right:360px;z-index:1040;background:#1e8fd0;border-radius:6px;';
    f.textContent = '';
    const li = buildItem();
    li.style.listStyle = 'none';
    li.querySelector('a').style.display = 'block';
    li.querySelector('a').style.padding = '6px 10px';
    f.appendChild(li);
    if (!float) document.body.appendChild(f);
    log('top bar list not found - using the floating button');
  }

  if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand(LABEL, copyJobs);

  // Checks this page's own top bar once a second (CASMFG redraws it). Looks at the page only -
  // it never contacts CASMFG or anything else.
  setInterval(ensureButton, 1000);
  ensureButton();
})();
