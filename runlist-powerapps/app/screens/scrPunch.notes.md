# scrPunch (Punch, supervisor): paste notes

The Punch screen comes in **8 pastes** (4a to 4h), because the whole screen is about 3,900 YAML lines (guide 3.8 asks for under about 800 per paste). Paste 4a first. Every later paste goes **into a container** that paste 4a created; 4b to 4h can then go in any order, except that 4c comes after 4b (it uses controls from 4b). 4g doesn't use 4f's controls; it follows 4f only to keep the two cards together.

| Paste | File | Lines | Goes into |
|---|---|---|---|
| 4a | `scrPunch.1.yaml` | 704 | a new screen (header, empty Incoming tray, board, timers, empty panels) |
| 4b | `scrPunch.2.yaml` | 557 | `conPunEditPanel` (edit panel: the fields) |
| 4c | `scrPunch.3.yaml` | 410 | `conPunEditPanel` (edit panel: pairing, warnings, Cancel / Dismiss / Save) |
| 4d | `scrPunch.4.yaml` | 417 | `conPunPlacePanel` (Place panel) |
| 4e | `scrPunch.5.yaml` | 275 | `conPunFindPanel` (Find job # panel) |
| 4f | `scrPunch.6.yaml` | 686 | `conPunCardS8` (the SB8 punch card) |
| 4g | `scrPunch.7.yaml` | 686 | `conPunCardS15` (the SB15 punch card) |
| 4h | `scrPunch.8.yaml` | 144 | `conPunTray` (the Incoming tray's card list, `galPunTray`) |

All eight pass `tools/palint.py` with 0 errors and 0 warnings, alone and together with the other screens in this folder (425 names app-wide, no duplicates). Together they hold 152 controls, all named `…Pun…`. The context variables are `locPanel`, `locId` and `locPun…`.

**Round 2 (two reviews applied, 2026-10-02):** 4a got smaller (the tray card list moved to the new paste 4h), and properties changed in every other paste. If an earlier version is already pasted, delete scrPunch and paste all eight again (guide 3.5); a list of single property patches would be longer than the pastes.

---

## Paste steps

```
PASTE 4a of 12 (scrPunch part 1 of 8): screen scrPunch (new screen)
Before this: Pastes 0-3 done (setup, App.OnStart, App.Formulas, scrHome). TheWhiteBoard connected.
Where: Tree view → Screens tab → right-click any screen → Paste.
After: run the 3.4 checks. Expected: exactly 1 error, on btnPunImport (OnSelect):
       "scrImport" isn't recognized. That is normal; it clears at Paste 12, after scrImport exists.
       The Incoming tray is empty until Paste 4h; that's normal too.
```

```
PASTE 4b of 12 (scrPunch part 2 of 8): edit panel fields
Before this: Paste 4a done.
Where: Tree view → expand scrPunch → right-click conPunEditPanel → Paste.
       (If Paste isn't in the menu: click conPunEditPanel once, then press Ctrl+V.)
After: run the 3.4 checks. Expected: no new errors (only the btnPunImport / scrImport error
       from 4a remains until Paste 12). The panel stays hidden in the editor; that's normal.
```

```
PASTE 4c of 12 (scrPunch part 3 of 8): edit panel pairing + buttons
Before this: Paste 4b done.
Where: Tree view → scrPunch → right-click conPunEditPanel → Paste (same container as 4b).
After: run the 3.4 checks. Expected: no new errors (only the btnPunImport / scrImport error
       from 4a remains until Paste 12).
```

```
PASTE 4d of 12 (scrPunch part 4 of 8): Place panel
Before this: Paste 4a done.
Where: Tree view → scrPunch → right-click conPunPlacePanel → Paste.
After: run the 3.4 checks. Expected: no new errors (only the btnPunImport / scrImport error
       from 4a remains until Paste 12).
```

```
PASTE 4e of 12 (scrPunch part 5 of 8): Find job # panel
Before this: Paste 4a done.
Where: Tree view → scrPunch → right-click conPunFindPanel → Paste.
After: run the 3.4 checks. Expected: no new errors (only the btnPunImport / scrImport error
       from 4a remains until Paste 12).
```

```
PASTE 4f of 12 (scrPunch part 6 of 8): SB8 punch card
Before this: Paste 4a done (4b to 4e can come before or after).
Where: Tree view → scrPunch → expand galPunBoard → expand galPunCardsS8 →
       right-click conPunCardS8 → Paste. (Or click conPunCardS8 once, then Ctrl+V.)
       It must be conPunCardS8, the container INSIDE galPunCardsS8, not galPunBoard.
After: run the 3.4 checks. Expected: no new errors (only the btnPunImport / scrImport error
       from 4a remains until Paste 12). Every SB8 card on the canvas now shows its job.
```

```
PASTE 4g of 12 (scrPunch part 7 of 8): SB15 punch card
Before this: Paste 4f done.
Where: Tree view → scrPunch → galPunBoard → galPunCardsS15 → right-click conPunCardS15 → Paste.
After: run the 3.4 checks. Expected: no new errors (only the btnPunImport / scrImport error
       from 4a remains until Paste 12).
```

```
PASTE 4h of 12 (scrPunch part 8 of 8): Incoming tray card list
Before this: Paste 4a done (any time after it).
Where: Tree view → scrPunch → right-click conPunTray → Paste. (Or click conPunTray once, then Ctrl+V.)
       conPunTray is the left-hand container directly under scrPunch. Don't select galPunBoard
       or any other gallery when you paste.
After: run the 3.4 checks. Expected: no new errors (only the btnPunImport / scrImport error
       from 4a remains until Paste 12). Tree view now shows galPunTray as the last item in
       conPunTray, and the tray lists the Incoming jobs.
```

The card files 4f and 4g are identical apart from the control names (`…S8` / `…S15`).

---

## What you should see after pasting

Press **F5** (Preview). Timers only run in Preview.

- **Header:** "Punch", job counts (`Jobs: 42    S1 5  S2 20  S3 12  S4 3`), a "Find job #" box with a **Find** button, the **Show completed** switch, then **+ Add job**, **Import**, **Refresh** and **Home**. As on the old board, the counts are **open** jobs only: a job whose turret gauges, PB and P4 are all done is left out, even while it is still on the Assembly board. So "Jobs" can be lower than the number of cards with Show completed on.
- **Incoming tray (left, 300 px):** "Incoming (n)", one card per Incoming job sorted by ship date. Each card shows the job label, the size (red "SET SIZE" if blank), 📅 ship date, customer (12 characters), ✨ NEW if it arrived today, and a blue **Place** button. **◀** hides the tray. A thin strip with **▶** and the count brings it back.
- **Amber banner** (only if CASMFG moved ship dates on active jobs): "📅 CASMFG moved N ship dates…".
- **Board:** column titles "SB-8 · n to punch" and "SB-15 · n to punch". Below them is one row per day band:
  - ⚠ Unscheduled first (only when a job has no punch day);
  - then today (blue header) and the next 5 days, plus any other day holding jobs;
  - past days show with a red-tinted header, and only while they hold unfinished jobs.
  - Each band shows its SB8 cards on the left and SB15 cards on the right, and each half-header shows the date and the job count. The two machines' days line up and scroll together.
- **Punch card** (3 compact rows):
  1. job-fan, Size, 📅 ship, customer, **✎** (edit) and the coloured pair badge (number = pair, same colour on every screen);
  2. six gauge pills 12…24 (grey = not needed, yellow = needed, green = punched), **Nested**, **▲ ▼**;
  3. the nest-label box (with a blue **✓** that appears when you type), ✨ NEW, the amber **📅 moved from m/d** tag, ⚠ SB15 (a size 1 or 4 job on SB15), and the notes line.

A paired card has a coloured border. A turret-complete card (only shown with Show completed on) is darker.

---

## Manual test (Preview, about 10 minutes)

Use a job number like `TEST` for anything you create, and dismiss it at the end. An Owner can delete TEST rows later.

1. **Board loads.** Today's band is blue, followed by the next 5 days. Jobs sit in the right machine column and day. Each column title's "n to punch" matches its cards with Show completed off. The header's Jobs count is the open jobs (it leaves out jobs with turret, PB and P4 all done).
2. **Place.** On a tray card, tap **Place**, choose **SB15**, pick tomorrow, then tap **12** and **16** so they turn yellow, and tap **Place on SB15**. The card leaves the tray and appears at the **bottom** of tomorrow's SB15 band with yellow 12 and 16 pills. For a size 1 or 4 job, an amber warning shows in the panel when SB15 is chosen.
3. **Gauge pills.** On that card, tap **14**: it turns yellow. Tap it again: grey. Tap a **green** pill: a warning says it is already punched, and nothing changes.
4. **Nested + label.** Tap **Nested** (it turns green, "✓ Nested"). Type a label such as `25TON A` in the label box: a blue **✓** appears. Tap it, and the ✓ disappears (saved).
5. **▲ ▼.** In a band with 3+ cards, tap ▲ on the bottom card. It moves up one place. Tap ▼ and it goes back. ▲ on the top card does nothing.
6. **Edit.** Tap **✎** on an imported job. Job # and Unit # are greyed out. Change **Punch day** to another day and **Fan #**, then tap **Save**. The card moves to the **end** of the new day band and shows the new fan #. Open it again and tap **Cancel**: nothing changes.
7. **Pair.** In ✎, type another active job's number (or job-fan) in "Pair with job #" and tap **Pair**. Both cards get the same coloured number badge and border, and sit together in the band. Tap **Unpair**, and the badges go.
8. **Add + Dismiss.** Tap **+ Add job**: Job # `TEST`, Unit # empty, Machine SB8, no punch day, then **Save**. "Job added." shows, and the card appears in the **Unscheduled** band. Open it with ✎ and tap **Dismiss job** twice ("Tap again to dismiss"). The card disappears.
9. **Find.** Type `TEST` in **Find job #** and tap **Find**. The dismissed TEST job is listed. Tap **Restore** and it appears in the Incoming tray. Find a **Done** job's number and tap **Reopen**: it is back on the boards. Tap **Close**.
10. **Refresh + ship move.** Leave the screen with no panel open for 60 seconds: a change made on another device (for example a tick on SB8) shows up. With a panel open, nothing refreshes. If a card has an amber **📅 moved from** tag, tap it: the tag goes, and the banner count drops by one.

Also try **Show completed**: turret-complete cards appear (darker), and turning it off hides them again.

11. **Look check.** A card with no ship date shows the whole red "📅 NO SHIP DATE" (its customer moves right a little). A ship move from a two-digit month shows the whole tag, e.g. "📅 moved from 10/12". The header shows "Show completed" in full, and the counts are not cut off. While a save is running, the tapped button turns a darker shade of its colour, never light grey.

### Two-device checks (optional, about 5 minutes; needs a second tablet or browser tab on Punch)

These cover the round 2 fixes. Use TEST jobs.

12. **Edit doesn't undo other devices.** Tablet A: open ✎ on a job. Tablet B: tap ▲ on that job (or, on Assembly, move it to another day). Tablet A: change only **Notes** and tap **Save**. After the next refresh both tablets show B's order or assembly day, and A's note.
13. **Place after someone else.** Tablet A: tap **Place** on a tray job. Tablet B: place or dismiss the same job. Tablet A: tap **Place on SB8**. A says "This job is no longer in the Incoming tray…", nothing changes, and the board refreshes.
14. **Punched gauge.** Tablet A shows a yellow pill. On SB8, tick that gauge. Within 60 s, before A refreshes, tap the yellow pill on A. A says "… ga is already punched, so it stays selected." and the pill turns green.
15. **Restore / Reopen twice.** Both tablets: Find the same Dismissed (or Done) job. A taps **Restore** (or **Reopen**); then B taps it too. B says "This job is no longer dismissed…" (or "…no longer Done…") and changes nothing.

---

## Design choices to know about

- **Nest label saves with a small ✓ button, not OnChange.** Guide rule 18 says: "Inside galleries, use Classic/Button for anything that writes." So the label box has no OnChange. The blue ✓ appears only while the text differs from the saved label. This differs from app-spec ("saves OnChange") and contract 6.4. The guide wins on control rules, as the task asked. *Tell the nester:* type the label, then tap ✓. Unsaved typing can be lost when the board refreshes (every 60 s, or after any other tap that saves).
- **Board layout:** one outer band gallery (`galPunBoard`, flexible height) holds **two** inner card galleries per band, SB8 on the left and SB15 on the right. Guide 7.5 suggests two separate outer galleries; this layout has the same nesting depth (2 levels), but a day's SB8 and SB15 bands line up and scroll together, as on the old board.
- **Cards are 3 compact rows (104 px).** app-spec says "one or two rows", but at about 515 px per column the six pills, Nested, ▲▼, ✎, the label box and the flags don't fit in two rows at touch size.
- **Pair** merges both jobs' groups. Every member gets PairNo = the lowest ID among them (list-design: Min(ID), groups of 2+ allowed). **Unpair** clears the **whole** pair group, like the old board's "Unlink this paired group".
- **Edit panel, non-active jobs** (opened from Find: Incoming, Done, Dismissed): Machine, Punch day and the Assembly fields are greyed out and not saved, because Place and Reopen own them. Notes, Fan #, Customer, Model, Size and Ship date still save.
- **Save writes only what you changed** in Machine, Punch day, Assembly line, Assembly date and Ship date. Each of those fields you left alone keeps the row's value **as it is on the server at Save time** (one fresh `LookUp(TheWhiteBoard, ID = …)`), not the copy taken when the panel opened. So Assembly moving the job, Import moving its ship date, or another Punch tablet's ▲▼ while the panel is open is not undone. The punch order and the assembly order are kept unless the job really changes band or cell; then it goes to the end of the new one. Fan #, Customer, Model, Size and Notes are always written from the panel (only this panel edits them).
- **Status writes re-check the row first.** Place needs the row to still be Incoming, Restore needs Dismissed and Reopen needs Done, read fresh from the list. Otherwise the button says so, changes nothing and refreshes.
- **Need pills re-check a yellow pill** before un-needing it: the card can be up to 60 s old, so if the gauge was punched meanwhile it stays needed (app-spec: a done gauge can't be un-needed). Grey and green pills skip that read.
- **Pair / Unpair count their writes.** If any member's write fails twice, the button says how many did not change ("Tap Pair again"), instead of "Paired".
- **Header counts** leave out finished jobs (PunchDone), as `app.js` `renderStats` counts only open (status 'active') jobs.
- **Busy colour:** every button that saves keeps `AutoDisableOnSelect` on (contract 6) and shows `ColorFade(Self.Fill, -30%)` while it runs, the same pattern as scrHome, scrAssembly, scrBending and scrNesting.
- **"📅 NO SHIP DATE"** needs about 131 px at 12 pt, so on a card or tray card with no ship date the ship label widens (112 → 138 on cards, 120 → 138 in the tray) and the customer starts further right. Cards with a date keep the full customer width.
- **Moving a job to another band from the edit panel** moves only that job, to the end of the new band. Its pair mates stay where they are; move them the same way.
- **Assembly line** is saved with its own small Patch, and only when it changed. That way a problem clearing a Choice (guide U13) can't block the rest of the Save.
- **Find job #** matches the job number exactly (indexed `JobNumber =`). Type `8481557`, not `8481557-1`.
- **Overlay** (contract D6): tapping outside a panel does nothing. Close with Cancel, Close or Save. One shared overlay (`recPunOverlay`) sits under all three panels, since only one panel is ever open.
- After Save, Cancel or Dismiss on a job opened from **Find**, you return to the Find list.

## Assumptions and uncertainties (with fallbacks)

| # | Uncertainty | Fallback |
|---|---|---|
| 1 | **Guide U4:** the flexible-height band row growing to fit its inner card galleries (Height = cards × 110). If bands overlap or cards are cut off after Paste 4g, see below. | **F1 (one property patch, try first):** galPunBoard → `TemplateSize` = the formula below. Every band row becomes as tall as the busiest band: more empty space, but nothing is cut off. **F2 (flat list, guide U4):** replace `galPunBoard` with two `Vertical` galleries, one per machine. Each one's rows are band headers plus cards, built with `Ungroup` and sorted by BandKey, IsHeader (descending), PunchGroupOrder, PairKey, PunchSort, ID. Header controls get `Visible = ThisItem.IsHeader`, and the two machines then scroll separately. Ask the agent for "scrPunch board fallback F2" and it will hand over that paste. |
| 2 | Pasting controls **into a container that sits inside a gallery** (Pastes 4f/4g into `conPunCardS8` / `conPunCardS15`). The guide verifies pasting into containers, not specifically inside a gallery template. (Paste 4h goes into `conPunTray`, a container directly on the screen: the verified route, guide 3.2.) | If Paste isn't offered, click the container and press Ctrl+V. If the controls land directly in `galPunCardsS8` (one level up), that still works: they only use `Parent.Width`, which is the same width there. |
| 3 | `locPunJob: If(false, LookUp(TheWhiteBoard, ID = 0))` in OnVisible is a *typed blank*. It tells Studio, before any other paste, that `locPunJob` holds one TheWhiteBoard row, so Pastes 4b/4c don't show "name isn't valid" on `locPunJob.FanNumber`. It makes no server call. | If Studio flags it, change that part of scrPunch.OnVisible to `locPunJob: LookUp(TheWhiteBoard, ID = 0)`, which costs one tiny delegable query per visit. |
| 4 | Panel inputs follow their `Default` when it changes, and Cancel / Save `Reset` them. So each job opens with its own values and nothing in the openers references a later paste. | If a panel ever shows the previous job's values, tap Cancel and open it again. Report it; the fix is a property patch adding `Reset(...)` to the opener buttons. |
| 5 | **Unique-key failure:** an Add (or a manual job's Unit # change) whose key already exists should show "Job … is already in the list as <status>". The SharePoint unique rule can't be simulated offline. | Test it once: Add a job with the Job # and Unit # of an existing imported job. If you see a raw "duplicate values" error instead, that's still safe (nothing is written); report it. |
| 6 | Guide U13: clearing a Choice (Assembly line set back to empty). | Only written when it changed. On failure: "Saved, but the assembly line did not change: …" (the rest is saved). Include it in the go-live test. |
| 7 | Guide U12: the glyphs ▲ ▼ ◀ ▶ ✓ ✨ 📅 ⚠ · might show as boxes on some device. | Property patch on that one control's `Text` with plain words ("Up", "Down", "Save", "NEW", "Ship", "!"). |
| 8 | Speed: each card is 21 controls. With 150+ cards on the board, scrolling may lag on older tablets. | Keep "Show completed" off normally. If it's still slow, apply F1/F2 and report it. |
| 9 | Guide U9: other devices' changes after `Refresh(TheWhiteBoard)`. | Covered by the contract go-live test (list-design step 20 (4)). |
| 10 | Dismissing one job of a pair leaves its mate with a pair badge of one. | Open the mate with ✎ and tap Unpair. |
| 11 | An Active job with no Machine (shouldn't happen: Place and Add always set one) isn't on the board. | Find job # → Open → set Machine → Save. |
| 12 | The round 2 re-checks (Save, Place, Restore, Reopen, yellow pills) are a fresh read just before the write, **not a lock**. Two people changing the *same* field of the same job within a second or so: the last write wins, without a warning. | Accepted for a shop with one or two supervisors. If it ever matters, the fix is a version check (compare `Modified` before the Patch), which needs a contract change. |
| 13 | Text widths in round 2 (header counts 310, "Show completed" 144, moved tag 160, NO SHIP DATE 138, NEW 64) are estimates from Arial-metric fonts plus 5 %, not measured in Segoe UI. | If something still clips in Preview: one property patch on that control's `Width` (row 3 of a card has 12 px spare at the 520 px card width). |
| 14 | Pair / Unpair failure counting: a SharePoint write failure can't be produced offline, so the "N job(s) did not pair" path is type-checked only; the success path ran. | If a Pair half-fails, tap Pair again: it writes only the members still wrong. If an Unpair half-fails, tap Unpair again; if this job is already unpaired, open the job that still shows a badge and tap Unpair there. |

**F1 formula** (galPunBoard → TemplateSize; formula bar, no leading `=`; checked in the Power Fx interpreter):

```
44 + 110 * Max(1, Max(ForAll(Distinct(Filter(ActiveJobs, MachineText <> "" && (tglPunShowDone.Value || !TurretDone)), PunchBand) As d, {n: CountRows(Filter(ActiveJobs, PunchBand = d.Value && (tglPunShowDone.Value || !TurretDone)))}), n))
```

**F2 is ready:** if F1 doesn't fix row 1, you don't need to wait for a reply. Follow `app/fallbacks/scrPunch.board-F2-flat.md`, which deletes `galPunBoard`, pastes `app/fallbacks/scrPunch.board-F2-flat.yaml` (two flat lists, `galPunSB8` and `galPunSB15`) and re-pastes 4f and 4g unchanged into the new card containers. Its rows are joined with `Table(...)`; the `Ungroup` form named in row 1 is its patch P1.

## Data rules followed

- **Reads:** board, tray, counts and banner read only `ActiveJobs`, `IncomingJobs`, `PunchBandsOpen` and `PunchBandsAll`. The only direct `TheWhiteBoard` reads are:
  - `LookUp(TheWhiteBoard, ID = …)` (Patch base; loading the job into the edit panel; and, round 2, a fresh re-read just before a write: the edit Save's merge base, the Place / Restore / Reopen status check and the yellow pill's Done check);
  - `Filter(TheWhiteBoard, JobNumber = locPunFindText)` and `LookUp(TheWhiteBoard, JobNumber = Trim(txtPunFind.Text))` (Find);
  - `LookUp(TheWhiteBoard, Title = key)` (Add and manual-key re-check, contract 6.5);
  - `Choices(TheWhiteBoard.Machine / .AssemblyLine)`.
  - No delegation warnings are expected; one would be a bug.
- **Writes:** every write uses the write helper (explicit values in `With`, base `LookUp(TheWhiteBoard, ID = id)`, `IfError`, Refresh, retry, `Notify`) and patches only its own columns:
  - pills → `Need12…24`; Nested → `Nested`; ✓ → `NestLabel`; moved tag → `PrevShipDate` (only if the server's ship date still equals the one on the card; otherwise a warning and a refresh, as scrAssembly A15; added in the integration pass);
  - ▲▼ → `PunchOrder` (contract 6.4 snippet, verbatim);
  - Place → status, machine, day, order, Need*; Dismiss / Reopen / Restore → contract 6.4 records;
  - Pair → `PairNo`; housekeeping → `JobStatus` Done.
- **Add** creates the row once, with JobStatus and all 16 Yes/No explicit, and the manual key rule:
  - `JOB|UNIT`, or `JOB|M` + `yymmddhhmmss` when there is no unit.
  - Imported rows never get a new key, and their Job # / Unit # are never written.
- **Band max + 1** on Place, Add and any real band (or assembly cell) change from the edit panel; otherwise the row's current order is kept. Every sort ends with ID (contract 5.1).
- **No lost updates from the edit panel:** schedule and ship fields the user didn't change are written with the row's fresh server value (see Design choices).
- **Housekeeping** runs in OnVisible and every 10 minutes (`tmrPunHousekeep`). It walks a snapshot with `ForAll(Sequence(…))`.
- **Refresh** (`tmrPunRefresh`, 60 s) is skipped while any panel is open. It, the Refresh button and OnVisible all bump `gblRefreshTick`.

## How this was checked offline

- **palint:** 0 errors and 0 warnings, per file, for the eight scrPunch files together (153 names) and for every screen in the folder together (425 names).
- **YAML hygiene:** no tabs, CRLF, BOM or trailing spaces; every inline formula is under 100 characters with no `:`, `#`, `{` or non-ASCII; non-ASCII appears only inside string literals.
- **Properties:** all 2,626 properties used were compared with the Sept 2026 Studio control templates (`pkgs/*.xml`): 0 missing, 0 hidden. The round 2 additions (DropDown `ChevronDisabledBackground` / `ChevronDisabledFill` / `DisabledBorderColor`, DatePicker `Disabled…`, Icon `Hover…` / `Pressed…` / `FocusedBorderThickness`) are in those templates.
- **Types:** all 2,500 formulas were type-checked (with and without their `//` comments) and the value formulas evaluated in the Power Fx 1.8 interpreter against the current `App.Formulas.txt` and sample rows (0 failures, 0 wrong result types: colours are colours, Visible is Boolean, and so on).
- **Behaviour:** 51 scenarios ran the real button formulas against sample rows (202 assertions passed). Round 2 added: Save keeping another device's ship date, assembly day/order and punch order; a punch-day change still going to the end of the new band; a yellow pill refusing a gauge punched elsewhere (and refreshing); Place, Restore and Reopen refusing a row changed elsewhere, and still working normally; Pair / Unpair messages; the counts leaving out PunchDone jobs. The earlier scenarios cover:
  - housekeeping, the board bands and card order;
  - each pill, including the punched-gauge refusal; Nested, the label save and the ship-move acknowledge;
  - ▲/▼, including pairs, hidden cards and the top no-op;
  - Place; Add with and without a unit; the edit save for imported jobs (key locked) and manual jobs (key rewritten);
  - moving a job to the end of a new band, clearing the line, Pair / merge / Unpair, and the two-tap Dismiss;
  - Find, Reopen and Restore, and the refresh skip while a panel is open.
- **Not testable offline:** the Studio paste itself, U4 layout growth, SharePoint's unique-key error and Choice clearing, real text widths, and SharePoint write failures (rows 1, 2, 5, 6, 13, 14 above).

## Requests for App.Formulas / CONTRACT

No App.Formulas change is needed: scrPunch uses only existing names (`ActiveJobs`, `IncomingJobs`, `PunchBandsOpen`, `PunchBandsAll`, `TodayDate`, `TodayKey`, `gblRefreshTick`, the `clr…` colours) and defines no named formulas. The round 2 review fixes touch rules that other screens share, so these CONTRACT changes are requested. Each one is already done locally in scrPunch as described.

1. **Section 5, allowed reads, item 1.** Allow `LookUp(TheWhiteBoard, ID = id)` explicitly as a *pre-write re-check* (status guard before Place / Restore / Reopen, Done check before un-needing a gauge, merge base for a panel Save), not only as the Patch base. Same delegable, indexed form. *Local:* used in scrPunch as is.
2. **Section 6.1, Need-button guard.** Change the snippet to re-read Done before un-needing, because `ThisItem` can be a refresh cycle old: `If(ThisItem.Need14 && (ThisItem.Done14 || LookUp(TheWhiteBoard, ID = id).Done14), Notify(...); If(!ThisItem.Done14, Refresh(TheWhiteBoard); Set(gblRefreshTick, gblRefreshTick + 1)), <helper>)`, with `id` bound in the outer `With`. scrNesting's Need pills have the same gap. *Local:* scrPunch pills only.
3. **Section 6.3, multi-column panel save.** Add the rule: write a field from the panel only if the user changed it (compare with the copy the panel opened with); otherwise write the row's fresh server value, and keep the order unless the band or cell really changes. Without it, a Save undoes changes made on other devices meanwhile (Assembly ▲▼, Import ship moves). *Local:* scrPunch Save.
4. **Section 6.4, status writes.** Place, Restore and Reopen re-read the row's JobStatus first and refuse (Notify + Refresh + tick bump) if it isn't Incoming / Dismissed / Done. *Local:* done.
5. **Section 6.4, Pair / Unpair.** Have each ForAll step return the row ID or 0, and report `CountIf(res, Value = 0)` failures instead of a success toast. *Local:* done.
6. **Sections 6 and 9 (buttons).** `AutoDisableOnSelect` stays on, but the Classic/Button 2.2.0 template defaults are `DisabledFill = ColorFade(Self.Fill, 70%)` and `DisabledColor = ColorFade(Self.Fill, 90%)`: a light flash on the dark board during every save. Add `DisabledColor: =Self.Color` and `DisabledFill: =ColorFade(Self.Fill, -30%)` to the 9.1 / 9.4 / 9.5 / 9.6 button snippets. scrHome, scrAssembly, scrBending and scrNesting already do this. *Local:* every scrPunch button that makes a server call.
7. **Section 9.8, inputs that can be Disabled.** Classic/DropDown 2.3.1 defaults to `DisabledFill RGBA(242, 242, 242)`, `DisabledColor` / `DisabledBorderColor RGBA(186, 186, 186)` and a light chevron (`ChevronDisabledBackground RGBA(215, 210, 204)`); Classic/DatePicker 2.6.0 keeps `DisabledFill = Self.Fill` but has `DisabledColor RGBA(70, 68, 64)` (dark text on the dark fill). Add `DisabledBorderColor: =clrBorder`, `DisabledColor: =clrMuted`, `DisabledFill: =clrCard` (plus `ChevronDisabledBackground: =clrBorder`, `ChevronDisabledFill: =clrMuted` on drop-downs) to the snippets. *Local:* the four scrPunch edit-panel inputs that can be Disabled.
8. **Section 9.2.** "Show completed" at 14 pt measures about 138–145 px; suggest `LayoutMinWidth` / `Width` 144 instead of 140. *Local:* 144.
9. **Section 9.3 (information for TV, Assembly, Bending).** `"📅 " & ThisItem.ShipText` is about 131 px at 12 pt when ShipText is "NO SHIP DATE", and "✨ NEW" at 12 pt bold about 62 px. Labels narrower than that clip on those cards. *Local:* scrPunch widens the ship label only when ShipDate is blank.

## Review round 2: findings and what was done

Applied (all findings from both reviews were valid; where the proposed fix was changed, the reason is given):

| Review | Finding | Done |
|---|---|---|
| R1 #1 | Notes said "Expected: 0 errors" for 4b–4f | Fixed: "no new errors (only the btnPunImport / scrImport error from 4a remains until Paste 12)" on 4b–4h. |
| R1 #2 | Moved tag clips "📅 moved from 10/12" | Width 136 → 160; the 140 offsets → 164. |
| R1 #3 | Header clipping | Title min 160 → 120, Show completed 130 → 144, counts 280 → **310** (not 300: the Arial-metric estimate for a 3-digit count is up to 320 px; header now 1,356 of 1,366 px). |
| R1 #4 | 4a was 840 lines | `galPunTray` moved to the new Paste 4h (`scrPunch.8.yaml`, into `conPunTray`); 4a is 704 lines. |
| R1 #5 | Wrapped labels too short | `lblPunFiHint` and `lblPunTrayEmpty` 48, `lblPunEdWarn` 46. Same defect also fixed on `lblPunEdMates` (42 → 48), `lblPunFiNone` (48 → 56, 14 pt) and `lblPunPlWarn` (text shortened to fit two lines). |
| R1 #6 | Disabled drop-downs / date pickers use theme colours | Added `DisabledFill` / `DisabledColor` / `DisabledBorderColor`, plus the chevron's disabled colours on the two drop-downs (checked in the templates). |
| R1 #7 | Write buttons flash light while saving | Added `DisabledColor: =Self.Color`, `DisabledFill: =ColorFade(Self.Fill, -30%)` (the other screens' pattern, rather than `Self.Fill`, so a running save is visible) to every listed button, plus `btnPunFind` and `btnPunFiOpen`, which also call the server. |
| R1 #8 | Edit icon colours and tap size | Added `FocusedBorderThickness`, `HoverColor/Fill`, `PressedColor/Fill`, and `DisabledColor`; Width 48 at `Parent.Width - 86` (abuts the pair badge, so the customer keeps 2 px more than at −88); padding 13 keeps the glyph size. Height stays 32 (deliberate). |
| R1 #9 | NO SHIP DATE / NEW clip | NEW 60 → 64, offsets 64 → 68, as proposed. Ship: the proposed 124 px still clips (~131 px by the review's own estimate), so the ship label widens to 138 **only when ShipDate is blank** and the customer moves right on those cards; normal cards keep the full customer width. Same in the tray (120 → 138 when blank). |
| R2 #1 | Save overwrote other devices' changes; spurious reorder | As proposed (fresh re-read, compare with `locPunJob`), and also applied to Machine and Punch day; band and cell changes are now measured against the fresh row. |
| R2 #2 | Counts included finished jobs | As proposed. |
| R2 #3 | Place / Restore / Reopen didn't re-check status | As proposed (Refresh + tick bump on refusal). |
| R2 #4 | Pills could un-need a just-punched gauge | As proposed, plus a Refresh on refusal so the pill turns green. |
| R2 #5 | Pair / Unpair reported success after a failed write | As proposed; the per-row "Pair failed: reason" toast is kept. |

Rejected: none.

## Open issues

- **Not lock-safe (row 12):** the fresh re-reads close the minute-long stale windows but not a sub-second race between two devices.
- **Widths are estimates (row 13):** check the Look check (test 11) in Preview.
- **Unchanged risks:** U4 band-row growth (F1 / F2), pasting 4f/4g inside a nested gallery, the typed blank in OnVisible, Choice clearing (U13), unique-key error text, emoji rendering (U12).
- **Shared-rule gaps on other screens** until the CONTRACT requests above are taken up: scrNesting's Need pills have no fresh Done check; other screens' disabled drop-downs / date pickers and ship labels follow the contract snippets.

## Integration pass (2026-10-02)

- **Ship-move tag** (btnPunMovedS8 in 4f, btnPunMovedS15 in 4g, `OnSelect` only): it now re-reads the job and clears PrevShipDate only when SharePoint's ship date is still the one on the card. If CASMFG moved it again since the last refresh, an amber banner says "CASMFG moved this ship date again. Check the new date on the card, then tap the tag again.", nothing is written and the board refreshes. This is scrAssembly's tested A15 formula with `ThisItem.Job.` read as `ThisItem.` (CONTRACT 6.4). Checked: palint 0/0; all 2,500 scrPunch formulas type-check against the new App.Formulas; 194 scenario asserts pass, plus 8 new asserts (normal acknowledge, and moved again, for S8 and S15).
- **App.Formulas `PunchBandsOpen` / `PunchBandsAll`** no longer stop at 400 days from today (TV request R1). On normal data the bands are unchanged (checked on six sample lists, default and V1 mode). A job whose punch day is more than 400 days away (a mistyped year) now gets its own band, labelled e.g. "12/1/2027", instead of vanishing from the board.
- Manual test, extra step: set a TEST job's PrevShipDate in SharePoint and wait for its amber tag. Change that job's ShipDate in SharePoint and, within 60 s, tap the tag: the banner shows and the tag stays. Tap it again after the refresh: it clears.
