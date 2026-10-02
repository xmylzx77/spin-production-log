# scrAssembly: paste notes

This screen goes in as three pastes (6a, 6b, 6c). The full screen is about 1,370 YAML lines, and the guide says to keep each paste under about 800.

| File | Paste | What it is | Lines | Controls |
|---|---|---|---|---|
| `scrAssembly.1.yaml` | 6a | The whole screen: header, Unassigned tray, Line 1/2/3 grid, timer, overlay, and the empty Assign panel and grid card containers | 595 | 31 + the screen |
| `scrAssembly.2.yaml` | 6b | What goes inside the Assign panel (`conAsmPanel`) | 284 | 11 |
| `scrAssembly.3.yaml` | 6c | What goes inside each grid card (`conAsmCard`) | 485 | 19 |

That is 61 controls in total. Every name contains `Asm`.

Don't press F5 and don't tap **Assign** until all three pastes are done. Before 6b, the Assign panel has no Cancel button, so the dark overlay would block the screen. If that happens, press **Esc** to leave Preview.

---

## Paste steps

```
PASTE 6a of 12: screen scrAssembly (new screen, part 1 of 3)
Before this: Pastes 1-5 done (App.OnStart, App.Formulas, scrHome, scrPunch, scrImport). RunListJobs connected.
             (This screen itself only needs 1-3: OnStart, Formulas and scrHome.)
Where: Tree view > Screens tab > right-click any screen > Paste. Copy all of scrAssembly.1.yaml.
After: run the 3.4 checks. Expected: 0 errors. A new screen "scrAssembly" (no _1 at the end).
```

```
PASTE 6b of 12: controls inside the Assign panel (part 2 of 3)
Before this: Paste 6a done.
Where: Tree view > expand scrAssembly > right-click conAsmPanel > Paste. Copy all of scrAssembly.2.yaml.
       (Or click conAsmPanel in Tree view and press Ctrl+V.)
After: run the 3.4 checks. Expected: 0 errors. Under conAsmPanel you see 11 controls:
       lblAsmPTitle, lblAsmPInfo, lblAsmPNow, lblAsmPLineCap, ddAsmLine, lblAsmPDateCap,
       dpAsmDate, lblAsmPWarn, lblAsmPPair, btnAsmPSave, btnAsmPCancel.
```

```
PASTE 6c of 12: controls inside each grid card (part 3 of 3)
Before this: Pastes 6a and 6b done.
Where: Tree view > expand scrAssembly > expand galAsmDays > expand galAsmCells >
       right-click conAsmCard > Paste. Copy all of scrAssembly.3.yaml.
       (Or click conAsmCard in Tree view and press Ctrl+V.) Don't select a gallery when you paste.
After: run the 3.4 checks. Expected: 0 errors. Under conAsmCard you see 19 controls:
       lblAsmJob, lblAsmSize, lblAsmShip, lblAsmSlack, btnAsmPair, lblAsmSq12 ... lblAsmSq24,
       lblAsmSqBK, lblAsmSqP4, btnAsmMoved, btnAsmStarted, btnAsmRule, btnAsmUp, btnAsmDown, icoAsmEdit.
```

If 6b or 6c lands in the wrong place (the controls show at screen level instead of under the container): delete those controls, select the container in Tree view, and press Ctrl+V. If the result is still wrong, send the error text, the paste number, and what was selected (guide 3.7).

**Check 6c by eye in Tree view, because one wrong place gives no error.** The 19 controls must be indented **under conAsmCard**, not next to it under galAsmCells. If they sit next to conAsmCard (same indent, directly under galAsmCells), Studio shows no error, but the ▲ ▼ ✎ buttons and the ⚠ and "📅 was" chips are placed off the right edge of the card and can't be seen. You won't spot it on the canvas either: until a job is assigned, galAsmCells is only 4 px tall and conAsmCard is hidden. Fix: delete those 19 controls, click conAsmCard in Tree view, and press Ctrl+V. (Pasting into a card inside nested galleries is the same step you already did for Punch, Pastes 4f and 4g.)

If any formula shows "Name isn't recognized" for a control that does exist, use the "type a space" fix in guide 3.4.

---

## What you should see (F5, after all three pastes)

- **Header**, left to right: "Assembly"; a **Show started** switch (off) and its label; a grey count line "On the lines: n   Unassigned: m"; a blue **Refresh** button; a grey **Home** button.
- **Left tray, "Unassigned (n)":** active jobs with no assembly line or no assembly date, earliest ship date first.
  - Each card shows the job # (e.g. 8481557-1), a pair dot if paired, "Size n" (red "SET SIZE" in slightly smaller text if blank), "📅 m/d" (red "NO SHIP DATE" in smaller text if blank), the customer (12 characters), and a blue **Assign** button.
  - When the tray is empty it reads "Nothing to assign."
- **Grid**, to the right of the tray:
  - Three column titles across the top: "Line 1 n jobs" ("1 job" when there is one), "Line 2 ...", "Line 3 ...".
  - One row per workday. Rows run from the earlier of today and the oldest shown job's date, to at least the 10th workday from today. A Saturday or Sunday row appears only when a job is assigned to that day.
  - Each row has three date bars, one per line, with that cell's job count. Today's bar is blue and reads "(today)". Bars for past days are dark red. Weekend dates are in amber text.
- **Grid card** (under its line, in cell order; a pair always sits together):
  - Row 1: job #, Size, 📅 ship date, slack. The slack is "+N" workdays from the assembly day to the ship day: green when 2 or more, amber when 0 or 1, red when below 0. A pair dot sits on the right. A long job # (two-digit fan, e.g. 8481557-12) is drawn a little smaller so the whole number fits. "SET SIZE" and "NO SHIP DATE" are in smaller red text; "NO SHIP DATE" uses the space where the slack would be (there is no slack without a ship date).
  - Row 2: small squares for each needed gauge (12..24), then **BK** (brake/PB) and **P4**. Each is green when done and yellow when not. An amber "📅 was m/d" chip shows at the right end of the row when CASMFG moved the ship date.
  - Row 3:
    - **Start**: grey; when started it turns green and reads "✓ Started m/d".
    - an amber **⚠** if the job breaks a line rule; the card also gets an amber border.
    - **▲** and **▼**, and the ✎ pencil.
- **Assign panel** (tray **Assign**, or the ✎ on a card):
  - The title is "Assign 8481557-1" (or "Move ..." for an assigned job), followed by the size / ship / customer / TON line and "Now: Line n, ddd mmm d".
  - A **Line** drop-down and a **Start date (Mon-Fri)** picker.
  - Amber warnings that don't block saving:
    - Size 4 not on Line 3
    - Size 3 on Line 1
    - a heavy size 3 (TON 25/30/2530) not on Line 3
    - Size 1 on Line 3
    - a Saturday or Sunday
    - a past date
  - For a paired job, a grey line names where its mates are.
  - Buttons: **Assign** / **Move here** and **Cancel**. The dark overlay doesn't close the panel; use Cancel.

## Manual test (Preview, F5)

Use TEST jobs (job # starting TEST, made with Punch > Add job) so nothing real moves.

1. **Assign.** Open Assembly. TEST jobs without a line or date are in the tray. Tap **Assign** on one, pick Line 2 and a weekday, and tap **Assign**. The button greys out for a moment (it fetches the latest data first), then the panel closes, the job leaves the tray and appears at the bottom of that day's Line 2 cell, and the cell count and the header counts go up by 1. A column title with one job reads "1 job", not "1 jobs". In SharePoint, AssemblyLine = Line 2, AssemblyDate = that day, and AssemblyOrder is a number.
2. **Warnings.** Open ✎ on a size-4 TEST job (set Size 4 in Punch > Edit if needed). Pick Line 1 and a Saturday. Two amber lines appear ("Size 4 builds on Line 3 only." and "Saturday is not a workday..."). Tap **Move here**. It saves anyway: the card moves, gets an amber border and a **⚠**, and tapping ⚠ shows a banner with the reason.
3. **Cancel.** Open ✎ on any card, change the line, and tap **Cancel**. Nothing changes. Open ✎ again: the drop-down shows the job's current line.
4. **Order.** Put two TEST jobs on the same line and day. Tap **▲** on the lower one: they swap. Tap **▲** again on the one now at the top: nothing happens. Tap **▼** on it: they swap back.
5. **Pairs.** Pair two TEST jobs in Punch and give them the same line and day here. Tap **▲**/**▼** around a third job: the pair moves as one block and stays together. Open ✎ on one of them: the grey line names its mate and where it is.
6. **Start.** Tap **Start** on a card. It turns green and reads "✓ Started" with today's m/d; SharePoint shows Started = Yes and StartedOn = today. Tap it again: it goes back to grey "Start", and Started = No with StartedOn empty.
   - *Stale tap keeps the date:* in SharePoint, set a TEST job (still showing grey "Start" in the app) to Started = Yes and StartedOn = a day last week. Within 60 s, before the app refreshes, tap **Start** on that card. It turns green and reads "✓ Started" with **last week's** date, not today's; SharePoint keeps last week's StartedOn. (If the card turned green on its own before you tapped, the 60 s refresh got there first: untick it in SharePoint and try again, tapping sooner.)
7. **Show started.** In SharePoint, set a started TEST job's ShipDate to yesterday. Within 60 s (or after **Refresh**) its card disappears. Turn **Show started** on: it comes back (on its own date row, even a past one). Turn it off again.
8. **Slack.** On a TEST card assigned Monday with a ship date that Friday, the card shows green "+4". Move it to Thursday: amber "+1". Move it to the following Monday: red "-1".
9. **Ship moved.** If a TEST job has PrevShipDate set (import a moved date, or type one into SharePoint), the amber "📅 was m/d" chip shows. Tap it: the chip disappears and PrevShipDate is empty.
   - *Moved again:* set PrevShipDate on a TEST job and wait for the chip. Then change that job's ShipDate in SharePoint and, within 60 s, tap the chip. An amber banner says "CASMFG moved this ship date again..."; the chip stays, PrevShipDate is unchanged, and the card shows the new ship date. Tap the chip again: now it clears. (If the card already showed the new date before you tapped, the refresh got there first; that's fine, the chip simply clears.)
10. **Refresh.** On a second device, tick something on a job shown here (e.g. P4 on Bending). Within 60 s the square turns green here. While the Assign panel is open, the screen doesn't refresh. While Refresh runs, the button turns darker blue (not white).
11. **Two tablets, same cell.** On tablet A, tap **Assign** on TEST job X, pick Line 1 and a day, and leave the panel open. On tablet B, assign TEST job Y to the same line and day. Now tap **Assign** on A: X lands **below** Y (its AssemblyOrder in SharePoint is higher than Y's), not level with it.
12. **Job dismissed meanwhile.** On tablet A, open the Assign panel for a TEST job. On tablet B, dismiss that job in Punch. Tap **Assign** on A: an amber banner says "This job is no longer active, so nothing was saved." and the panel closes. SharePoint shows no new line or date on that job.

Afterwards, set the TEST jobs to Dismissed in Punch.

---

## Assumptions and decisions (each with its fallback)

| # | What I did | Why | If you want it different |
|---|---|---|---|
| A1 | **Slack** = the workdays (Mon-Fri) from the assembly day up to the ship day. Same day = 0, Mon to Fri = +4, a Sat/Sun date counts like the next Monday. Green when 2 or more, amber at 0 and 1, red below 0. No ship date = no number. | app-spec: "+N workdays between AssemblyDate and ShipDate; red when below 0". The 2-or-more = green and 1 = amber split is from assembly.js. assembly.js also made 0 red, but app-spec says red only below 0, so 0 is amber. | Ask; it's one formula (galAsmDays.Items, column AsmLocSlack, and lblAsmSlack.Color). |
| A2 | **Blank size = no line-rule warning.** The card already shows red "SET SIZE". | The old board (assembly.js `effSize(j) \|\| 1`) treated an unknown size as 1, which would flag a blank-size job on Line 3 with a "Size 1" warning. app-spec lists the rules by size, and a "Size 1" message on a job with no size would mislead. Kept after review. | Ask, and it can be changed to treat blank as 1. |
| A3 | The **"started and shipped" hiding** (Show started) also applies to the Unassigned tray, not only the grid. | app-spec's Visibility rule is general. CONTRACT's tray filter doesn't mention it; app-spec ranks higher. | A one-formula property patch on galAsmTray.Items, lblAsmTrayTitle.Text and lblAsmTrayEmpty.Visible. |
| A4 | Cards show the **"📅 was m/d"** ship-move chip, and a tap acknowledges it (clears PrevShipDate). | list-design: PrevShipDate drives the flag "on Punch and Assembly cards", and the supervisor acknowledges it. | Hide it with btnAsmMoved.Visible = false. |
| A5 | **Panel defaults.** Line = the job's current line; otherwise a suggestion from the rules (size 4 or heavy size 3 gives Line 3, size 3 gives Line 2, else Line 1). Date = the job's current assembly date; otherwise today, or next Monday at a weekend. | Fewer taps, and the suggestion never triggers a warning. | Ask. |
| A6 | **Assign/Move moves only the one job.** Pair mates are not dragged along; the panel names where they are. ▲/▼ do move the pair as a block (CONTRACT D1). | app-spec defines pair movement only for ▲▼. assembly.js asked whether to bring the mate (`pairChoiceDialog`); app-spec doesn't ask for that. Kept after review. | Ask for "move the mates too". |
| A7 | **No "Unassign" button.** app-spec doesn't have one. | Clearing a Choice column is guide U13 (untested). | To take a job off the grid, clear its Assembly line/date in Punch > Edit, or ask for an Unassign button. |
| A8 | Extra non-blocking warning: **"That date is in the past."** | Easy slip on a date picker. | Ask; it's one line in lblAsmPWarn.Text. |
| A9 | **Started** is tapped on this board (app-spec), not only from the Line iPad as in assembly.js. | app-spec: "sets Started and StartedOn = Today(); unticking clears both". | None needed. |
| A10 | The three line columns are **one 3-across card list per day row** (Line 1, Line 2, Line 3), padded with empty slots so each line keeps its own column. Cards line up row by row across lines, like the old grid. | Two levels of galleries is the limit (guide 6.11), and this needs only one card design instead of three copies. | None needed. |
| A11 | **Status squares are Labels, 27 px wide at a 30 px pitch**, not CONTRACT 9.4's 40 px Buttons at a 46 px pitch. | They have to fit the 346 px card: up to 6 gauges + BK + P4 = 8 squares, and 8 x 46 = 368 px is wider than the card. They are read-only, so a Label is enough (no hover or pressed state). The packing (needed gauges only, then BK and P4) follows CONTRACT 6.2 / 9.4. | None needed. |
| A12 | **Tray card: "NO SHIP DATE" is drawn at size 10 and the Assign button is 64 px wide (size 13).** The grid card draws it at size 11 in the empty slack slot. "SET SIZE" is size 11 on both cards. | Keeps list-design's wording ('the card shows NO SHIP DATE') and still fits: checked against Open Sans and Arial metrics. A shorter "NO SHIP" would fit at size 13, but on a tablet (no tooltips) it can read as "do not ship". | Ask; it's a property patch on lblAsmTrShip (Text / Size / Width) and btnAsmTrAssign (Width / Size). |
| A13 | **Assign / Move here fetches the latest data before it saves** (Refresh, then the cell max + 1 and the same-cell check). If the job is no longer active (dismissed, or closed, on another device), nothing is written and a banner says so. | The timer skips refreshing while the panel is open, so without this the cell max and the same-cell check could be as old as the panel (two jobs with the same order; or "Move here" back to a cell the job was moved out of writing nothing). | None needed. |
| A14 | **Start keeps an existing StartedOn.** If the row in SharePoint is already started (a stale card showing "Start"), the tap writes Started = Yes and keeps that StartedOn instead of today. Unticking still clears both. | A stale tap must not restart the 30-day housekeeping clock. CONTRACT 6.4's record shape is `{Started: true, StartedOn: Today()}`; this only differs when the row was already started. | None needed. |
| A15 | **The "📅 was" chip re-checks the ship date before it clears PrevShipDate.** If SharePoint's ShipDate differs from the one on the card (CASMFG moved it again since the last refresh), nothing is written; a banner asks to check the new date, and the screen refreshes. | An import can move ShipDate again while keeping the first PrevShipDate (list-design), so the tap would otherwise acknowledge a move nobody saw. | None needed. |

## Uncertainties and fallbacks

| # | What could differ in Studio | How you'll notice | Fallback |
|---|---|---|---|
| U-a | **Day rows growing to fit their cards** (guide U4: flexible-height gallery with an inner gallery). | A cell with 3 or more cards is cut off, or the next day's date bars overlap cards. | Report it with a screenshot. I'll send a replacement Paste 6a with fixed-height day rows (guide U4, second fallback). |
| U-b | **The 3-across inner list** (galAsmCells, WrapCount 3) splitting its 1,056 px into three 352 px columns, under the date bars. | Cards a few px off the date bars (harmless), or only 1-2 cards per row. | Report it. |
| U-c | **Pasting into a container inside a gallery** (Paste 6c into conAsmCard). | The 19 controls don't appear under conAsmCard. | Click conAsmCard and press Ctrl+V. Otherwise delete the strays and report. |
| U-d | **Scroll position** after a tap. Every save recalculates the grid, and Studio may scroll the list back to the top. | After Start or ▲ the grid jumps to the top. | Not testable offline. Report it if it's annoying. |
| U-e | **Symbols** ✓ ⚠ 📅 on a tablet (guide U12). ▲▼ are built with UniChar(9650/9660). | A box instead of a symbol. | Report the device; the text can be swapped for plain words. |
| U-f | **Date-only values** (list-design pitfall 5). The picker writes SelectedDate; dates are compared as yyyymmdd keys. | The card lands one row off from the date picked. | Covered by go-live test (2). Fix centrally, never per picker. |
| U-g | **Mouse wheel on a PC** over the card area may not scroll the day list. | Wheel does nothing over cards. | Touch swipe works. On a PC, use the scrollbar at the right edge of the grid. |
| U-h | **Refresh inside Assign / Move here** (A13). Whether `ActiveJobs` is recalculated inside the same OnSelect, right after `Refresh(RunListJobs)`, is the same open point as guide U9. | Covered by manual tests 11 and 12. | If it isn't, Save behaves exactly as before the change (stale cell max), so nothing gets worse. Report it. |
| U-i | **Text widths.** Segoe UI isn't available offline, so every tight label was measured with Open Sans and Arial metrics (both wider than Segoe UI) and fits. | Red "NO SHIP DATE" / "SET SIZE", a long job #, or the "📅 was" chip is cut off. | Report which label and on which device; it's a Size or Width property patch. |
| U-j | **"✓ Started m/d"** wraps to two lines inside the 56 px Start button (text about 135-142 px, button 124 px). Two lines fit the height, so nothing is cut. | The button shows the date on a second line. | Cosmetic; no action. |

## Open issues

1. ~~scrPunch has the same ship-move acknowledge gap~~ **Fixed in the integration pass:** btnPunMovedS8 / btnPunMovedS15 now use this screen's A15 check (CONTRACT 6.4).
2. **Other screens' Refresh / Home buttons** probably flash a light disabled fill while Refresh runs (CONTRACT request 3). Fixed locally here.
3. **U-h** (does a Refresh inside Save recalculate ActiveJobs at once?) can only be checked in Studio: manual tests 11 and 12.
4. **A2 (blank size = no line warning) and A6 (Assign doesn't bring pair mates)** are decisions the user may want to change; both differ from assembly.js on purpose.

## Changes after the 2026-10-02 reviews

- 6a: header order is now Title, toggle, "Show started", counts, Refresh, Home (CONTRACT 9.1; no forward reference to the toggle). Refresh and Home (and the tray Assign) have disabled colours. Tray "SET SIZE" at size 11; tray "NO SHIP DATE" at size 10 in a 102 px label; tray Assign button 64 px at size 13 (A12). Column titles say "1 job".
- 6b: Assign / Move here refreshes first, refuses a job that is no longer active, then saves (A13). Cancel has disabled colours.
- 6c: "SET SIZE" at size 11; "NO SHIP DATE" label widened into the slack slot; long job # drawn smaller; "📅 was" chip at size 10, 92 px wide, right-aligned on row 2 (X 250); chip re-checks the ship date (A15); Start keeps an existing StartedOn (A14); ✎ icon has hover, pressed and focus colours; ⚠ button has disabled colours.
- Re-paste: these are new versions of all three pastes (the header order changed, so this is a structure change, not a property patch). If an older 6a-6c is already in the app, follow guide 3.5: back up, delete scrAssembly, then paste 6a, 6b and 6c again.

## Requests for App.Formulas / CONTRACT (optional; the screen works without them)

None of these blocks a paste. Each one already has a local workaround on this screen.

### App.Formulas

The screen computes these two values locally, inside `galAsmDays.Items`, as `AsmLocSlack` and `AsmLocRule`. They are named differently on purpose, so adding the shared versions can never clash. If the shared ones are added, the local copies can later be dropped with a property patch.

1. Add two columns to `ActiveBase` (they flow into `ActiveJobs`):
   ```
   AsmSlack, If(ShipKey = 99999999 || AsmKey = 99999999, Blank(),
       With({a: DateDiff(Date(2001, 1, 1), Date(Year(AssemblyDate), Month(AssemblyDate), Day(AssemblyDate)), TimeUnit.Days),
             b: DateDiff(Date(2001, 1, 1), Date(Year(ShipDate), Month(ShipDate), Day(ShipDate)), TimeUnit.Days)},
           5 * RoundDown(b / 7, 0) + Min(Mod(b, 7), 5) - 5 * RoundDown(a / 7, 0) - Min(Mod(a, 7), 5))),
   ```
   `AsmRule` (Text, never blank) is the line-rule text for the job's own LineText. Use the same `If(...)` as `AsmLocRule` in galAsmDays.Items. It goes in the outer AddColumns of ActiveBase, next to `HeavyTon`, because it needs `HeavyTon` and `TonToken`.
2. A UDF, so the card and the Assign panel share one rule text. It needs the New analysis engine, guide 2.5:
   `AsmRuleText(size: Number, heavy: Boolean, ton: Text, line: Text): Text = If(size >= 4 && line <> "Line 3", "Size 4 builds on Line 3 only.", size = 3 && heavy && line <> "Line 3", "Size 3 with " & ton & " TON is a heavy build: Line 3 only.", size = 3 && line = "Line 1", "Size 3 does not build on Line 1 (Line 1 runs the small 1-2s).", size = 1 && line = "Line 3", "Size 1 does not build on Line 3 by default.", "");`

### CONTRACT (from the 2026-10-02 reviews)

3. **9.1 header template: add disabled colours to the Refresh and Home buttons**: `DisabledColor: =Self.Color`, `DisabledFill: =ColorFade(Self.Fill, -30%)`. Buttons disable themselves while their OnSelect runs (`AutoDisableOnSelect`, on by default), and `Refresh(RunListJobs)` takes a moment, so without these the button flashes the theme's light disabled fill on the dark header. Local workaround: added to btnAsmRefresh and btnAsmHome (and to btnAsmTrAssign, btnAsmPCancel and btnAsmRule). Other screens built from 9.1 probably have the same flash.
4. **6.4 "Started tick"**: say that "on" keeps an existing StartedOn when the freshly read row is already started (`If(cur.Started && !IsBlank(cur.StartedOn), cur.StartedOn, Today())`, with `cur = LookUp(RunListJobs, ID = id)`). Local workaround: btnAsmStarted (A14).
5. **6.4 "Ship move acknowledged"**: re-read the row and clear PrevShipDate only when `Text(ShipDate, "yyyy-mm-dd")` still equals the ShipYmd the card showed; otherwise Notify and Refresh. Local workaround: btnAsmMoved (A15). **scrPunch has the same gap** (btnPunMovedS8 / btnPunMovedS15 clear PrevShipDate without the check); that is for the Punch agent.
6. **6.4 "Band max + 1" from a panel**: on screens whose timer skips refreshing while a panel is open, refresh (and bump `gblRefreshTick`) before computing the band max, after reading the panel's inputs into a `With`. Local workaround: btnAsmPSave (A13). Punch's Place / Edit save may want the same.
7. **9.4 Assembly squares**: record that Assembly uses 27 px Labels at a 30 px pitch (A11), because 8 x 46 px doesn't fit a 346 px card.
8. **9.3 / 3.4 "NO SHIP DATE"**: ShipText is long for compact cards (about 116-122 px at size 13). Consider noting in 9.3 that compact cards draw it at a smaller Size, as this screen does (A12).

## Data and contract compliance

- **RunListJobs** is touched only by:
  - `Choices(RunListJobs.AssemblyLine)` (column metadata),
  - writes of the form `Patch(RunListJobs, LookUp(RunListJobs, ID = id), ...)`,
  - `Refresh(RunListJobs)` (Refresh button, timer, OnVisible, and the first step of Assign / Move here, each followed by the `gblRefreshTick` bump), and
  - a single-row `LookUp(RunListJobs, ID = id)` read right before the Patch in Start (A14) and in the 📅 chip (A15). app-spec and CONTRACT 5 allow this ("a single-row LookUp before a Patch"); it is delegable (ID =).
- Everything else reads `ActiveJobs`, `AsmDays` or `AsmDaysAll`, which are in memory. No delegation warning is expected; any warning is a bug, so report it.
- **Every write** is a Button `OnSelect` using the write helper (values worked out first in `With`, `IfError`, Refresh, retry once, then `Notify`). Each button patches only its own columns:

  | Button | Columns |
  |---|---|
  | Assign / Move here | AssemblyLine, AssemblyDate, AssemblyOrder = cell max + 1, worked out after a refresh (nothing is written if the line and date are unchanged, or if the job is no longer active) |
  | Start | Started, StartedOn (an existing StartedOn is kept if the row is already started) |
  | 📅 chip | PrevShipDate (only if SharePoint's ShipDate still matches the card) |
  | ▲ / ▼ | AssemblyOrder only, using the CONTRACT 6.4 move snippet (the Assembly variant, its `vis` filter equal to the cell's filter) |

- **Context variables** are only `locPanel` ("" or "assign") and `locId`. The only global is `gblRefreshTick`. There are no collections.

## Offline verification done

Re-run after the 2026-10-02 review fixes:

- `python3 tools/palint.py`: 0 errors, 0 warnings on each paste (6a: 32 names, 6b: 11, 6c: 19), on the three joined back into one screen (62 names), and on all screens together (425 names, no duplicates).
- No control refers to a control that comes later in the same paste (checked by script), so no "Name isn't recognized" is expected (guide U3).
- All 859 property-formula blocks were type-checked in the Power Fx 1.8.1 interpreter, default and V1 mode, against the current App.Formulas and sample RunListJobs rows, with stubs for Notify, Reset, Refresh and UpdateContext and for the controls. 0 failures.
- Text widths of every tight label were measured with Open Sans and Arial metrics (U-i). All fit after the fixes.
- Behaviour runs (today = Fri 2026-10-02) all passed:
  - Grid rows: an overdue Tue 9/29 row, a Sat 10/10 row only because a job is on it, and the 10-workday tail.
  - A started job that already shipped is hidden; one shipping today is still shown; "Show started" brings the hidden one back on its 9/28 row.
  - A cell's order keeps a pair adjacent; the Line 1/2/3 slot layout is correct.
  - Slack +4 / +3 / +1 / 0 / -2 / blank.
  - All four rule texts.
  - Tray order.
  - Panel defaults, warnings and pair text.
  - Assign into an occupied cell (order = max + 1) and into an empty cell (order = 1); same cell = no write; a move to another line keeps the other columns; a blank line or date writes nothing and doesn't refresh.
  - Save races: another device assigns a job into the same cell first (this job gets max + 1 above it); another device moved this job away ("Move here" back to its old cell now writes); the job was dismissed meanwhile (nothing written, banner, panel closes). The same three runs fail on the formulas before the fix.
  - Start and un-start; a stale Start tap on a row already started 9/20 keeps 9/20 (today's date before the fix).
  - Ship-move acknowledge; and when ShipDate changed after the card was drawn, PrevShipDate is kept and a banner shows (cleared before the fix).
  - Column titles "1 job" / "n jobs"; job # size 16 / 14 / 12 by length; "SET SIZE" and "NO SHIP DATE" sizes and widths on both cards; chip at X 250.
  - ▲ single, ▼ swapping past a pair, ▲ on a pair member moving the pair, and ▲ at the top doing nothing.
