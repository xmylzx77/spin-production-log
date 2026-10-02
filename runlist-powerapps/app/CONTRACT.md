# White Board: shared build contract

Every screen agent builds from this page. Authority order: `design/list-design.md` (data) > `design/app-spec.md` (behaviour) > `design/yaml-authoring-guide.md` (YAML and controls) > this contract (shared names, styles and snippets). If this page seems to conflict with one of those, the higher file wins: say so in your hand-over, don't improvise. The only exceptions are the settled decisions in section 0.

`Xxx` in the snippets below stands for your 3-letter screen code. Replace it everywhere.

## 0. Settled decisions (build them as written)

Where the higher files leave a gap, or disagree with each other, this page has settled it once. These are not conflicts. Build them as written; only the user can change them.

| # | Topic | What the higher files say | What to build | Where |
|---|---|---|---|---|
| D1 | ▲ / ▼ on a paired job | list-design: "ONE Patch of the moved card"; app-spec: a paired job moves together with its mates | One Patch per tap. ▲ moves the card's unit (a single job, or the whole pair in that band) by patching the unit's lowest-order member. ▼ is ▲ of the unit below. | 6.4, "Move up / down" |
| D2 | Assembly row range | list-design/app-spec: rows start at the earliest AssemblyDate of an **unstarted** job; list-design Q3: started jobs stay until their ship date passes | Rows start at the earliest AssemblyDate of a **shown** job (`AsmShown`), so a started, not-yet-shipped job always has a row. A started job still shows on its ship day and leaves the day after. | 3.4 `AsmShown`, 3.5 `AsmDays` |
| D3 | Turret order tie-break | app-spec: GroupShip, then PairNo, PunchOrder, ID, and "mirrors machine.js" | GroupShip, then `GroupShipMaxKey` (as machine.js), then PairNo, PunchOrder, ID. A clean 7/7 single sorts above a 7/7 + 7/8 pair. | 3.4, 5.1 |
| D4 | Pair badge colour | list-design: "rank among the pairs visible on that board" | One app-wide rank in punch-board order (as app.js `assignPairColors`), so the same pair has the same number and colour on every screen. | 3.4 `PairRank` |
| D5 | Pair badge text | guide 6.2 (Button): `Text(ThisItem.PairNo)` | `Text(ThisItem.PairRank)`; PairNo (a list ID) is never shown. | 3.4 |
| D6 | Overlay tap | guide 7.2: a tap on the overlay closes the panel | The overlay only blocks taps; panels close with Save / Cancel. | 9.7 |
| D7 | Nest label save | app-spec: "saves OnChange"; guide rule 18: in galleries, only Buttons write | Punch: a small ✓ button only (no OnChange). Nesting: OnChange **and** a Save button, sharing one save key so a tap writes once (Nesting notes A2). Both compare trimmed text (6.4). | 6.4 |
| D8 | Re-reads before a write | app-spec: "a single-row LookUp(TheWhiteBoard, ID = n) before a Patch" | Allowed as a **guard** too: a button may re-read its row to refuse a stale write (status, Done gauge, ship date) or to merge a panel save (5, item 1; 6.1; 6.3; 6.4). | 5, 6 |

---

## 1. Screens, codes and paste order

| Screen | Code | Refresh timer | Accent (title colour) |
|---|---|---|---|
| scrHome | `Hom` | none | clrText |
| scrPunch | `Pun` | 60000 ms, skipped while a panel is open | clrText |
| scrImport | `Imp` | none | clrText |
| scrAssembly | `Asm` | 60000 ms, skipped while a panel is open | clrText |
| scrNesting | `Nes` | 30000 ms | clrText |
| scrTurret | `Tur` | 30000 ms | `If(<machine> = "SB15", clrSB15, clrSB8)` |
| scrBending | `Ben` | 30000 ms | clrBending |
| scrTV | `Tv` | 60000 ms | clrText |

**Paste order** (use these numbers in your hand-over header, guide 3.8; a split screen is 4a, 4b, ...):

| Paste | What | From |
|---|---|---|
| 0 | One-time setup: guide section 2 steps 1-7 (Tablet app, Data row limit 2000, TheWhiteBoard connected) | person |
| 1 | App > **OnStart** (fallback below if it isn't in the property list) | `app/App.OnStart.txt` |
| 2 | App > **Formulas** | `app/App.Formulas.txt` |
| 3 | scrHome, then delete Studio's empty `Screen1` (Tree view > right-click > Delete). If Screen1 holds the Paste 1 fallback, delete it right after Paste 4 instead | `app/screens/scrHome.yaml` |
| 4a-4h | scrPunch: 4a new screen, 4b-4c into `conPunEditPanel`, 4d into `conPunPlacePanel`, 4e into `conPunFindPanel`, 4f into `conPunCardS8`, 4g into `conPunCardS15`, 4h into `conPunTray` | `app/screens/scrPunch.1.yaml` ... `scrPunch.8.yaml` |
| 5a-5b | scrImport: 5a new screen, 5b into `conImpResults` | `app/screens/scrImport.1.yaml`, `scrImport.2.yaml` |
| 6a-6c | scrAssembly: 6a new screen, 6b into `conAsmPanel`, 6c into `conAsmCard` | `app/screens/scrAssembly.1.yaml` ... `scrAssembly.3.yaml` |
| 7 | scrNesting | `app/screens/scrNesting.yaml` |
| 8 | scrTurret | `app/screens/scrTurret.yaml` |
| 9 | scrBending | `app/screens/scrBending.yaml` |
| 10a-10b | scrTV: 10a new screen, 10b onto the **screen** scrTV (not into a container) | `app/screens/scrTV.1.yaml`, `scrTV.2.yaml` |
| 11 | App > **StartScreen** | `app/App.StartScreen.txt` |
| 12 | Fix-up pass: App checker (stethoscope) > every "Name isn't recognized" on a screen name: re-enter that formula (guide 3.4). The same formula may also say "The function 'Navigate' has some invalid arguments"; the same re-entry clears both. Expected only on scrHome's screen buttons and scrPunch's Import button. App checker's **Accessibility** section lists "Focus isn't showing" on buttons with `FocusedBorderThickness` 0: that is on purpose (touch screens), ignore it; only the **Formulas** section counts. Then drag scrHome to the top of the Screens list. | person |

The person follows `02-build-the-app.md`, which numbers the same pastes 1 to 22 in this order (Paste 1 = OnStart ... Paste 22 = StartScreen), after a smoke test with the guide's Example 1 (`app/smoke/scrYamlTest.yaml`).

**Paste 1 fallback.** Learn (App object): OnStart "might be disabled by default. If you don't see it ... check the app's Advanced settings for a switch to enable it." Look for that switch first. If there's none, paste the same two lines into **Screen1 > OnVisible** instead, and delete Screen1 only **after Paste 4** (not at Paste 3). Why it works: App.Formulas needs `gblRefreshTick` to exist as a variable, and a `Set` anywhere declares it; once scrPunch (Paste 4) is in, its own `Set(gblRefreshTick, ...)` keeps it declared, and scrHome's SB8/SB15 buttons keep `varMachine` declared. Nothing needs the starting values at run time: `TodayDate` uses `Coalesce(gblRefreshTick, 0)`, blank + 1 is 1 for the first tick, and scrTurret's `Coalesce(varMachine, ...)` treats blank like `""`.

Rules that follow from the order:
- A screen may reference: everything in App.Formulas, the two globals in section 4, `TheWhiteBoard`, its own controls, and `scrHome`. The only other cross-screen references allowed are scrHome's buttons, scrPunch's Import button (`scrImport`) and scrImport's "Go to Punch" button (`scrPunch`).
- Never reference another screen's controls or context variables.
- StartScreen reads only `Param()`. It must never use a named formula or a variable (Learn: a StartScreen that reads a named formula which reads a global variable can race with OnStart).

---

## 2. Names

- Controls: `<prefix><Code><Thing>` (guide 4.4), unique across the whole app, e.g. `galPunSB8`, `btnTurGauge`, `tmrBenRefresh`.
- Context variables (`UpdateContext`): `locPanel` (Text, `""` = no panel open) and `locId` (Number, ID of the job the open panel is about, `0` = none) are the standard pair on every screen that has a panel. Any other context variable is `loc<Code><Thing>` (e.g. `locPunMachine`).
- Global variables: only the two in section 4. Don't create others.
- Collections: only for transient Import data, named `colImp<Thing>` (guide 8.11). Never hold the working set in a collection.

---

## 3. Named formulas (App.Formulas)

### 3.1 Colours

`clrPage` #0f172a, `clrCard` #1e293b, `clrBorder` #334155, `clrText` #e5e7eb, `clrMuted` #94a3b8, `clrGrey` #475569 (not-needed pills, neutral buttons), `clrGreen` #22c55e (done), `clrYellow` #eab308 (needed, not done), `clrAmber` #f59e0b (warning), `clrRed` #ef4444, `clrBlue` #2563eb (action buttons), `clrSB8` #38bdf8, `clrSB15` #a78bfa, `clrBending` #14b8a6, `clrWhite`, `clrOverlay` (black at 55%), `clrNone` (transparent), and `clrPairs` (8-colour single-column table, column `Value`). Never write a `#` colour or `ColorValue` in YAML.

### 3.2 Dates and fixed lists

| Name | Type | Value |
|---|---|---|
| `TodayDate` | Date | today; re-read on every `gblRefreshTick` bump (so a device left on past midnight rolls over) |
| `TodayYmd` | Text | `"yyyy-mm-dd"` of TodayDate |
| `TodayKey` | Number | yyyymmdd of TodayDate, e.g. 20261002 |
| `GaugeList` | table, column `Value` | 12, 14, 16, 18, 20, 24 |
| `MachineList` | table, column `Value` | "SB8", "SB15" |
| `LineList` | table, column `Value` | "Line 1", "Line 2", "Line 3" |
| `PunchWindow` | band table (3.5) | today and the next 5 days |

Use `TodayDate`, `TodayYmd` and `TodayKey` instead of `Today()` in display and filter formulas. Writes use `Today()` (list-design pitfall 5).

### 3.3 Job tables

| Name | Rows | Use it for |
|---|---|---|
| `ActiveJobs` | JobStatus = Active, with every column in 3.4 | every board, station and the TV |
| `IncomingJobs` | JobStatus = Incoming, with the 3.4 columns marked "both" (no pair/group columns) | Punch Incoming tray, Import matching |
| `ActiveBase` | internal step of ActiveJobs | **never use on a screen** |

Both are in-memory tables (wrapped in `With`), so any Filter, Sort, `!`, `IsBlank`, `in` or `CountRows` on them is local and shows no delegation warning. They are not sorted: every gallery sorts (section 5.1).

### 3.4 Columns

List columns (same names and types as the list, list-design "Columns"), in both tables:

| Column | Type | Notes |
|---|---|---|
| ID | Number | |
| Title | Text | the job key; never show it, never patch it on imported rows |
| JobNumber, UnitNumber, FanNumber, JobName, ProductModel, NestLabel, CasmfgId, Notes | Text | blank may arrive as blank or `""`; test with `IsBlank()` |
| JobSize, PairNo, PunchOrder, AssemblyOrder | Number or blank | |
| ShipDate, PrevShipDate, PunchDay, AssemblyDate, StartedOn | Date or blank | compare with the `...Ymd` / `...Key` columns, never `=` on two dates |
| Created | Date/time | |
| JobStatus, Machine, AssemblyLine | Choice record | read `.Value`, or use MachineText / LineText |
| Nested, Need12, Need14, Need16, Need18, Need20, Need24, Done12, Done14, Done16, Done18, Done20, Done24, PBDone, P4Done, Started | Boolean | |

Added columns, in **both** tables:

| Column | Type | Value |
|---|---|---|
| MachineText | Text | "SB8", "SB15" or "" (never blank) |
| LineText | Text | "Line 1", "Line 2", "Line 3" or "" (never blank) |
| MachineOrder | Number | 1 = SB8, 2 = SB15, 3 = none |
| ShipYmd, PunchYmd, AsmYmd | Text | "yyyy-mm-dd", or "" when blank (never blank) |
| ShipKey | Number | yyyymmdd; 99999999 when blank (sorts last) |
| PunchDayKey | Number | yyyymmdd; 0 when blank (Unscheduled sorts first) |
| AsmKey | Number | yyyymmdd; 99999999 when blank |
| PunchSort, AsmSort | Number | PunchOrder / AssemblyOrder, 0 when blank |
| PairKey | Number | PairNo, 999999999 when not paired (unpaired sorts after pairs) |
| TurretDone | Boolean | at least one gauge needed and every needed gauge done (list-design formula) |
| PunchDone | Boolean | TurretDone && PBDone && P4Done |
| NeedCount | Number | how many gauges are needed (0 = "No gauges selected") |
| Gauges | table | 6 rows in order 12..24: `{G: Number, Need: Boolean, Done: Boolean, JobID: Number}`. Only for a gauge gallery on a **flat** list (6.2): `Filter(ThisItem.Gauges, Need)`. JobID is the job's ID (inside an inner gallery ThisItem is the gauge, not the job) |
| JobLabel | Text | JobNumber & "-" & FanNumber (no dash when no fan) |
| SizeText | Text | "Size 3", or "SET SIZE" when JobSize is blank (show it red) |
| CustShort | Text | first 12 characters of JobName |
| ShipText | Text | "m/d", or "NO SHIP DATE" |
| PrevShipText | Text | "m/d" of PrevShipDate, or "" |
| IsNew | Boolean | created today and CasmfgId not blank (the NEW tag) |
| TonToken | Text | TON token from NestLabel ("25" from "25TON"), or "" (never blank). Pattern `(?<t>\d+(?:\.\d+)?)TON`, IgnoreCase: list-design's pattern with the inner group written non-capturing, as in assembly.js; the token matched is the same |
| HeavyTon | Boolean | TonToken is "25", "30" or "2530". The heavy-size-3 rule is `JobSize = 3 && HeavyTon` |
| PunchBand | Text | MachineText & "\|" & PunchYmd, e.g. "SB8\|2026-10-02"; Unscheduled = "SB8\|" |
| AsmBand | Text | LineText & "\|" & AsmYmd, e.g. "Line 2\|2026-10-05" |

Added columns, **ActiveJobs only** (pair group keys, list-design pitfall 11, and AsmShown):

| Column | Type | Value |
|---|---|---|
| GroupShipKey | Number | yyyymmdd of GroupShip; 99999999 when no member has a ship date |
| GroupShipMaxKey | Number | yyyymmdd of the latest ShipDate among the job's active pair members, ignoring blank ones (0 if none has one); own ShipKey if unpaired. Turret tie-break only (section 0, D3) |
| GroupShip | Date or blank | earliest ShipDate among the job's active pair members (own ShipDate if unpaired) |
| PunchGroupOrder | Number | lowest PunchSort among the pair members in the same PunchBand (own PunchSort if unpaired) |
| AsmGroupOrder | Number | lowest AsmSort among the pair members in the same AsmBand (own AsmSort if unpaired) |
| PairRank | Number | 0 if unpaired; else 1, 2, 3... numbering the pairs in punch-board order (SB8 then SB15, Unscheduled then day, PunchOrder). The same pair has the same rank and colour on every screen. This is one app-wide rank, not list-design's "rank among the pairs visible on that board" (section 0, D4) |
| PairColor | Color | `Index(clrPairs, Mod(PairRank - 1, 8) + 1).Value`; clrGrey if unpaired |
| AsmShown | Boolean | Assembly default visibility (list-design Q3): `!Started || ShipKey = 99999999 || ShipKey >= TodayKey`. A started job stays through its ship day and leaves the day after (section 0, D2) |

Decision (section 0, D5): the pair badge shows `Text(ThisItem.PairRank)` (a small number that matches the colour) and is coloured `ThisItem.PairColor`; PairNo itself (a list ID) is never shown.

**Blank text rule.** Never use `Coalesce(x, "")` to get `""`. Learn (Coalesce): "If all the arguments are blank or empty strings, then the function returns blank", and `Blank() <> ""` is true, so a filter like `LineText <> ""` would let blank rows through. Write `x & ""` (blank becomes `""`) or test `IsBlank(x)`. The added Text columns above that say "never blank" are already safe for `= ""` / `<> ""`; the list's own Text columns are not (test them with `IsBlank()`).

### 3.5 Band tables (row sources for outer galleries)

Every band table has the columns `BandYmd` (Text, "yyyy-mm-dd"; `""` = the Unscheduled band), `BandDate` (Date, blank for Unscheduled), `BandKey` (Number yyyymmdd, 0 for Unscheduled), `Label` (Text: "Fri Oct 2", or "Unscheduled") and `IsToday` (Boolean). They are already in display order.

| Name | Rows |
|---|---|
| `PunchBandsOpen` | Punch board bands for jobs that are not TurretDone: Unscheduled (only if such a job has no PunchDay), then today..today+5, plus any other day holding such a job (past days only while they hold one). No distance limit: a day more than 400 days from today (usually a mistyped year) still gets a band, labelled "m/d/yyyy" |
| `PunchBandsAll` | the same rule over every active job (Punch "Show completed" on) |
| `AsmDays` | Assembly rows: Mon-Fri from the earlier of today and the earliest AssemblyDate of a **shown** assigned job (`AsmShown`: unstarted, or started and not yet shipped; section 0, D2), to the later of the latest such AssemblyDate and the 10th workday from today. Also has `IsWeekend` (Boolean): a Sat/Sun row appears only when a shown job is assigned to it |
| `AsmDaysAll` | the same over every assigned job, started and shipped ones included (Assembly "Show started" on) |

"Assigned" means `LineText <> "" && AsmYmd <> ""`. Every other active job is in the Assembly unassigned tray.

Uses:
- Punch board: `If(tglPunShowDone.Value, PunchBandsAll, PunchBandsOpen)`; cards of one column in a band: `Filter(ActiveJobs, PunchBand = "SB8|" & ThisItem.BandYmd && (tglPunShowDone.Value || !TurretDone))`.
- TV: `Filter(PunchBandsOpen, BandKey > 0)` (no Unscheduled band). scrTV builds the same day list locally in `galTvBoard.Items` (from `PunchWindow` plus the used punch days); its output was checked equal to `Filter(PunchBandsOpen, BandKey > 0)`, far-away days included. Leave it as it is.
- Assembly: `If(tglAsmShowStarted.Value, AsmDaysAll, AsmDays)`; cell: `Filter(ActiveJobs, AsmBand = "Line 1|" & ThisItem.BandYmd && (tglAsmShowStarted.Value || AsmShown))`; unassigned tray: `Filter(ActiveJobs, LineText = "" || AsmYmd = "")`.
- Turret has no named band table (the punch bands add empty window days). Outer gallery `Items`, one row per day that holds a visible job, Unscheduled first (`Value` = PunchDayKey, `Label` = the header text):

  ```powerfx
  With({vis: Filter(ActiveJobs, MachineText = locTurMachine && Nested && (tglTurShowDone.Value || !TurretDone))},
      AddColumns(Sort(Distinct(vis, PunchDayKey), Value), Label, If(Value = 0, "Unscheduled", Text(Date(RoundDown(Value / 10000, 0), Mod(RoundDown(Value / 100, 0), 100), Mod(Value, 100)), "ddd mmm d", "en-US"))))
  ```

  As built, scrTurret uses one flat gallery instead (a day header drawn above the first card of each day; scrTurret notes A2), and reads the machine from the hidden label `lblTurMachine` instead of `locTurMachine` (section 4).

  Inner gallery: the same filter plus `&& PunchDayKey = ThisItem.Value`, sorted as 5.1 "Turret".
- Bands are rows of dates only. Counts per column/cell are `CountRows(<that cell's filter>)`, never `AllItemsCount`.

---

## 4. Global variables

| Name | Type | Set by | Meaning |
|---|---|---|---|
| `gblRefreshTick` | Number | App.OnStart sets 0 (or nothing, with the Paste 1 fallback). Every timer, Refresh button and screen OnVisible bumps it right after `Refresh(TheWhiteBoard)` | Part of TodayDate, so `Today()` is re-read on every refresh and a device left on past midnight moves to the new day (see 7.5) |
| `varMachine` | Text | App.OnStart sets "" (or nothing, with the Paste 1 fallback). scrHome's SB8 / SB15 buttons set "SB8" / "SB15" before `Navigate(scrTurret, ...)` | which turret scrTurret shows |

scrTurret resolves its machine with exactly this (app-spec). As built, it is the `Text` of the hidden label `lblTurMachine` (always current, even when Preview starts on scrTurret and OnVisible hasn't run; scrTurret notes A3), and every other control reads `lblTurMachine.Text`:

```powerfx
Coalesce(varMachine, If(Lower(Trim(Param("screen"))) = "sb15", "SB15", "SB8"))
```

---

## 5. Data access

- Galleries, labels and counts read `ActiveJobs`, `IncomingJobs` and the band tables only. The one exception is the Punch Find results gallery (3 below). Never bind anything else to `TheWhiteBoard`.
- The **only** direct `TheWhiteBoard` reads allowed:
  1. `LookUp(TheWhiteBoard, ID = id)`: the Patch base record (section 6), or loading one job into a panel when it isn't in ActiveJobs/IncomingJobs (a Find result that is Done or Dismissed), e.g. `UpdateContext({locPanel: "edit", locId: id, locPunJob: LookUp(TheWhiteBoard, ID = id)})`, or a **pre-write re-check** in the button that writes (section 0, D8): refuse a stale write (Place / Restore / Reopen status, a Done gauge before un-needing, the ship date before clearing PrevShipDate, the job still Active before an Assembly assign) or read the merge base of a panel save (6.3). Same delegable single-row form;
  2. Import: `LookUp(TheWhiteBoard, Title = key)`;
  3. Punch Find box: `Filter(TheWhiteBoard, JobNumber = Trim(txtPunFind.Text))`;
  4. drop-down choices: `Choices(TheWhiteBoard.Machine)` / `Choices(TheWhiteBoard.AssemblyLine)` (column metadata, not rows).
- No delegation warning is expected anywhere (the job tables are in-memory). If Studio shows one, report it as a bug.
- Never: `UpdateIf`, `RemoveIf`, `Remove`, `Collect`/`ClearCollect` of jobs, `gal.Selected` in a child's event, `AllItems`/`AllItemsCount`.
- Machine and line drop-downs (panels only): `Items: =Choices(TheWhiteBoard.Machine)` / `=Choices(TheWhiteBoard.AssemblyLine)` with `Items.Value: =Value` (list-design pitfall 6, guide 6.4), written back as `{Value: dd.Selected.Value}`. `MachineList` / `LineList` are for loops and labels.
- Dates: compare as `...Ymd` text or `...Key` numbers. Show with `Text(d, "m/d")` or the `...Text` columns.
- Blank text: never `Coalesce(x, "")` (3.4, blank text rule); write `x & ""` or `IsBlank(x)`.
- Look up the job behind an open panel with `LookUp(ActiveJobs, ID = locId)` (or `IncomingJobs` for the tray), inside a `With`.

### 5.1 Canonical sort orders (`SortByColumns` takes column names as strings)

| Where | Items |
|---|---|
| Punch band (one machine, one day) | `SortByColumns(<filter>, "PunchGroupOrder", SortOrder.Ascending, "PairKey", SortOrder.Ascending, "PunchSort", SortOrder.Ascending, "ID", SortOrder.Ascending)` |
| TV band | same as Punch band |
| Assembly cell | `"AsmGroupOrder"`, `"PairKey"`, `"AsmSort"`, `"ID"` (all ascending) |
| Turret, inside a day band | `"GroupShipKey"`, `"GroupShipMaxKey"`, `"PairKey"`, `"PunchSort"`, `"ID"` (section 0, D3) |
| Bending (one list) | `"GroupShipKey"`, `"PairKey"`, `"ShipKey"`, `"ID"` |
| Nesting (one list) | `"MachineOrder"`, `"PunchDayKey"`, `"PunchGroupOrder"`, `"PairKey"`, `"PunchSort"`, `"ID"` |
| Incoming tray, Assembly unassigned tray | `"ShipKey"`, `"ID"` |

---

## 6. Writes (list-design pitfall 3 and 4)

Rules: work out every value first inside `With`; base record is always `LookUp(TheWhiteBoard, ID = id)`; `IfError`, then `Refresh`, then retry once, then `Notify(..., NotificationType.Error, 0)`; patch only the columns the button owns; writes come from `Classic/Button` `OnSelect` (keep `AutoDisableOnSelect` at its default, true, so a double tap can't double-write). Every write formula goes in a `|-` block (it contains `{`, `:`).

- **Busy colours.** Because `AutoDisableOnSelect` is on, every button is drawn disabled while its OnSelect runs. Give every button that calls the server `DisabledColor: =Self.Color` and `DisabledFill: =ColorFade(Self.Fill, -30%)` (the template defaults flash a pale box on the dark UI). scrImport uses `clrMuted` + a darker blue on its own buttons; that is fine.
- **Reads that decide a write in a bulk loop** (Import): test the read with `IsError()` and record a failure instead of dropping the row; a re-check where "not found" is the safe answer may use `IfError(LookUp(...), Blank())`.
- A button may wrap a Patch as `With({saved: Patch(...)}, ...)` to read the saved row (scrBending's "finished" banner). A failed Patch makes the whole `With` an error, so the surrounding `IfError` still runs the retry.

### 6.1 Single-column toggle (a button in a gallery)

```powerfx
With({id: ThisItem.ID, v: !ThisItem.PBDone},
    IfError(
        Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {PBDone: v}),
        Refresh(TheWhiteBoard);
        IfError(
            Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {PBDone: v}),
            Notify("Save failed: " & FirstError.Message, NotificationType.Error, 0),
            true
        ),
        true
    )
)
```

**Studio rule (found in Studio, 2026-10-02):** an `IfError` whose value is a record (a `Patch`) and whose fallback is a Boolean (`Notify`, `UpdateContext`, another `IfError`) must end with a DefaultResult of the same type as the fallback (`true`). Without it, Studio reports "Invalid argument type (Boolean). Expecting a Record value instead". Every write helper in the screens now has it.

Change only `ThisItem.PBDone` and `{PBDone: v}` (e.g. `Nested`, `Need14`, `Done14`, `P4Done`). A Need button must refuse to un-need a done gauge (app-spec). The card can be a refresh cycle old, so re-read Done before un-needing (`&&` and `||` stop early, so a grey pill makes no extra read):

```powerfx
With({id: ThisItem.ID, v: !ThisItem.Need14},
    If(
        ThisItem.Need14 && (ThisItem.Done14 || LookUp(TheWhiteBoard, ID = id).Done14),
        Notify("14 ga is already punched, so it stays selected", NotificationType.Warning);
        If(!ThisItem.Done14, Refresh(TheWhiteBoard); Set(gblRefreshTick, gblRefreshTick + 1)),
        <the helper above on {Need14: v}>
    )
)
```

scrPunch and scrNesting build their Need pills this way.

### 6.2 Gauge buttons

**Banded screens (Punch, TV, Assembly, Turret): six fixed buttons, never a gauge gallery.** Their cards already sit in an inner gallery (day bands > cards), so a gauge gallery would be a third level, which the guide forbids (6.11, "at most 2 levels"). Write one button per gauge (`btnXxxG12` ... `btnXxxG24`), each with its own 6.1 `OnSelect` on its own column (`Done16` on Turret, `Need16` on Punch). Where all six always show (Punch, TV), use 9.4's `X: =<left> + n * 46`. Where only **needed** gauges show (Turret buttons, Assembly squares), pack them left: `Visible` is the gauge's Need, and `X` counts the needed gauges before it. Turret 16 ga (9.5 style, yellow = to do, green = done):

```yaml
- btnTurG16:
    Control: Classic/Button@2.2.0
    Properties:
      BorderThickness: =0
      Color: =clrPage
      Fill: =If(ThisItem.Done16, clrGreen, clrYellow)
      FocusedBorderThickness: =0
      FontWeight: =FontWeight.Bold
      Height: =56
      HoverColor: =Self.Color
      HoverFill: =ColorFade(Self.Fill, -10%)
      OnSelect: |-
        =With({id: ThisItem.ID, v: !ThisItem.Done16},
            IfError(
                Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {Done16: v}),
                Refresh(TheWhiteBoard);
                IfError(
                    Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {Done16: v}),
                    Notify("Save failed: " & FirstError.Message, NotificationType.Error, 0)
                )
            )
        )
      PressedColor: =Self.Color
      PressedFill: =ColorFade(Self.Fill, -25%)
      RadiusBottomLeft: =10
      RadiusBottomRight: =10
      RadiusTopLeft: =10
      RadiusTopRight: =10
      Size: =18
      Text: ="16 ga"
      Visible: =ThisItem.Need16
      Width: =120
      X: =14 + (If(ThisItem.Need12, 1, 0) + If(ThisItem.Need14, 1, 0)) * 140
      Y: =Parent.Height - Self.Height - 12
```

12 ga: `X: =14`; 24 ga counts Need12..Need20. The left offset and Y are the card's choice; keep the pitch (Width + gap) and the counting. The "No gauges selected" label: `Visible: =ThisItem.NeedCount = 0`.

**Flat lists only (Nesting, Bending):** a card may instead hold an inner gallery over `Filter(ThisItem.Gauges, Need)` (a second level, allowed). Its button writes the gauge chosen by number:

```powerfx
With({id: ThisItem.JobID, g: ThisItem.G, v: !ThisItem.Done},
    IfError(
        Switch(g,
            12, Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {Done12: v}),
            14, Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {Done14: v}),
            16, Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {Done16: v}),
            18, Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {Done18: v}),
            20, Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {Done20: v}),
            24, Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {Done24: v})
        ),
        Refresh(TheWhiteBoard);
        IfError(
            Switch(g,
                12, Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {Done12: v}),
                14, Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {Done14: v}),
                16, Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {Done16: v}),
                18, Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {Done18: v}),
                20, Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {Done20: v}),
                24, Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {Done24: v})
            ),
            Notify("Save failed: " & FirstError.Message, NotificationType.Error, 0)
        )
    )
)
```

For Need toggles use `Need12`..`Need24` and `v: !ThisItem.Need`, wrapped as `If(ThisItem.Need && ThisItem.Done, Notify(ThisItem.G & " ga is already punched", NotificationType.Warning), <helper>)`. Never build the change record with `Switch` (a merged record would write blanks into the other columns): one `Patch` per branch, as above.

### 6.3 Multi-column save from a panel (closes the panel only on success)

```powerfx
With(
    {
        id: locId,
        changes: {
            FanNumber: Trim(txtXxxFan.Text),
            Machine: {Value: ddXxxMachine.Selected.Value},
            PunchDay: dpXxxPunchDay.SelectedDate,
            Notes: txtXxxNotes.Text
        }
    },
    IfError(
        Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), changes),
        Refresh(TheWhiteBoard);
        IfError(
            Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), changes),
            Notify("Save failed: " & FirstError.Message, NotificationType.Error, 0),
            UpdateContext({locPanel: "", locId: 0})
        ),
        UpdateContext({locPanel: "", locId: 0})
    )
)
```

**Don't undo other devices.** A panel can stay open for minutes while the screen doesn't refresh. Write a field from the panel only if the user changed it (compare with the copy the panel opened with); for every field left alone, write the row's value from one fresh `LookUp(TheWhiteBoard, ID = id)` taken at Save time, and keep the order value unless the band or cell really changes (then band max + 1, worked out **after** a `Refresh(TheWhiteBoard)` and tick bump). scrPunch's edit Save and scrAssembly's Assign / Move here do this.

The third argument of each `IfError` runs only when there was no error (Learn: DefaultResult). All of section 6 was run offline in the Power Fx 1.8 interpreter against sample rows; there, a base record that no longer exists (row deleted by an Owner) writes nothing. Value shapes: Choice `{Value: "SB8"}`; clear with `Blank()` (Choice clear is U13); Yes/No `true`/`false`; Number `Value(txt.Text)` or `Blank()`; Date `dp.SelectedDate`, `Today()` or `Blank()`; Text `"..."`.

### 6.4 Record shapes for the other writes (each through 6.1 or 6.3, except Move up / down)

| Action | Change record |
|---|---|
| Place (Incoming tray) | `{JobStatus: {Value: "Active"}, Machine: {Value: m}, PunchDay: d, PunchOrder: <band max + 1>, Need12: ..., Need14: ..., Need16: ..., Need18: ..., Need20: ..., Need24: ...}`, only if a fresh `LookUp(TheWhiteBoard, ID = id)` is still Incoming; otherwise Notify, Refresh, tick bump, no write |
| Nest label (✓ button, or text box OnChange) | `{NestLabel: Trim(<box>.Text)}`, only `If(Trim(<box>.Text) <> Trim(ThisItem.NestLabel & ""), <helper>)` so a data refresh never writes (not `Coalesce(..., "")`: that is blank when NestLabel is empty, and `"" <> Blank()` is true, so it would write). If a screen has both OnChange and a Save button, they share one save key so a tap writes once (section 0, D7) |
| Ship move acknowledged | `{PrevShipDate: Blank()}`, only if a fresh `LookUp(TheWhiteBoard, ID = id)` still has the ship date the card shows (`Text(ShipDate, "yyyy-mm-dd") = ThisItem.ShipYmd`); otherwise Notify "CASMFG moved this ship date again", Refresh, tick bump, no write |
| Started tick | on: `{Started: true, StartedOn: If(cur.Started && !IsBlank(cur.StartedOn), cur.StartedOn, Today())}` with `cur` = a fresh `LookUp(TheWhiteBoard, ID = id)` (a stale tap keeps the existing date, so the 30-day housekeeping clock isn't restarted); off: `{Started: false, StartedOn: Blank()}` |
| Dismiss (after confirm) | `{JobStatus: {Value: "Dismissed"}}` |
| Reopen (Find, Done row) | `{JobStatus: {Value: "Active"}, Started: false, StartedOn: Blank()}`, only if the fresh row is still Done |
| Restore (Dismissed row) | `{JobStatus: {Value: "Incoming"}}`, only if the fresh row is still Dismissed |
| Housekeeping (Punch only) | `{JobStatus: {Value: "Done"}}` for each row of `Filter(ActiveJobs, PunchDone && Started && !IsBlank(StartedOn) && DateDiff(StartedOn, TodayDate, TimeUnit.Days) >= 30)`; snapshot that filter in a `With` before the `ForAll` |
| Pair | `{PairNo: <Min(ID) of the selected jobs>}` on each; Unpair `{PairNo: Blank()}`. Each ForAll step returns the row ID or 0, and the button reports `CountIf(res, Value = 0)` failures ("Tap Pair again") instead of a success message |
| Assign / move (Assembly) | `{AssemblyLine: {Value: ln}, AssemblyDate: d, AssemblyOrder: <cell max + 1>}` |
| Move up / down | the move snippet below (one Patch of `{PunchOrder: v}` or `{AssemblyOrder: v}`, midpoint rule; section 0, D1) |

Band max + 1 (only when the job enters a new band; the job itself is not yet in that band):

```powerfx
Coalesce(Max(Filter(ActiveJobs, PunchBand = m & "|" & If(IsBlank(d), "", Text(d, "yyyy-mm-dd"))), PunchSort), 0) + 1
```

Assembly: the same with `AsmBand = ln & "|" & Text(d, "yyyy-mm-dd")` and `AsmSort`.

**Move up / down (▲ ▼; section 0, D1).** Every tap is exactly one Patch. A *unit* is a single job, or all of a pair's members in this band. ▲ moves the card's unit up one place by patching the unit's lowest-order member to the midpoint of the two units above it (`above - 1` when it becomes the top). ▼ is done as ▲ of the unit below. Top ▲ and bottom ▼ do nothing. Punch ▲ (`OnSelect`, a `|-` block; on ▼ change only `dir: "up"` to `dir: "down"`):

```powerfx
With({c: ThisItem, dir: "up"},
With({vis: SortByColumns(Filter(ActiveJobs, PunchBand = c.PunchBand && (tglPunShowDone.Value || !TurretDone)), "PunchGroupOrder", SortOrder.Ascending, "PairKey", SortOrder.Ascending, "PunchSort", SortOrder.Ascending, "ID", SortOrder.Ascending)},
With({units: Filter(vis As r, IsBlank(r.PairNo) || r.ID = First(Filter(vis, PairNo = r.PairNo)).ID)},
With({num: ForAll(Sequence(CountRows(units)) As s, {i: s.Value, pn: Index(units, s.Value).PairNo, uid: Index(units, s.Value).ID, go: Index(units, s.Value).PunchGroupOrder})},
With({my: LookUp(num, If(IsBlank(c.PairNo), uid = c.ID, pn = c.PairNo))},
With({mover: If(dir = "up", my, LookUp(num, i = my.i + 1)),
      above: If(dir = "up", LookUp(num, i = my.i - 1), my),
      above2: If(dir = "up", LookUp(num, i = my.i - 2), LookUp(num, i = my.i - 1))},
If(!IsBlank(mover) && !IsBlank(above),
    With({id: First(SortByColumns(Filter(ActiveJobs, PunchBand = c.PunchBand && If(IsBlank(mover.pn), ID = mover.uid, PairNo = mover.pn)), "PunchSort", SortOrder.Ascending, "ID", SortOrder.Ascending)).ID,
          v: If(IsBlank(above2), above.go - 1, (above2.go + above.go) / 2)},
        IfError(
            Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {PunchOrder: v}),
            Refresh(TheWhiteBoard);
            IfError(
                Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {PunchOrder: v}),
                Notify("Move failed: " & FirstError.Message, NotificationType.Error, 0)
            )
        )
    )
)))))))
```

- The `vis` filter must be exactly the filter of the gallery the button sits in (3.5 "Uses"), or the move counts hidden cards as neighbours. The pair member that gets patched may be hidden (e.g. TurretDone); that is intended, because it holds the pair's group order.
- Assembly: replace `PunchBand` with `AsmBand`, `PunchGroupOrder` with `AsmGroupOrder`, `PunchSort` with `AsmSort`, `{PunchOrder: v}` with `{AssemblyOrder: v}` (both Patches), and the visibility term with the Assembly cell's `(tglAsmShowStarted.Value || AsmShown)`.
- Ties: when the two units the mover goes between have the same group order, the midpoint equals it and the move may show no change. list-design's optional "Renumber band" button (rewrite the band to 1..n) clears ties.
- Checked offline (Power Fx 1.8 interpreter, default and V1 mode, real Patches), Punch and the Assembly variant: single up, top no-op, pair up with a hidden member, single down, pair down, and a move past a hidden started job all gave the expected order.

### 6.5 Creates (every column explicit; pitfall 4)

Job key, the one expression everywhere (pitfall 8): `Upper(Trim(<job #>)) & "|" & Upper(Trim(<unit #>))`. A manual job with no unit #: `Upper(Trim(<job #>)) & "|M" & Text(Now(), "yymmddhhmmss")`.

Import (new Incoming job). The Import agent computes `key`, `ship` (Date or `Blank()`, list-design ShipDate rule) and `size` (list-design JobSize parse) first:

```powerfx
Patch(TheWhiteBoard, Defaults(TheWhiteBoard), {
    Title: key,
    JobNumber: Trim(num), UnitNumber: Trim(unit), FanNumber: Trim(unit),
    JobName: name, ProductModel: model, CasmfgId: casmfgId,
    JobSize: size, ShipDate: ship,
    JobStatus: {Value: "Incoming"},
    Nested: false,
    Need12: false, Need14: false, Need16: false, Need18: false, Need20: false, Need24: false,
    Done12: false, Done14: false, Done16: false, Done18: false, Done20: false, Done24: false,
    PBDone: false, P4Done: false, Started: false
})
```

Manual Add (new Active job, Punch edit panel in "add" mode): same 16 Yes/No as `false` (or the panel's Need choices) plus `Title: key`, `JobNumber`, `UnitNumber`, `FanNumber`, `JobName`, `ProductModel`, `JobSize`, `ShipDate`, `Notes`, `JobStatus: {Value: "Active"}`, `Machine: {Value: m}`, `PunchDay: d`, `PunchOrder: <band max + 1>`, and `AssemblyLine`/`AssemblyDate` only if chosen. Leave CasmfgId out (blank = manual job). Columns left out of a create (Machine, AssemblyLine, the dates, PairNo, the orders, NestLabel, Notes, CasmfgId) have no SharePoint default, so they start blank.

Creates are not retried blindly: on error, re-check with `LookUp(TheWhiteBoard, Title = key)` (Import: count as "already had"; manual Add: "already in the list as " & status), else `Notify` / Failed list.

---

## 7. Refresh

### 7.1 Timer (one per data screen, anywhere in the screen's Children)

Screens with a panel (Punch, Assembly):

```yaml
- tmrXxxRefresh:
    Control: Timer@2.1.0
    Properties:
      AutoPause: =true
      AutoStart: =true
      Duration: =60000
      OnTimerEnd: |-
        =If(IsBlank(locPanel), Refresh(TheWhiteBoard); Set(gblRefreshTick, gblRefreshTick + 1))
      Repeat: =true
      Visible: =false
```

Screens without a panel (Nesting, Turret, Bending: 30000; TV: 60000): the same with `OnTimerEnd` = `=Refresh(TheWhiteBoard); Set(gblRefreshTick, gblRefreshTick + 1)` inside a `|-` block.

Allowed variant (scrNesting): a screen with a text box in its gallery may skip a set number of timer cycles after the box is tapped (`locNesHold`), so a refresh doesn't wipe half-typed text. Saving ends the pause. The Refresh button always refreshes.

### 7.2 Refresh button and screen OnVisible

Refresh button `OnSelect`, and the start of every data screen's `OnVisible` (all screens except scrHome):

```powerfx
Refresh(TheWhiteBoard);
Set(gblRefreshTick, gblRefreshTick + 1)
```

Screens with a panel put `UpdateContext({locPanel: "", locId: 0});` first in OnVisible. Punch then runs housekeeping (app-spec).

### 7.3 Clock (TV)

`Now()` in a label only changes when its formula recalculates (Learn, volatile functions). Tie it to the refresh: `Text(DateAdd(Now(), 0 * gblRefreshTick, TimeUnit.Minutes), "h:mm AM/PM")` in a `|-` block (it has a colon). It moves once per refresh.

### 7.4 Never

Refresh in a value property, a timer under 30000 ms, or `Refresh` without the tick bump (except the retry inside the write helper, which needs no bump).

### 7.5 Why the tick (U9) and how it's tested

Named formulas recalculate when TheWhiteBoard changes, so a Patch or Refresh updates every screen (list-design). `Refresh(TheWhiteBoard)` is the documented way to pick up *other* users' changes; whether it re-runs the named formulas every time is unconfirmed (guide U9). The tick's own job is the midnight rollover: `TodayDate` reads `gblRefreshTick`, so bumping it makes `TodayDate` re-read `Today()`. Don't rely on the tick to force a data recalculation: on a normal day `TodayDate` doesn't change value, and it isn't proven that the engine recalculates the job tables when a dependency is re-evaluated to the same value. Go-live test (list-design step 20 (4)) is the gate: tick on tablet A, watch tablet B within one timer cycle. If B never updates, report it; don't add collections.

---

## 8. Navigation

- Always `Navigate(scrX, ScreenTransition.None)`. Never `Back()` (deep-linked devices have no history).
- Every screen except scrHome has a Home button (9.1 header, last child) with `OnSelect: =Navigate(scrHome, ScreenTransition.None)`.
- scrHome: Punch, Assembly, Nesting, Bending, TV, Import go straight to their screen. SB8: `Set(varMachine, "SB8"); Navigate(scrTurret, ScreenTransition.None)`; SB15 the same with "SB15".
- scrPunch header "Import" button: `Navigate(scrImport, ScreenTransition.None)`. scrImport "Go to Punch": `Navigate(scrPunch, ScreenTransition.None)`.

---

## 9. Look and layout

Canvas 1366 x 768, absolute positions (guide 7.1). Header 0..64, body 64..768. Every screen: `Fill: =clrPage`. Font: never write `Font` on any control; every control keeps the app's default font, so all screens match. Only `Size` and `FontWeight` vary (9.3).

### 9.1 Header bar (every screen; scrHome has no Home button)

```yaml
- conXxxHeader:
    Control: GroupContainer@1.5.0
    Variant: AutoLayout
    Properties:
      BorderThickness: =0
      DropShadow: =DropShadow.None
      Fill: =clrCard
      Height: =64
      LayoutAlignItems: =LayoutAlignItems.Center
      LayoutDirection: =LayoutDirection.Horizontal
      LayoutGap: =12
      LayoutJustifyContent: =LayoutJustifyContent.Start
      PaddingLeft: =16
      PaddingRight: =16
      Width: =1366
      X: =0
      Y: =0
    Children:
      - lblXxxTitle:
          Control: Label@2.5.1
          Properties:
            Color: =clrText
            FillPortions: =1
            FontWeight: =FontWeight.Bold
            Height: =44
            LayoutMinWidth: =160
            PaddingLeft: =0
            Size: =22
            Text: ="Title"
            Wrap: =false
      - btnXxxRefresh:
          Control: Classic/Button@2.2.0
          Properties:
            BorderThickness: =0
            Color: =clrWhite
            Fill: =clrBlue
            FillPortions: =0
            FocusedBorderThickness: =0
            FontWeight: =FontWeight.Semibold
            Height: =44
            HoverColor: =Self.Color
            HoverFill: =ColorFade(Self.Fill, -15%)
            LayoutMinWidth: =110
            DisabledColor: =Self.Color
            DisabledFill: =ColorFade(Self.Fill, -30%)
            OnSelect: |-
              =Refresh(TheWhiteBoard);
              Set(gblRefreshTick, gblRefreshTick + 1)
            PressedColor: =Self.Color
            PressedFill: =ColorFade(Self.Fill, -30%)
            RadiusBottomLeft: =8
            RadiusBottomRight: =8
            RadiusTopLeft: =8
            RadiusTopRight: =8
            Size: =15
            Text: ="Refresh"
            Width: =110
      - btnXxxHome:
          Control: Classic/Button@2.2.0
          Properties:
            BorderThickness: =0
            Color: =clrWhite
            Fill: =clrGrey
            FillPortions: =0
            FocusedBorderThickness: =0
            FontWeight: =FontWeight.Semibold
            Height: =44
            HoverColor: =Self.Color
            HoverFill: =ColorFade(Self.Fill, -15%)
            LayoutMinWidth: =100
            OnSelect: =Navigate(scrHome, ScreenTransition.None)
            PressedColor: =Self.Color
            PressedFill: =ColorFade(Self.Fill, -30%)
            RadiusBottomLeft: =8
            RadiusBottomRight: =8
            RadiusTopLeft: =8
            RadiusTopRight: =8
            Size: =15
            Text: ="Home"
            Width: =100
```

- Children order = left to right: title (stretches), then the screen's own items (toggles, find box, counts, action buttons), then Refresh (if any), then **Home last**.
- Every header child: `FillPortions: =0` with `Width` = `LayoutMinWidth`, Height 44 (toggles 36). Only the title stretches.
- Action buttons (Refresh, Import, Add job): as btnXxxRefresh (clrBlue). Neutral buttons (Home, Cancel): clrGrey.
- Every button that calls the server (Refresh, every write) also sets `DisabledColor: =Self.Color` and `DisabledFill: =ColorFade(Self.Fill, -30%)` (section 6, busy colours).
- `FocusedBorderThickness: =0` on touch buttons makes App checker's **Accessibility** section list "Focus isn't showing". That is expected; only the **Formulas** section counts as errors.

### 9.2 Header toggle with its label

```yaml
- tglXxxShowDone:
    Control: Classic/Toggle@2.1.0
    Properties:
      Default: =false
      FalseFill: =clrGrey
      FalseHoverFill: =clrGrey
      FillPortions: =0
      FocusedBorderThickness: =0
      HandleFill: =clrText
      Height: =36
      LayoutMinWidth: =64
      ShowLabel: =false
      TrueFill: =clrGreen
      TrueHoverFill: =clrGreen
      Width: =64
- lblXxxShowDone:
    Control: Label@2.5.1
    Properties:
      Color: =clrText
      FillPortions: =0
      Height: =44
      LayoutMinWidth: =150
      PaddingLeft: =0
      Size: =14
      Text: ="Show completed"
      Width: =150
      Wrap: =false
```

Toggles only filter (`tglXxx.Value`); they never write.

- 14-pt "Show completed" needs about 138-145 px, so 140 can clip: use 150 (or 144 with `PaddingRight: =0`, as scrPunch does to fit its full header).
- A toggle may also set `AccessibleLabel` to its label's text (scrBending), so App checker doesn't flag it.

### 9.3 Galleries and cards

```yaml
- galXxxJobs:
    Control: Gallery@2.15.0
    Variant: Vertical
    Properties:
      BorderThickness: =0
      DelayItemLoading: =false
      Fill: =clrNone
      Height: =688
      Items: |-
        =SortByColumns(Filter(ActiveJobs, Nested), "GroupShipKey", SortOrder.Ascending, "PairKey", SortOrder.Ascending, "ShipKey", SortOrder.Ascending, "ID", SortOrder.Ascending)
      LoadingSpinner: =LoadingSpinner.None
      ShowScrollbar: =true
      TemplatePadding: =0
      TemplateSize: =120
      Width: =1350
      X: =8
      Y: =72
    Children:
      - conXxxCard:
          Control: GroupContainer@1.5.0
          Variant: ManualLayout
          Properties:
            BorderColor: =clrBorder
            BorderThickness: =1
            DropShadow: =DropShadow.None
            Fill: =clrCard
            Height: =Parent.TemplateHeight - 8
            RadiusBottomLeft: =8
            RadiusBottomRight: =8
            RadiusTopLeft: =8
            RadiusTopRight: =8
            Width: =Parent.TemplateWidth
            X: =0
            Y: =4
          Children:
            - lblXxxJob:
                Control: Label@2.5.1
                Properties:
                  Color: =clrText
                  FontWeight: =FontWeight.Bold
                  Height: =32
                  PaddingLeft: =0
                  Size: =16
                  Text: =ThisItem.JobLabel
                  Wrap: =false
                  Width: =160
                  X: =14
                  Y: =6
```

- The card container is the gallery's first child; everything else sits inside it (guide 6.11). At most a gallery inside a gallery.
- Text: job label 16 bold clrText; secondary text 13 clrMuted; floor-screen title (ProductModel) 22 bold. "SET SIZE" and "NO SHIP DATE" in clrRed. Customer is `ThisItem.CustShort`. Ship is `"📅 " & ThisItem.ShipText` (a `|-` block).
- Dimmed card (Bending, not TurretDone): text `clrMuted` instead of clrText, pill fills `ColorFade(<fill>, -50%)`. Text **on** a faded fill (pill numbers, pair badge) is `clrText`, not clrPage: dark text on a 50%-faded colour has 2.2:1 to 3.2:1 contrast.
- Galleries also set `FocusedBorderThickness: =0` (template default 4).
- `"📅 " & ThisItem.ShipText` is about 131-133 px at 12-13 pt when there is no ship date ("📅 NO SHIP DATE"). On narrow labels either widen the label only when `IsBlank(ShipDate)` (scrPunch), drop the emoji for the blank case (`If(IsBlank(ShipDate), "NO SHIP DATE", "📅 " & ShipText)`, scrNesting), or draw it at a smaller Size (scrAssembly).

### 9.4 Gauge pills (compact, cards on Punch / Nesting / TV / Bending / Assembly)

```yaml
- btnXxxG14:
    Control: Classic/Button@2.2.0
    Properties:
      BorderThickness: =0
      Color: =If(ThisItem.Need14, clrPage, clrText)
      Fill: =If(ThisItem.Need14 && ThisItem.Done14, clrGreen, ThisItem.Need14, clrYellow, clrGrey)
      FocusedBorderThickness: =0
      FontWeight: =FontWeight.Bold
      Height: =28
      HoverColor: =Self.Color
      HoverFill: =ColorFade(Self.Fill, -10%)
      PaddingLeft: =0
      PaddingRight: =0
      PressedColor: =Self.Color
      PressedFill: =ColorFade(Self.Fill, -25%)
      RadiusBottomLeft: =14
      RadiusBottomRight: =14
      RadiusTopLeft: =14
      RadiusTopRight: =14
      Size: =12
      Text: ="14"
      Width: =40
      X: =14 + 1 * 46
      Y: =40
```

- Colours: grey = not needed, yellow = needed, green = done. Six fixed pills at `X: =<left> + n * 46` (n = 0..5 for 12..24), ManualLayout (guide U5). Never a gauge gallery on a banded screen (6.2).
- Tappable pills (Punch, Nesting) get `OnSelect` = 6.1 on `Need14`. Read-only pills (TV, Bending, Assembly) have no `OnSelect` and `HoverFill: =Self.Fill`, `PressedFill: =Self.Fill`.
- Bending pills show needed gauges only (green = punched, yellow = to punch); Assembly squares are needed gauges + "BK" (PBDone) + "P4". Needed-only rows pack left with 6.2's `Visible` / `X` pattern (pitch 46 here); Assembly's BK and P4 follow at `X: =<left> + ThisItem.NeedCount * 46` and `+ (ThisItem.NeedCount + 1) * 46`.
- As built, Assembly's squares are read-only **Labels 27 px wide at a 30 px pitch**: up to 8 squares (6 gauges + BK + P4) must fit a 346 px card, and 8 x 46 = 368 px doesn't. Nesting's tappable pills are 44 x 40 at a 50 px pitch (bigger touch targets); TV's are pitch 48. Same colours everywhere.

### 9.5 Tick buttons (floor screens: Turret gauges, PB / P4, Nested, Started)

```yaml
- btnXxxPB:
    Control: Classic/Button@2.2.0
    Properties:
      BorderThickness: =0
      Color: =If(ThisItem.PBDone, clrPage, clrText)
      Fill: =If(ThisItem.PBDone, clrGreen, clrGrey)
      FocusedBorderThickness: =0
      FontWeight: =FontWeight.Bold
      Height: =56
      HoverColor: =Self.Color
      HoverFill: =ColorFade(Self.Fill, -10%)
      PressedColor: =Self.Color
      PressedFill: =ColorFade(Self.Fill, -25%)
      RadiusBottomLeft: =10
      RadiusBottomRight: =10
      RadiusTopLeft: =10
      RadiusTopRight: =10
      Size: =18
      Text: |-
        ="✓ PB"
      Width: =120
      X: =14
      Y: =(Parent.Height - Self.Height) / 2
```

- Height at least 56. Done = clrGreen with clrPage text. Not done = clrGrey with clrText text, except Turret gauge buttons, which are clrYellow with clrPage text when to do (app-spec).
- `OnSelect` is 6.1. Turret gauge buttons are the six fixed, packed buttons of 6.2 (Turret cards sit in day bands, so no gauge gallery).

### 9.6 Pair badge

```yaml
- btnXxxPair:
    Control: Classic/Button@2.2.0
    Properties:
      BorderThickness: =0
      Color: =clrPage
      Fill: =ThisItem.PairColor
      FocusedBorderThickness: =0
      FontWeight: =FontWeight.Bold
      Height: =28
      HoverColor: =Self.Color
      HoverFill: =Self.Fill
      PaddingLeft: =0
      PaddingRight: =0
      PressedColor: =Self.Color
      PressedFill: =Self.Fill
      RadiusBottomLeft: =14
      RadiusBottomRight: =14
      RadiusTopLeft: =14
      RadiusTopRight: =14
      Size: =12
      Text: =Text(ThisItem.PairRank)
      Visible: =!IsBlank(ThisItem.PairNo)
      Width: =28
      X: =Parent.Width - Self.Width - 10
      Y: =6
```

### 9.7 Panels, overlay and z-order

Children order in a screen = back to front: header, body (trays, galleries), timers, then for each panel an overlay rectangle immediately followed by its panel container. Panels and their overlays are always the **last** children.

```yaml
- recXxxOverlay:
    Control: Rectangle@2.3.0
    Properties:
      Fill: =clrOverlay
      Height: =768
      OnSelect: =false
      Visible: =locPanel = "edit"
      Width: =1366
      X: =0
      Y: =0
- conXxxEditPanel:
    Control: GroupContainer@1.5.0
    Variant: ManualLayout
    Properties:
      BorderColor: =clrBorder
      BorderThickness: =1
      DropShadow: =DropShadow.None
      Fill: =clrCard
      Height: =600
      RadiusBottomLeft: =12
      RadiusBottomRight: =12
      RadiusTopLeft: =12
      RadiusTopRight: =12
      Visible: =locPanel = "edit"
      Width: =760
      X: =(1366 - Self.Width) / 2
      Y: =(768 - Self.Height) / 2
```

- Open: `UpdateContext({locPanel: "edit", locId: ThisItem.ID})` (then `Reset(...)` the panel's inputs). Close: `UpdateContext({locPanel: "", locId: 0})`.
- The overlay's `OnSelect` is `=false`: it only blocks taps on the board. Panels close with their own Save / Cancel buttons, so a stray tap never throws away typed edits (a deliberate change from guide 7.2's close-on-tap; section 0, D6).
- One panel open at a time; each panel's `locPanel` value is a screen-local word ("edit", "place", "assign", "find").

### 9.8 Inputs inside panels

```yaml
- txtXxxNotes:
    Control: Classic/TextInput@2.3.2
    Properties:
      BorderColor: =clrBorder
      BorderThickness: =1
      Color: =clrText
      Default: =""
      DisabledColor: =clrMuted
      DisabledFill: =clrCard
      Fill: =clrPage
      FocusedBorderColor: =clrBlue
      FocusedBorderThickness: =2
      Height: =44
      HintText: ="Notes"
      HoverColor: =clrText
      HoverFill: =clrPage
      PressedColor: =clrText
      PressedFill: =clrPage
      Size: =15
      Width: =320
      X: =24
      Y: =80
- ddXxxMachine:
    Control: Classic/DropDown@2.3.1
    Properties:
      BorderColor: =clrBorder
      ChevronBackground: =clrGrey
      ChevronFill: =clrText
      Color: =clrText
      Default: ="SB8"
      Fill: =clrPage
      Height: =44
      HoverColor: =clrText
      HoverFill: =clrCard
      Items: =Choices(TheWhiteBoard.Machine)
      Items.Value: =Value
      PressedColor: =clrText
      PressedFill: =clrCard
      SelectionColor: =clrWhite
      SelectionFill: =clrBlue
      Size: =15
      Width: =160
      X: =24
      Y: =140
- dpXxxPunchDay:
    Control: Classic/DatePicker@2.6.0
    Properties:
      BorderColor: =clrBorder
      Color: =clrText
      DefaultDate: =Blank()
      Fill: =clrPage
      Format: =DateTimeFormat.ShortDate
      Height: =44
      IconBackground: =clrGrey
      IconFill: =clrText
      Size: =15
      StartOfWeek: =StartOfWeek.Monday
      Width: =220
      X: =24
      Y: =200
```

- Text box `Default` is the job's value when a panel opens for an existing job (`LookUp(ActiveJobs, ID = locId).FanNumber & ""`), `""` for Add. Read-only (Job #, Unit # when CasmfgId isn't blank): `DisplayMode: =If(<imported>, DisplayMode.Disabled, DisplayMode.Edit)`.
- Drop-down `Default` is the text to select; read `.Selected.Value`. Date pickers keep `DateTimeZone` at its default (Local).
- An input that can be Disabled (`DisplayMode`) also sets `DisabledBorderColor: =clrBorder`, `DisabledColor: =clrMuted`, `DisabledFill: =clrCard`, and on drop-downs `ChevronDisabledBackground: =clrBorder`, `ChevronDisabledFill: =clrMuted`. The Classic/DropDown 2.3.1 defaults are light grey, and Classic/DatePicker 2.6.0 draws dark text on the dark fill.

---

## 10. Before you hand over

1. `python3 tools/palint.py <your screen>.yaml` and, together with the other screens, 0 errors and no duplicate names.
2. Only names from this contract, your own controls, `TheWhiteBoard` and its columns.
3. Every `TheWhiteBoard` touch is one of the three in section 5 or a write in section 6.
4. Every write: 6.1/6.2/6.3 or the 6.4 move snippet, from a Button `OnSelect`, using `ThisItem` or `locId`.
5. No `Coalesce(x, "")` anywhere (3.4, blank text rule), and no gauge gallery on a banded screen (6.2).
6. Header (9.1) with Home last; timer (7.1); OnVisible (7.2); panels last (9.7).
7. Hand-over header with the paste number from section 1.

---

## 11. Integration log (2026-10-02)

All screen notes' "Requests for App.Formulas / CONTRACT" were collected in one pass.

**Adopted (this file or App.Formulas now says it; every screen already does it locally, so nothing needs re-pasting):**

| From | Request | Where now |
|---|---|---|
| scrTV R1, R2 | Punch bands without the ±400-day limit; year in the label for far-away days | App.Formulas `PunchBandsOpen` / `PunchBandsAll`; 3.5. Checked: unchanged output on six sample lists (default and V1 mode); far-away days now get a band; scrTV's local list equals `Filter(PunchBandsOpen, BandKey > 0)`; all 2,500 scrPunch formulas still type-check |
| scrHome C1, C2 | "invalid arguments" next to "isn't recognized"; Accessibility items expected | 1 (Paste 12), 9.1 |
| scrPunch 1, scrNesting C2 (and D8) | Single-row `LookUp(ID)` re-check before a write | 0 (D8), 5 item 1 |
| scrPunch 2, scrNesting C2 | Need pill re-reads Done before un-needing | 6.1 |
| scrPunch 3, scrAssembly 6 | Panel save writes only changed fields; band max + 1 after a refresh | 6.3 |
| scrPunch 4 | Place / Restore / Reopen re-check status | 6.4 |
| scrPunch 5 | Pair / Unpair count failures | 6.4 |
| scrPunch 6, scrAssembly 3, scrNesting C1, scrTurret C1, scrImport 1 | Disabled ("busy") colours on buttons | 6 intro, 9.1 |
| scrPunch 7 | Disabled colours on drop-downs and date pickers | 9.8 |
| scrPunch 8, scrNesting C4, scrTurret C2, scrBending 3 | Header toggle label 150 px; AccessibleLabel | 9.2 |
| scrPunch 9, scrNesting C5, scrAssembly 8 | "NO SHIP DATE" widths on compact cards | 9.3 |
| scrImport 2 | `IsError()` on deciding reads in a bulk loop | 6 intro |
| scrAssembly 4 | Started tick keeps an existing StartedOn | 6.4 |
| scrAssembly 5 | Ship-move acknowledge re-checks the ship date. **scrPunch's two tags (btnPunMovedS8 / S15) were changed to match** (the only YAML change in this pass) | 6.4 |
| scrAssembly 7 | Assembly squares: 27 px Labels at a 30 px pitch | 9.4 |
| scrNesting C3 | Trimmed compare and a shared save key for the nest label | 0 (D7), 6.4 |
| scrNesting C6 | Typing-pause timer variant | 7.1 |
| scrBending 1, 2, 4 | Gallery `FocusedBorderThickness: =0`; light text on dimmed fills; `With({saved: Patch(...)})` | 9.3, 6 intro |
| scrTurret (as built) | `lblTurMachine` instead of `locTurMachine`; one flat gallery | 3.5, 4 |

**Not adopted (left as they are):**

| From | Request | Why |
|---|---|---|
| scrAssembly 1 | `AsmSlack` / `AsmRule` columns in ActiveBase | Only scrAssembly uses them, and it already computes them in `galAsmDays.Items`. Adding them would cost every screen a recalculation, and removing the local copies would be a property patch for no gain. |
| scrAssembly 2 | `AsmRuleText` user-defined function | Same reason; it would also make the New analysis engine (UDFs) a requirement. |
| scrImport 3 | Add Milliseconds / Seconds / Quarters to guide 6.13's TimeUnit list | Belongs to the guide's owner (`design/yaml-authoring-guide.md`), not to this file. |
| scrTV R3 | Notes on the TV: app-spec leaves them out, list-design shows them | A user decision. scrTV shows them; its patch P1 hides them. |
| scrTV R4 | A "not updated since" pattern | Needs a one-off Studio test that `IfError(Refresh(...))` catches a failed refresh first. |
| (integration) | The same ±400-day limit in `AsmDays` / `AsmDaysAll` | Not requested by any screen. An assembly date more than 400 days away (a mistyped year) gets no grid row; the job still shows in Punch's edit panel and Find. Low risk; fix the same way as R1 if it ever matters. |
