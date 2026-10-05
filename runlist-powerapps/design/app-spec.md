# White Board app: behaviour spec

Source of truth for every screen. Data rules are in `list-design.md`, and that file wins on anything about the list. YAML and control rules are in `yaml-authoring-guide.md`.

## App basics
- Canvas app, **Tablet** format, 1366 × 768, landscape, Scale to fit **On**. Tablets, the TV and PCs all get the same layout, and nothing is responsive.
- One data source: SharePoint list **TheWhiteBoard**. Settings > General > **Data row limit = 2000**.
- Dark theme like the White Board today:
  - Page background `#0f172a`, cards `#1e293b`, card border `#334155`, text `#e5e7eb`, muted text `#94a3b8`.
  - Accent green (done) `#22c55e`. Yellow (needed, not done) `#eab308`. Amber warning `#f59e0b`. Red `#ef4444`. Blue (buttons) `#2563eb`.
  - Screen accents: SB8 `#38bdf8`, SB15 `#a78bfa`, Bending `#14b8a6`.
- Pair badge colours, in this order: `#f59e0b`, `#22d3ee`, `#f472b6`, `#4ade80`, `#a78bfa`, `#facc15`, `#fb7185`, `#60a5fa`.
- Big touch targets on floor screens. Tick buttons are at least 56 px tall.

## Deep links (one bookmark per device)
`App.StartScreen` reads `Param("screen")`:

| Value | Screen |
|---|---|
| punch | scrPunch |
| assembly | scrAssembly |
| nesting | scrNesting |
| sb8 | scrTurret, with SB8 |
| sb15 | scrTurret, with SB15 |
| bending | scrBending |
| tv | scrTV |
| import | scrImport |
| anything else | scrHome |

`scrTurret` picks its machine from `varMachine`. If that's blank, it uses `Param("screen")` (sb15 gives SB15; anything else gives SB8).

## Shared named formulas (App.Formulas)
- `ActiveJobs`: Filter on `JobStatus.Value = "Active"`, with these added local columns:
  - `TurretDone`: at least one gauge is needed, and every needed gauge is done.
  - `PunchDone` = TurretDone && PBDone && P4Done.
  - `GroupShip`: the earliest ShipDate in the job's pair (its own if unpaired).
  - `JobLabel` = JobNumber & If(!IsBlank(FanNumber), "-" & FanNumber).
  - `SizeText` = If(IsBlank(JobSize), "SET SIZE", "Size " & JobSize).
- `IncomingJobs`: Filter on `JobStatus.Value = "Incoming"`.
- Screens never query TheWhiteBoard directly, except a single-row `LookUp(TheWhiteBoard, ID = n)` before a Patch, the Import screen's key lookups, and the Find box.
- Delegation rules are in `list-design.md` (pitfall 1). Any delegation warning on a TheWhiteBoard formula is a bug.

## Writes
Every Patch follows the write helper in `list-design.md` (pitfall 3):
- explicit values
- base record = `LookUp(TheWhiteBoard, ID = id)`
- `IfError`, then Refresh, then retry once, then `Notify` on failure

Each button patches only the columns it owns. Creates set every column explicitly (pitfall 4).

## Ordering
- **Punch band** = Machine + PunchDay, where blank PunchDay is the Unscheduled band. Sort order inside a band: pair group first (GroupOrder = lowest PunchOrder among the pair's members in that band), then PairNo, then PunchOrder, then ID.
- **Assembly cell** = AssemblyLine + AssemblyDate. Same idea, using AssemblyOrder.
- **▲ / ▼** moves the card one place within its band. It writes the midpoint between the two new neighbours: neighbour − 1 at the top, + 1 at the bottom. A paired job moves together with its mates in the same band, keeping their relative order.
- **Placing or moving a job into a band** puts it at the end: band max + 1.

## Screens

### scrHome
Title "The White Board", then large buttons: Punch, Assembly, Nesting, SB8, SB15, Bending, TV, Import. Also a small line showing the signed-in user (`User().FullName`).

### scrPunch (supervisor)
Mirrors `app.js`.
- **Header bar:** title "Punch", buttons Home / Import / Refresh, a "Show completed" toggle, a "Find job #" box, and job counts (Jobs: n, S1..S4).
- **Banner:** if any active job has PrevShipDate, show "CASMFG moved N ship dates" in amber.
- **Incoming tray** (left panel, about 300 px; collapsible). IncomingJobs sorted by ShipDate. Each card shows JobLabel, customer (12 characters), size, ship date and a **Place** button.
  - Place opens the place panel: Machine (default SB8, warn if size is 1 or 4 and SB15 is chosen), Punch day (optional date), and the six gauge toggles (Need12..Need24).
  - Confirm sets JobStatus Active, Machine, PunchDay, Need* and PunchOrder = band max + 1.
- **Board** (the rest of the screen): two columns, SB8 and SB15. Rows are day bands:
  - Unscheduled first, but only if some active job has a blank PunchDay.
  - Then today and the next 5 days, plus every PunchDay that has visible jobs, in date order.
  - Past days show only while they still hold visible jobs.
  - Each band header shows the date (e.g. "Thu Oct 2") and how many jobs it holds.
  - A column shows jobs where !TurretDone, or all jobs when "Show completed" is on.
- **Punch card** (compact, one or two rows):
  - JobLabel, Size n (red "SET SIZE" if blank), 📅 ship m/d, customer (12 characters)
  - the nest label as an editable text box (saves OnChange), and the notes line if any
  - flags: ✨ NEW if Created is today and CasmfgId isn't blank; 📅 moved from m/d if PrevShipDate (tap to acknowledge, which clears PrevShipDate); ⚠ SB15 size rule
  - six gauge pills 12..24: grey = not needed, yellow = needed, green = done. A tap toggles **Need** (supervisor selects gauges); a done gauge can't be un-needed.
  - a **Nested** pill (toggle), ▲ ▼, ✎ edit, and a pair badge (coloured dot with the pair number) if PairNo
- **Edit panel** (overlay):
  - Job # and Unit # (read-only if CasmfgId isn't blank), Fan #, Customer, Model, Size (Auto/1/2/3/4), Ship date, Machine, Punch day, Assembly line, Assembly date, Notes.
  - Pair with job # (type a JobLabel or job #; it sets PairNo = Min(ID) on both), and Unpair.
  - Buttons: Save, Dismiss (sets JobStatus Dismissed after a confirm), Cancel.
  - Add job: same panel, empty. It creates an Active job with Title = the manual key rule.
- **Find job #:** results list across all statuses (indexed JobNumber equality). Each result has Open (edit), Reopen (if Done) and Restore (if Dismissed).
- **Housekeeping:** on OnVisible and every 10 minutes (Timer), set JobStatus Done on PunchDone && Started jobs whose StartedOn is 30 or more days ago.
- **Auto-refresh:** a Timer refreshes TheWhiteBoard every 60 s, but skips while a panel is open.

### scrAssembly (supervisor)
Mirrors `assembly.js`.
- **Header:** title "Assembly", Home / Refresh, and a "Show started" toggle.
- **Unassigned tray** (left): active jobs with blank AssemblyLine or AssemblyDate, sorted by ShipDate. **Assign** opens a panel with Line (1/2/3) and Date (a Mon–Fri date picker; warn on Sat/Sun). It puts the job at the end of the cell. Line-rule warnings show in the panel but don't block:
  - size 4 not on Line 3
  - size 3 on Line 1
  - heavy size 3 (NestLabel TON token 25/30/2530) not on Line 3
  - size 1 on Line 3
- **Grid:** rows are workdays (Mon–Fri) from the earliest AssemblyDate of an unstarted job (or today, whichever is earlier) to the latest AssemblyDate, at least 10 workdays out. There are 3 columns, Line 1 / 2 / 3. Each cell header shows the date and the job count.
- **Card:** JobLabel, Size, 📅 ship, slack (+N workdays between AssemblyDate and ShipDate; red when below 0), status squares (needed gauges green/yellow, BK = PBDone, P4), a **Started** toggle (sets Started and StartedOn = Today(); unticking clears both), ▲ ▼, and ✎ (reassign line/date via the same panel).
- **Visibility:** started jobs whose ShipDate has passed are hidden unless "Show started" is on. Line-rule ⚠ shows on cards that break a rule.

### scrNesting (nester)
- Every active job that isn't TurretDone, in punch order (Machine, then PunchDay with blanks first, then the band sort).
- A toggle **Not nested only** is on by default.
- Each row: JobLabel, machine, punch day, size, ship, the six gauge pills (tap toggles Need), the NestLabel text box, and a big **Nested** toggle.

### scrTurret (SB8 / SB15 operator)
Mirrors `machine.js`.
- **Header:** the machine name in its accent colour, "Turret: check off gauges", a "Show complete" toggle and Home.
- **Jobs:** Machine = varMachine && Nested && (!TurretDone, or show complete).
- **Grouping:** day headers (Unscheduled first, then by PunchDay), and inside each day ordered by GroupShip, then PairNo, then PunchOrder, then ID.
- **Card:** ProductModel (the run string, large), customer, 📅 ship, #JobLabel, pair badge, NestLabel.
  - One big button per **needed** gauge ("14 ga"): yellow = to do, green = done. A tap toggles Done for that gauge only.
  - If no gauges are needed, show "No gauges selected".
- Timer refresh every 30 s.

### scrBending (Brake + P4)
Mirrors `bending.js`.
- **Header:** "Bending", "Brake & P4: punch status shown, mark bending done", toggles **Ready only** and **Show complete**, and Home.
- **Jobs:** all active Nested jobs, hiding PBDone && P4Done unless show complete; Ready only adds TurretDone.
- **Order:** GroupShip, then PairNo, then ShipDate, then ID.
- **Card:**
  - ProductModel, customer, 📅 ship, #JobLabel, pair badge, NestLabel
  - read-only gauge pills (green = punched, yellow = still to punch)
  - two big buttons **✓ PB** and **✓ P4**, green when done; a tap toggles that column only
  - a card that isn't TurretDone is dimmed (about 45% opacity look)
- Timer refresh every 30 s.

### scrTV (read-only wall display)
- The punch board without any buttons. Columns SB-8 and SB-15 by day band (no Unscheduled band), showing active jobs that aren't TurretDone.
- Cards show JobLabel, Size, 📅 ship, customer, gauge pills, the Nested state and the pair badge.
- Big title "The White Board" and a clock.
- Timer refresh every 60 s. No writes anywhere on this screen.

### scrImport (supervisor)
- Explains in one line: "In CASMFG, click the clipboard icon in the top bar, then paste here."
- A large multiline text box and an **Import** button, disabled while running or while the box is empty.
- **Checks before running:**
  - Parse the JSON. If it's invalid, or v isn't 1, show a red message.
  - If `days` < 90, show a red banner: "Narrow pull: ship dates moved more than 16 days out can't be seen. Copy again."
  - If pulledAt is more than 2 hours old, ask for confirmation.
- **Run:** the import rules exactly as in `list-design.md` (status model, IMPORT RUN):
  - key = Upper(Trim(number)) & "|" & Upper(Trim(unit))
  - match against ActiveJobs + IncomingJobs first
  - ship moves (by text compare) on Incoming and on Active-not-Started jobs, using the PrevShipDate rule
  - CasmfgId refresh
  - new jobs within 16 days (or with no valid ship date) after a `LookUp(Title = key)` check: Dismissed goes to the Blocked list with Restore; Done is counted; not found creates an Incoming job with every column explicit; FanNumber = unit; JobSize parsed from the model
  - after a failed create, re-check, then the Failed list with Retry
  - jobs beyond 16 days are watch-only
- **Summary:** added / ship moves / already had / blocked (dismissed) / failed / watch-only. Pasting the same text twice must add 0 and move 0.
- Then a button "Go to Punch".
- **Auto-place** (`btnImpPlace`): runs by itself right after every import, and again when tapped ("Place N tray job(s) on Punch + Assembly"). Every Incoming job with a size (1–4) and a ship date becomes Active with a machine, punch day, line and assembly date. Earliest ship first:
  - **Machine:** size 1 and 4 on SB8, size 2 and 3 on SB15.
  - **Punch day:** 5 workdays before ship. A day holds 5 units on SB8 and 6 on SB15 (size 1 = 1 unit, 2 and 3 = 2, 4 = 3).
  - **Line:** size 1 and 2 on Line 1, 3 on Line 2, 4 (and a heavy 3) on Line 3.
  - **Assembly date:** 3 workdays before ship, and at least 2 workdays after the punch day. A line holds 3 jobs a day (a size 4 counts 1.5).
  - A full day moves the job to the next workday. Workdays are Mon–Fri, today or later; a target already past becomes the first open workday.
  - Each job goes at the end of its day (max order + 1). Gauges are not set: the supervisor still picks them on the Punch card.
  - A job that another device placed or dismissed meanwhile is left alone. A job that can't be saved stays in the tray and is counted in the message ("tap Place again"). Jobs without a size or ship date stay in the tray for a manual Place.
  - One message at the end: the import summary, then "Placed n job(s)…".

## Calls made without the user (keep unless they say otherwise)
- Fan # = unit # on import (still editable).
- Started jobs stay on Assembly until the ship date passes.
- The TV is read-only.
- No print sheets in v1.
- No drag-and-drop: ▲▼ and the edit panel do the moving.
- Auto-place uses the basic rules above, not the old app's planner.
