# scrImport (Import from CASMFG, supervisor): paste notes

This screen is **two pastes**, 5a and 5b. The whole screen is about 1,120 YAML lines, and guide 3.8 asks for under about 800 per paste.

| Paste | File | Lines | Goes into |
|---|---|---|---|
| 5a | `scrImport.1.yaml` | 698 | a new screen: header, paste box, Import button, messages, the results card with its 6 count tiles |
| 5b | `scrImport.2.yaml` | 426 | `conImpResults` (the results card): the Failed, Blocked and "Added and moved" lists |

Both files pass `tools/palint.py` with 0 errors and 0 warnings: alone, together, and together with every other screen in this folder (426 names on 2026-10-02, no duplicates). Together they hold **43 controls** plus the screen, all named `…Imp…`. Context variables are `locImp…` and collections are `colImpRaw`, `colImpPaste` and `colImpResult`. The only global it touches is `gblRefreshTick`.

Round 1 review fixes are listed at the end ("Review round 1").

---

## Paste steps

```
PASTE 5a of 12 (scrImport part 1 of 2): screen scrImport (new screen)
Before this: Pastes 0-4 done (setup, App.OnStart, App.Formulas, scrHome, scrPunch). RunListJobs connected.
Where: Tree view → Screens tab → right-click any screen → Paste.
       Copy ALL of scrImport.1.yaml with the copy button (first line "Screens:",
       last line "                              Y: =66"; that line appears only once).
After: run the 3.4 checks. Expected: 0 errors on scrImport. A new screen "scrImport" (no _1 at the end).
       One error may show on scrImport's OnVisible: "txtImpPaste isn't recognized"
       (the screen formula names a box that comes later in the same paste, guide U3).
       Fix it with the type-a-space fix (guide 3.4) on scrImport > OnVisible.
```

```
PASTE 5b of 12 (scrImport part 2 of 2): the result lists
Before this: Paste 5a done.
Where: Tree view → expand scrImport → right-click conImpResults → Paste.
       (If Paste isn't in the menu: click conImpResults once, then press Ctrl+V.)
       It must be conImpResults, the results card, NOT the screen and NOT galImpTiles.
       Copy ALL of scrImport.2.yaml (first line "- lblImpFailHead:"). The LAST 4 lines are
       (in the file each one starts with 18 spaces):
                  Width: =Parent.Width - 250
                  Wrap: =false
                  X: =240
                  Y: =0
       ("Y: =0" alone appears 7 times; only the one right after "X: =240" is the end.)
After: run the 3.4 checks. Expected: 0 errors. The lists stay hidden in the editor; that's normal.
       Then check where they landed (first bullet below).
```

- **Check that 5b landed inside conImpResults.** In Tree view, expand conImpResults. These 7 must be inside it, indented under it: lblImpFailHead, galImpFailed, lblImpBlockHead, galImpBlocked, lblImpChgHead, lblImpChgEmpty and galImpChanges. A paste onto the screen (or into galImpTiles) also succeeds with no error, but the lists are then in the wrong place: on the screen they show at the left, over the paste box, after an import.
  - **To fix:** in Tree view, select those 7 where they landed (click the first, Ctrl+click the others). Deleting a gallery also deletes the controls inside it (20 controls in all). Press **Delete**, then paste 5b again, this time on conImpResults.
- **Expected errors on other screens.** Two buttons on other screens point at scrImport and were pasted before it existed:
  - scrHome's **Import** button (btnHomImport, Paste 3);
  - scrPunch's **Import** button (btnPunImport, Paste 4a).

  Both say "scrImport isn't recognized". They may clear by themselves once 5a is in. If they don't, Paste 12 (the fix-up pass) clears them.
- Paste 11 (App > StartScreen) names scrImport, so 5a must come before Paste 11.
- If a paste fails, nothing is created. Send the exact error text, "Paste 5a" or "Paste 5b", and what was selected in Tree view (guide 3.7).
- If a formula shows "Name isn't recognized" for a control that exists, use the "type a space" fix (guide 3.4). The only place this is expected is scrImport's OnVisible (txtImpPaste, see 5a). Nothing in 5a refers to 5b, and 5b refers to no other control.

**In Tree view you should then see under scrImport.** The list below is in paste order (back to front). Studio's Tree view lists the front-most control first, so at screen level it shows them roughly bottom to top (conImpResults first). Check the names and what sits inside what, not the order:

- `conImpHeader`, holding lblImpTitle, btnImpPunch and btnImpHome
- lblImpHelp, txtImpPaste, btnImpImport, btnImpClear, lblImpError, lblImpNarrow, lblImpRunning
- `conImpAsk`, holding lblImpAskText and btnImpAskCancel
- `conImpResults`, holding:
  - lblImpResTitle, lblImpResEmpty and lblImpResInfo
  - `galImpTiles` > `conImpTile` (lblImpTileNum, lblImpTileName, lblImpTileSub)
  - after 5b: lblImpFailHead and `galImpFailed` > `conImpFailRow` (lblImpFailMsg, btnImpRetry, lblImpFailHint)
  - lblImpBlockHead and `galImpBlocked` > `conImpBlockRow` (lblImpBlockJob, lblImpBlockInfo, btnImpRestore, lblImpRestored)
  - lblImpChgHead, lblImpChgEmpty and `galImpChanges` > `conImpChgRow` (lblImpChgTag, lblImpChgJob, lblImpChgInfo)

---

## What you should see after pasting

- **Header:** "Import from CASMFG". On the right are a blue **Go to Punch** and a grey **Home**. Both are dimmed while an import runs.
- **Left side:**
  - the line "In CASMFG, click Copy jobs for White Board, then paste here.";
  - a large dark text box with the grey hint "Paste the copied jobs here (click here, then Ctrl+V)";
  - a big **Import** button, dimmed until something is in the box, and a grey **Clear**.
- **Right side:** a card titled "Results" that says "Nothing imported yet…".

After you tap **Import**, one of these appears under the buttons:

- **Red message** (nothing was imported): the text isn't a White Board copy, has the wrong version, or holds no jobs.
- **Red banner** "Narrow pull: ship dates moved more than 16 days out can't be seen. Copy again." with a second line "(This copy looks ahead 16 days, not 180.)". The copy only looked ahead 16 days, because the CASMFG script had to fall back. The import still runs. Copy again later to see far-out ship moves.
- **Amber box** "This copy is old: it was made 3 h 12 min ago (…)". The copy is more than 2 hours old, or has no copy time. The button turns amber and reads **Import anyway**: tap it again to import. A tap within a second of the question (for example a fast double tap) only asks again. **Cancel** empties the box.
- **"Importing N jobs. Please wait…"** while it runs. **Go to Punch**, **Home**, **Import** and **Clear** are dimmed until it finishes.

When it finishes, a green banner says "Import done: n added, n ship move(s)." The results card then shows:

- **Six tiles:**

  | Tile | Counts |
  |---|---|
  | Added | new Incoming cards |
  | Ship moves | ship dates changed on open jobs |
  | Already had | jobs already on the board, or Done |
  | Blocked | jobs you dismissed that CASMFG still lists |
  | Failed | jobs that couldn't be saved, or couldn't be checked |
  | Watch only | jobs that aren't on the board and ship more than 16 days out, so they aren't added yet |

  Added + Already had + Blocked + Failed + Watch only = the jobs in the copy. That holds even when SharePoint fails part-way: a job that couldn't be read or checked is counted under Failed, never dropped. Ship moves are counted inside Already had.
- **One info line:** how many jobs, when they were copied, the look-ahead, and the last ship date that still gets a new card (today + 16). It also mentions done jobs, refreshed CASMFG ids, and repeated or blank rows when there are any.
- **Failed** (red, only when there are any): `job: reason`.
  - A failed *new* job, or a job whose list check failed, has a **Retry** button.
  - A failed ship-date or id change, or an open job that couldn't be read, says "Tap Import again to retry" (that is always safe).
  - The reason shows on up to two lines. On a PC, point at it with the mouse to see all of it.
- **Blocked - dismissed** (purple, only when there are any): the job, CASMFG's ship date and the customer, and under them "last changed m/d/yyyy", with a **Restore** button. Restore puts the job back in the Incoming tray and the row then shows a green "Restored".
- **Added and moved:** a green ADDED or amber MOVED tag, the job, and one of these:
  - "ships m/d   customer   Size n" for a new job;
  - "ship 10/7 to 10/21   (Active, flagged on the Punch board)" for a move on a placed job;
  - "(Active, flag cleared)" when CASMFG moved it back to the date it had before the flag;
  - "(Active)" when the job had no ship date before (nothing to flag);
  - "(Incoming)" for a job still in the tray (no flag there).

The customer is cut to 12 characters, as on the cards. **Go to Punch** takes you to the Punch board, where the new cards are in the Incoming tray. The results stay on this screen until the next import. The paste box is emptied each time you open the screen.

---

## Manual test (Preview F5, about 10 minutes)

Keep the SharePoint list open in another tab to check values. The test copies below use job number **TEST**, so nothing real changes. Their copy time is fixed in the past, so **every** test paste first shows the amber "This copy is old" box. That is the stale-copy check working: read it, then tap **Import anyway** to continue. (It's also test 7 below.)

Copy A (four TEST jobs: 10/3, 10/10, no ship date, and one in January):
```
{"v":1,"pulledAt":"2026-10-01T12:00:00.000Z","fromYmd":"2026-10-02","toYmd":"2027-03-31","days":180,"jobs":[{"id":"T1","number":"TEST","name":"TEST CUSTOMER","shipDate":"2026-10-03","runNumber":"1","status":"In-Process","model":"CASRTU3-I.250-TEST","unit":"1"},{"id":"T2","number":"TEST","name":"TEST CUSTOMER","shipDate":"2026-10-10","runNumber":"1","status":"In-Process","model":"CASRTU2-TEST","unit":"2"},{"id":"T3","number":"TEST","name":"TEST CUSTOMER","shipDate":"","runNumber":"1","status":"In-Process","model":"CASRTU4-TEST","unit":"3"},{"id":"T4","number":"TEST","name":"TEST CUSTOMER","shipDate":"2027-01-15","runNumber":"1","status":"In-Process","model":"CASRTU1-TEST","unit":"4"}]}
```

Copy B (the same, but TEST-2 now ships 10/14):
```
{"v":1,"pulledAt":"2026-10-01T12:00:00.000Z","fromYmd":"2026-10-02","toYmd":"2027-03-31","days":180,"jobs":[{"id":"T1","number":"TEST","name":"TEST CUSTOMER","shipDate":"2026-10-03","runNumber":"1","status":"In-Process","model":"CASRTU3-I.250-TEST","unit":"1"},{"id":"T2","number":"TEST","name":"TEST CUSTOMER","shipDate":"2026-10-14","runNumber":"1","status":"In-Process","model":"CASRTU2-TEST","unit":"2"},{"id":"T3","number":"TEST","name":"TEST CUSTOMER","shipDate":"","runNumber":"1","status":"In-Process","model":"CASRTU4-TEST","unit":"3"},{"id":"T4","number":"TEST","name":"TEST CUSTOMER","shipDate":"2027-01-15","runNumber":"1","status":"In-Process","model":"CASRTU1-TEST","unit":"4"}]}
```

Copy C (copy A as a narrow 16-day pull):
```
{"v":1,"pulledAt":"2026-10-01T12:00:00.000Z","fromYmd":"2026-10-02","toYmd":"2026-10-18","days":16,"jobs":[{"id":"T1","number":"TEST","name":"TEST CUSTOMER","shipDate":"2026-10-03","runNumber":"1","status":"In-Process","model":"CASRTU3-I.250-TEST","unit":"1"},{"id":"T2","number":"TEST","name":"TEST CUSTOMER","shipDate":"2026-10-10","runNumber":"1","status":"In-Process","model":"CASRTU2-TEST","unit":"2"},{"id":"T3","number":"TEST","name":"TEST CUSTOMER","shipDate":"","runNumber":"1","status":"In-Process","model":"CASRTU4-TEST","unit":"3"},{"id":"T4","number":"TEST","name":"TEST CUSTOMER","shipDate":"2027-01-15","runNumber":"1","status":"In-Process","model":"CASRTU1-TEST","unit":"4"}]}
```

1. **Bad paste.** Type `hello` in the box and tap **Import**. A red message says it isn't a White Board copy, and nothing else changes. Tap **Clear**.
2. **First import (go-live test 1).** Paste copy A and tap **Import**, then **Import anyway**.
   - While it runs, "Importing 4 jobs…" shows and **Go to Punch** and **Home** are dimmed.
   - Tiles: **Added 3, Ship moves 0, Already had 0, Blocked 0, Failed 0, Watch only 1**.
   - "Added and moved" lists TEST-1 (ships 10/3, Size 3), TEST-2 (ships 10/10, Size 2) and TEST-3 (NO SHIP DATE, Size 4). TEST-4 ships in January, so it is Watch only.
   - In SharePoint, row TEST|1 has ShipDate **10/3/2026** (not 10/2 or 10/4), JobStatus Incoming, FanNumber 1, CasmfgId T1 and every Yes/No = No.
   - On **Go to Punch**, the three are in the Incoming tray with ✨ NEW, and TEST-1 shows 📅 10/3.
3. **Same copy again (go-live test 3).** Back on Import, paste copy A again and import it. Tiles: **Added 0, Ship moves 0, Already had 3, Watch only 1**. "No new jobs and no ship moves this time." If this shows ship moves, stop and report it (see U-b).
4. **Ship move on an active job.** On Punch, **Place** TEST-2 (any machine). Back on Import, paste copy **B** and import. Tiles: **Ship moves 1, Already had 3**. The list shows TEST-2 with "ship 10/10 to 10/14   (Active, flagged on the Punch board)". On Punch, TEST-2 shows 📅 10/14 and "📅 moved from 10/10". In SharePoint, PrevShipDate = 10/10.
5. **Move back clears the flag.** Paste copy **A** and import. Ship moves 1: the list shows TEST-2 with "ship 10/14 to 10/10   (Active, flag cleared)". On Punch, TEST-2's "moved from" flag is gone, and PrevShipDate is empty in SharePoint.
6. **Blocked + Restore.** TEST-1 is still in the Incoming tray, and tray cards have only **Place**, so dismiss it through Find: on Punch, type `TEST` in **Find job #**, tap **Find**, tap **Open** on TEST-1, then tap **Dismiss job** twice (the second tap reads "Tap again to dismiss"). Back on Import, paste copy A and import. Tiles: **Already had 2, Blocked 1**. The purple list shows TEST-1, and under it "last changed" with today's date. Tap **Restore**: a green banner says "TEST-1 restored to the Incoming tray", the row shows "Restored", and TEST-1 is back in Punch's Incoming tray.
7. **Old copy.** Every test paste above showed the amber box first.
   - Paste copy A and **double-tap Import quickly**. The amber box shows and stays, and nothing is imported (a second tap within a second only asks again).
   - Now tap **Cancel**: the box empties and nothing is imported.
8. **Narrow pull.** Paste copy **C** and import. The red banner shows all three lines, with nothing cut off at the top or bottom: "Narrow pull: … Copy again." and "(This copy looks ahead 16 days, not 180.)". The import still runs, and the tiles show Added 0, Ship moves 0.
9. **Real copy (go-live).** In CASMFG, click **Copy jobs for White Board**, paste it here and tap **Import**. A fresh copy asks nothing. The first time, this can take a minute or two; stay on the screen (the header buttons are dimmed until it finishes). Check that Added matches the new jobs shipping within 16 days, and that nothing is in Failed. Then **paste the same copy again**: **Added 0, Ship moves 0**.
10. **Clean up.** On Punch, type `TEST` in **Find job #** and tap **Find**. For each TEST row (TEST-1, TEST-2 and TEST-3), tap **Open**, then tap **Dismiss job** twice; you return to the Find list each time. An Owner can delete the TEST rows later (list-design step 20).

The failure paths (a SharePoint read or write failing part-way through a run, Retry, Restore with no connection) can't be triggered on purpose in Preview. They were checked offline (see "How this was checked offline").

---

## Decisions and assumptions (each with its fallback)

| # | What I did | Why | If you want it different |
|---|---|---|---|
| A1 | **Open jobs are first compared with the board's in-memory copy.** Only jobs whose ship date or CASMFG id differs are re-read with `LookUp(RunListJobs, ID = id)`, and every write is decided from that fresh row. | list-design says "re-read the row … and decide from that fresh row", and pitfall 12 asks for speed. Re-reading all 100-300 open jobs on every paste would take minutes. The board copy is refreshed at the start of each run, so a change missed this way can only come from an edit made in the same few seconds, and the next import catches it. | Ask, and every open match will be re-read (slower). |
| A2 | **Failures inside the run go to the red Failed list**, with one summary banner at the end, instead of one error banner per row. This covers failed writes and failed reads: the board copy, the fresh re-read of an open job, the key check, and the re-check after a failed create. A new job that couldn't be created, or whose key check failed, gets **Retry**. A failed ship-date or id change, or a failed re-read, says "Tap Import again to retry". | One banner per row would overwrite itself. list-design asks for the Failed list for creates; the other failures use the same list. Each write still tries, then Refresh, then retries once (pitfall 3). A failed read is never dropped or left as an error inside the results, so the counts always add up. A failed re-check after a failed create counts as "not found", so the job lands in Failed with Retry; Retry handles both "made elsewhere" and "still missing". | None needed. |
| A3 | **Stale copy (over 2 hours, or no copy time): two taps.** The first tap shows the amber box, and the button becomes **Import anyway**. The confirming tap must come at least 1 second after the question; a faster tap (a double tap) only asks again. Changing the pasted text cancels the question. | No overlay or panel is needed, and it mirrors Punch's "tap again to dismiss". The 1-second rule stops a double tap from skipping the question: importing an old copy can put ship dates back and set wrong "moved from" flags. | Ask for a pop-up panel instead. |
| A4 | **A narrow pull still imports**, under the red banner. | list-design and app-spec ask only for a banner. Adds and moves inside 16 days are still correct, and the original app imported narrow pulls too. | Ask if a narrow pull should be refused. |
| A5 | **CasmfgId refresh only when the pasted id isn't blank.** It also fills the id on a *manual* job whose Job # + Unit # match a CASMFG job, which then counts as imported (Job # / Unit # locked in Edit). | A blank id would otherwise turn an imported job back into a "manual" one. list-design applies the refresh to every open match. | None needed. |
| A6 | **Done jobs found by the key look-up count as "Already had"**. The info line says how many. | list-design: "Done: counted". | None needed. |
| A7 | **A job listed twice in one copy** (same job # + unit #) is imported once, using the first occurrence. Rows without a job # are ignored. Both are mentioned in the info line. | Keeps the counts true and avoids a needless failed create. | None needed. |
| A8 | **Restore** writes only `JobStatus = Incoming` (CONTRACT 6.4). It first re-reads the row, so a job someone already restored or placed is left alone. If that read fails, it says so and changes nothing. If CASMFG's ship date differs, the banner says "Tap Import again to bring its ship date up to date". | Patch only the columns the button owns. | Ask if Restore should also take CASMFG's ship date. |
| A9 | **Go to Punch is in the header**, so it's always there, next to Home. | app-spec: "Then a button Go to Punch". It's also handy without importing. | None needed. |
| A10 | **Results stay** when you leave and come back. The paste box is emptied on each visit. | Lets you go to Punch and come back to the Blocked / Failed lists. | None needed. |
| A11 | **A manual job with no Unit #** (key `…|M…`) doesn't block its CASMFG twin. The import adds a new card for it. | list-design key rule: only a manual job with a Unit # blocks its twin. | Give manual jobs a Unit # if they are real CASMFG jobs. |
| A12 | **Extras not in app-spec:** the "Added and moved" list, the info line, a **Clear** button, and the tile captions. | Read-only feedback that helps you check an import. | Ask to remove any of them. |
| A13 | **Ship moves** counts moves on Incoming jobs **and** on Active not-Started jobs. The Punch banner only counts the Active ones that are flagged. The "Added and moved" list says which moves set, kept or cleared the Punch flag. | app-spec summary "ship moves". | None needed. |
| A14 | **Ship date text longer than 10 characters** (for example a full timestamp) uses its first 10 characters. Number, unit or id sent as JSON numbers are accepted too. | list-design's `BeginsWith` rule. The CASMFG script always sends text, so this is a safety net. | None needed. |
| A15 | **Go to Punch and Home are dimmed while an import runs**, and opening the screen no longer clears the "running" state. | The running line says "stay on this screen". Leaving mid-run and coming back used to show a half-finished run as finished. | Ask if you'd rather be able to leave (the run keeps going in the background). |
| A16 | **The customer is cut to 12 characters** in the Blocked and "Added and moved" lists, as on every card (app-spec). | So each row fits on its line. | None needed. |

## Open issues (uncertainties and fallbacks)

| # | What could differ in Studio or SharePoint | How you'll notice | Fallback |
|---|---|---|---|
| U-a | **A big first import** (every job within 16 days is new, maybe 100-200 creates). Power Apps may run them in parallel, and SharePoint can slow down a burst ("throttling"). | Some jobs end up in Failed with a "too many requests" or timeout reason. | Tap **Import again** a minute later. It only adds what is missing. Retry also works per job. |
| U-b | **Date round trip** (list-design pitfall 5, go-live tests 1 and 3). Ship dates are written as `Date(y, m, d)` from the CASMFG text and compared as `yyyy-mm-dd` text. | Test step 2 shows 10/2 or 10/4 instead of 10/3, **or** test step 3 shows ship moves on unchanged jobs. | Stop and report it. It's fixed once in a shared formula, never per screen. |
| U-c | **Studio's type checks on the Import formula.** It uses IfError around ClearCollect, `Patch(record, {…})` to merge records, `DateTimeValue` on the JSON copy time, `Text(Patch(…).ID)` to capture each save's result, `IsError` on a looked-up record, and `DateDiff(…, TimeUnit.Milliseconds)`. All of these pass the Power Fx 1.8.1 interpreter, but Studio runs a newer engine. `TimeUnit.Milliseconds` is in Learn (DateAdd/DateDiff) but not in guide 6.13's table. | A red ⊗ on btnImpImport (OnSelect), btnImpRetry or btnImpRestore. | Send the exact error text. The formula is in one place, so the fix is one property patch. If only the 1-second rule fails, `TimeUnit.Seconds` with `>= 2` is the drop-in replacement. |
| U-d | **Very large paste** (guide U11). A 180-day copy is about 100-150 KB. The box is multi-line with MaxLength 2,000,000. Microsoft documents no ParseJSON size limit. | Test step 9: a red "isn't valid JSON" message for a real copy, which would mean the text was cut. | Report it with the CASMFG job count. |
| U-e | **Leaving or closing during an import.** Go to Punch and Home are dimmed while it runs, so the screen can't be left from inside the app. Closing or reloading the app stops the run where it was; everything already saved stays saved. | After a reload the results card shows "Nothing imported yet". | Import the same copy again: it's safe and only adds or moves what is still missing. If "Importing…" ever stays on with nothing happening for several minutes, reload the app (F5 in the browser, or close and reopen it) and import again. |
| U-f | **Two people import at once.** One of them gets a unique-key error on a new job. The re-check then counts it as "Already had" (list-design re-import guard). | Nothing visible. | None needed. |
| U-g | **"last changed" on a Blocked row** is SharePoint's Modified date: the day it was dismissed, or any later edit. | None. | None needed. |
| U-h | **Clock difference** between the CASMFG PC and the device doing the import shifts the 2-hour check. | The old-copy question appears too early or too late. | Keep all devices on the shop time (list-design "FIRST"). |
| U-i | **Formula depth.** The read-failure guard nests the Import formula one level deeper (21 brackets deep, was 19). It passes the Power Fx 1.8.1 parser. The real formula also runs within that interpreter's default call depth of 20; the offline test copy needs 21, only because the test wraps every Patch in a failure stub. Canvas apps document no nesting limit. | An error such as "nested too deeply" or "too complex" on btnImpImport (OnSelect). | Send the exact text. |
| U-j | **Long failure reasons.** The Failed list shows two lines (about 85 characters each). The full reason is in the row's tooltip, which shows on mouse hover (PC), not on a touch tap. | A reason ends mid-sentence on a tablet. | Read it on a PC. Where the row has **Retry**, tap it: if it fails again, its red banner shows the full reason. |

## Requests for App.Formulas / CONTRACT

No App.Formulas change is needed. The screen uses only existing names:
- `ActiveJobs` and `IncomingJobs`, reading only ID, Title, ShipYmd, CasmfgId and Started;
- the `clr…` colours (including `clrWhite` and `clrNone`);
- `gblRefreshTick`.

The key, ship-date and JobSize rules are written inline, exactly as list-design gives them:
- key: `Upper(Trim(num)) & "|" & Upper(Trim(unit))`
- ship date: `IsMatch(s, "\d{4}-\d{2}-\d{2}", MatchOptions.BeginsWith)` and `Date(Value(Left(s,4)), Value(Mid(s,6,2)), Value(Mid(s,9,2)))`
- JobSize: the `CASRTU\s*(?<sz>\d+)` parse limited to 1-4

Requested CONTRACT changes (each already handled locally in scrImport, so nothing waits on them):

1. **Section 6 (writes) / 9.1: one disabled style for write buttons.** Section 6 keeps `AutoDisableOnSelect` on, so every write button is drawn disabled while it saves. The contract gives no disabled colours, and the template defaults are near-white on a pale fill. Screens now differ: most use `DisabledColor: =Self.Color` + `DisabledFill: =ColorFade(Self.Fill, -30%)`, while scrImport uses `clrMuted` + `ColorFade(clrBlue, -55%)` to match its own Import button (review 1 #4).
   - *Request:* add one standard pair to 9.1 and the 6.x snippets.
   - *Local:* btnImpImport, btnImpClear, btnImpRetry, btnImpRestore, btnImpPunch and btnImpHome all set their own.
2. **Section 6: reads that decide a write in a bulk loop.** The write helper guards the Patch, not the `LookUp` that decides it. In a ForAll, a failed `LookUp(RunListJobs, …)` either drops the row or leaves an error inside the results collection, which breaks every count (review 2 #1).
   - *Request:* add a rule: "test a deciding read with `IsError()` and record it as a failure; a re-check where 'not found' is the safe answer may use `IfError(LookUp(…), Blank())`".
   - *Local:* done in btnImpImport (board copy, fresh re-read, key check, re-check), btnImpRetry (re-check) and btnImpRestore (re-read).
3. **For the guide owner (not a foundation file):** guide 6.13 lists TimeUnit as Days, Months, Years, Hours, Minutes. Learn (DateAdd/DateDiff) also documents Milliseconds, Seconds and Quarters. scrImport uses `TimeUnit.Milliseconds`, because DateDiff counts unit boundaries: two times 0.2 s apart can differ by "1 second".

## Data and contract compliance

**RunListJobs reads** (all delegable equality, CONTRACT 5):
- `LookUp(RunListJobs, Title = key)`: the import key look-up for new, Done or Dismissed jobs within 16 days or with no valid ship date. It is also the re-check after a failed create (in the run and in Retry).
- `LookUp(RunListJobs, ID = id)`: the fresh re-read of an open job before a ship or id change, the Restore re-check, and every Patch base record.
- A read that fails during the run is caught (`IsError`) and listed under Failed. The re-checks after a failed create use `IfError(…, Blank())`, so a failed re-check means "not found", which gives Failed + Retry.
- No delegation warning is expected anywhere. Report any.

**Writes**, each through the write helper (values worked out first, base `LookUp(ID)`, IfError, then Refresh, retry once, then the Failed list or a `Notify(…, Error, 0)`):

| Where | Change record |
|---|---|
| Ship move, Incoming | `{ShipDate}` |
| Ship move, Active not Started | `{PrevShipDate: If(new = PrevShipDate, Blank(), Coalesce(PrevShipDate, ShipDate)), ShipDate}`. The two dates are compared as `yyyy-mm-dd` text |
| Active + Started | ignored |
| CasmfgId refresh | `{CasmfgId}` |
| Create (run and Retry) | CONTRACT 6.5 exactly: Title (key), JobNumber, UnitNumber, FanNumber = unit, JobName, ProductModel, CasmfgId, JobSize (parsed), ShipDate (or blank), JobStatus Incoming, and all 16 Yes/No = false. Not retried blindly: on error it re-checks with `LookUp(Title = key)` |
| Restore | `{JobStatus: {Value: "Incoming"}}` |

Every write comes from a Classic Button's `OnSelect`. Rows are never deleted. There is no UpdateIf, RemoveIf or Remove.

**Run order** (list-design IMPORT RUN):
1. Refresh, then snapshot ActiveJobs and IncomingJobs (two indexed queries).
2. For each pasted job, by key:
   - the board copy couldn't be read → Failed;
   - (a) the job is open → ship move and CasmfgId refresh, decided from a fresh read (a failed read → Failed);
   - (c) it isn't open and ships after today + 16 → watch only, with no server call;
   - (b) otherwise → `LookUp(Title = key)`: a failed check goes to Failed (Retry), Dismissed goes to Blocked, Done counts as Already had, and not found creates the job (re-checked if the create fails).
3. Inside the ForAll there are only Patch and Refresh on RunListJobs and `Collect` into `colImpResult`. There is no UpdateContext, Clear or ClearCollect inside it (Learn ForAll), and no step depends on the order of the rows.

**Refresh:** OnVisible and the start of each run do `Refresh(RunListJobs); Set(gblRefreshTick, gblRefreshTick + 1)` (CONTRACT 7.2). There is no timer (CONTRACT 1).

**Collections** are only transient import data, named `colImp…` (CONTRACT 2). No Coalesce on text (`& ""` is used instead), no `AllItems`, and no `gal.Selected`.

## How this was checked offline

- **Lint.** `palint.py`: 0 errors and 0 warnings on each file, on both together, and on all screens together (426 names on 2026-10-02, no duplicates). Every one-line formula is under 100 characters and has no `:`, `#`, `{` or `}`; no tabs, trailing spaces or non-ASCII.
- **Properties.** Every property used exists in the Sept 2026 control templates (Label 2.5.1, Button 2.2.0, TextInput 2.3.2, Gallery 2.15.0, GroupContainer 1.5.0). Round 1 added only `DisplayMode`, `DisabledColor`, `DisabledFill` (buttons) and `Tooltip`, `PaddingTop`, `PaddingBottom` (labels).
- **Types.** All 587 property formulas type-check and evaluate, with no error values, in the Power Fx 1.8.1 interpreter, in default and V1 mode. They were run against the current `App.Formulas.txt` and sample RunListJobs rows, with gallery-row contexts and these stubs: Notify, Refresh, Reset, UpdateContext → Set, and Navigate.
- **Behaviour.** 145 checks across 15 scenario groups, in both modes:
  - a 26-row paste covering every rule:
    - Active moves, including move-back and keep-first-date, and the moved-row text ("flagged", "flag cleared", nothing for a job with no earlier date);
    - Started jobs ignored;
    - Incoming moves, including from a blank ship date;
    - CasmfgId refresh;
    - Done → had, Dismissed → blocked (also with an invalid ship date);
    - watch-only beyond 10/18, inclusive at 10/18;
    - past and blank ship dates added;
    - a repeated key, a blank job #, spaces and lower case in keys, and number-typed fields;
    - JobSize 1-4 and blank;
  - simulated write failures:
    - a create that fails (Failed, then Retry);
    - a create that fails because another import made the row (→ Already had);
    - an update that fails twice (Failed), and a saved move whose id save fails (keeps its status);
    - an update that fails once and succeeds after Refresh;
  - simulated read failures (new):
    - the board copy, a fresh re-read, a key check, and a re-check after a failed create. Each gives a Failed row with the reason, the counts still add up to the jobs in the copy, and the tiles and summary still show numbers. The original formula dropped the key-check job and turned every count into an error here;
    - Retry after a failed key check (creates the job), and Retry whose re-check fails ("Still not saved");
    - Restore whose re-read fails (error banner, nothing written);
  - Restore, including "already restored" and a first-try failure;
  - a second paste (0 added, 0 moves) and a third paste (zero writes);
  - invalid JSON, wrong version, a JSON array, no jobs, and a bad jobs field;
  - a narrow pull;
  - the stale question: first tap asks, a second tap within a second asks again, a tap a second later runs, a changed paste asks again, Cancel, and a copy with no copy time;
  - OnVisible leaves a running import's state alone.
- **Call depth.** The test copy of the Import formula needs the interpreter's MaxCallDepth at 21 (default 20), only because of the Patch failure stub. The real formula, run unstubbed against the sample list, works at the default 20 and gives the same results as before round 1 (U-i).
- **Text fit.** Measured with Open Sans and with Liberation Sans (Arial metrics, standing in for Segoe UI), at the label template's 1.2 line height:
  - the help line at 13 semibold: 506-510 px of 527;
  - the narrow banner: 3 lines, 67 px of 68;
  - a Blocked row: 2 lines, 38 px of 46;
  - a Failed reason at 11: 2 lines, 35 px of 36;
  - the longest moved and added rows: 409-425 px of 479.
- **Manual-test copies.** Copies A, B and C were run through the same checks, and the tile numbers above are the ones they produced.
- **Not testable offline:** the Studio paste itself, SharePoint's unique-key error text, throttling (U-a), the date round trip (U-b), the paste size (U-d), and real network failures (simulated only).

## Review round 1

Two reviews: paste validity (R1) and logic and data (R2).

| Review | Finding | Done |
|---|---|---|
| R1 #1 | Narrow banner cut off (4 lines in 76 px) | Second line is now "(This copy looks ahead N days, not 180.)", so the banner is 3 lines. Top and bottom padding is 4 (was 8), so the 3 lines (67 px) fit inside the padding (68 px). |
| R1 #2 | Blocked row clipped "last changed" | `Wrap: =true`, padding 0 top and bottom, "last changed m/d/yyyy" on a second line, customer `Left(…, 12)`. |
| R1 #3 | Help line clipped at 14 | `Size: =13`. |
| R1 #4 | Retry / Restore had no disabled colours | `DisabledColor: =clrMuted`, `DisabledFill: =ColorFade(clrBlue, -55%)` on both, the same as the screen's Import button. CONTRACT request 1. |
| R1 #5 | Failure reason cut at 2 lines | `Tooltip: =ThisItem.Msg` and `Size: =11` (about 85 characters per line). U-j. |
| R1 #6 | galImpBlocked Items was a 127-character one-line formula | Moved to a `|-` block. No other one-line formula is over 100 characters. |
| R1 #7 | Paste-note gaps | (a) 5b's last lines are given. (b) Added a "landed in the wrong place" check and its fix. (c) Added the OnVisible / txtImpPaste type-a-space note. (d) Named scrHome's Import button too. (e) The Tree view list says Studio shows it front-most first. |
| R1 #8 | Go to Punch / Home enabled during an import | Both are disabled while `locImpRunning` (`DisabledColor: =clrMuted`, `DisabledFill: =ColorFade(Self.Fill, -40%)`). A15. |
| R2 #1 | A failed read in the run dropped a job or broke the results | As proposed: `IsError(row)` → Failed (Tap Import again); `IsError(f)` → Failed; re-check `IfError(LookUp(…), Blank())`. Changes from the proposal: the key-check failure gets `Sub: "create"`, so it shows **Retry** (Retry is correct for every outcome there); each message includes the read's own error text. Also added: `IsError(o)` for a failed board copy, the same `IfError` re-check in Retry, and an `IsError(row)` guard in Restore. A2, CONTRACT request 2. |
| R2 #2 | OnVisible cleared `locImpRunning` mid-run | OnVisible no longer sets it. With R1 #8, the screen can't be left mid-run anyway. U-e rewritten. |
| R2 #3 | A fast double tap could skip the stale-copy question | `locImpAskAt: Now()` is stored when asking. Confirming needs `DateDiff(locImpAskAt, Now(), TimeUnit.Milliseconds) >= 1000` (milliseconds, because DateDiff counts unit boundaries). A3, test step 7. |
| R2 #4 | Wrong "flagged" / "(update)" text in the moved list | `Sub: If(e1 = "", st, "update")`. `Msg` on a saved move says "flagged on the Punch board", "flag cleared" or nothing. lblImpChgInfo shows `Msg` for "had" rows. |
| R2 #5 | Test steps 6 and 10 used ✎ on tray cards | Both go through **Find job #** → **Open** → **Dismiss job** twice. |
| (own) | "Added" row could clip with a long customer and NO SHIP DATE + SET SIZE | Customer `Left(…, 12)`, the same as the Blocked list and the cards. A16. |

No finding was rejected.
