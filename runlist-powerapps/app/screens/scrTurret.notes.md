# scrTurret: paste notes

This screen is **one paste**: `scrTurret.yaml` (714 lines, 32 controls plus the screen). Every name contains `Tur`. The one screen serves both turrets: it shows **SB8** or **SB15** depending on how it was opened (Home > SB8 / SB15 button, or a bookmark ending `&screen=sb8` / `&screen=sb15`).

---

## Paste steps

```
PASTE 8 of 12: screen scrTurret (new screen)
Before this: Pastes 1-7 done (App.OnStart, App.Formulas, scrHome, scrPunch, scrImport, scrAssembly, scrNesting). RunListJobs connected.
             (This screen itself only needs Pastes 1-3: OnStart, Formulas and scrHome.)
Where: Tree view > Screens tab > right-click any screen > Paste. Copy ALL of scrTurret.yaml
       (use the copy button; the first line is "Screens:", the last line is "            Visible: =false").
After: run the 3.4 checks. Expected: 0 errors. A new screen "scrTurret" (no _1 at the end).
```

Paste 11 (App > StartScreen) names `scrTurret`, so do it after this paste, as the contract's order says.

In Tree view, under scrTurret, you should see:

- `lblTurMachine` (hidden: it holds "SB8" or "SB15" for the rest of the screen)
- `conTurHeader`, holding lblTurTitle, lblTurSub, lblTurCount, tglTurShowDone, lblTurShowDone, btnTurRefresh and btnTurHome
- `recTurAccent` (the thin coloured line under the header)
- `galTurJobs`, holding lblTurDay, lblTurDayCount and `conTurCard`. The card holds recTurPairBar, lblTurModel, lblTurCust, lblTurShip, lblTurJob, btnTurPair, lblTurNotes, btnTurG12, btnTurG14, btnTurG16, btnTurG18, btnTurG20, btnTurG24, lblTurNoGauges, lblTurNest and lblTurComplete
- `lblTurEmpty` and `tmrTurRefresh`

If a formula shows "Name isn't recognized" for a control that does exist (most likely one that uses `lblTurMachine` or `tglTurShowDone`), use the "type a space" fix in guide 3.4.

If the paste fails, nothing is created. Send the exact error text, "Paste 8", and what was selected in Tree view (guide 3.7).

### Already pasted the earlier version of Paste 8?

No control was added, removed or moved, so don't re-paste. Apply these property patches (guide 3.3 / 3.6) instead, **in this order** (galTurJobs.Items first: lblTurDay.Color uses its new `TurDayOpen` column). Select the control in Tree view, pick the property, and paste the formula into the formula bar.

| Screen | Control | Property | New formula (paste into formula bar) |
|---|---|---|---|
| scrTurret | galTurJobs | Items | the code block below |
| scrTurret | lblTurDay | Color | `If(ThisItem.PunchDayKey > 0 && ThisItem.PunchDayKey < TodayKey && ThisItem.TurDayOpen > 0, clrAmber, clrText)` |
| scrTurret | btnTurRefresh | DisabledColor | `Self.Color` |
| scrTurret | btnTurRefresh | DisabledFill | `ColorFade(Self.Fill, -30%)` |
| scrTurret | lblTurShowDone | Width | `150` |
| scrTurret | lblTurShowDone | LayoutMinWidth | `150` |
| scrTurret | btnTurG14 | X | `20 + (If(ThisItem.Need12, 1, 0)) * 140` |
| scrTurret | btnTurG16 | X | `20 + (If(ThisItem.Need12, 1, 0) + If(ThisItem.Need14, 1, 0)) * 140` |
| scrTurret | btnTurG18 | X | `20 + (If(ThisItem.Need12, 1, 0) + If(ThisItem.Need14, 1, 0) + If(ThisItem.Need16, 1, 0)) * 140` |
| scrTurret | btnTurG20 | X | `20 + (If(ThisItem.Need12, 1, 0) + If(ThisItem.Need14, 1, 0) + If(ThisItem.Need16, 1, 0) + If(ThisItem.Need18, 1, 0)) * 140` |
| scrTurret | btnTurG24 | X | `20 + (If(ThisItem.Need12, 1, 0) + If(ThisItem.Need14, 1, 0) + If(ThisItem.Need16, 1, 0) + If(ThisItem.Need18, 1, 0) + If(ThisItem.Need20, 1, 0)) * 140` |
| scrTurret | lblTurNest | X | `28 + If(ThisItem.NeedCount = 0, 240, ThisItem.NeedCount * 140)` |

galTurJobs > Items:

```
With(
    {
        tVis: SortByColumns(
            Filter(ActiveJobs, MachineText = lblTurMachine.Text && Nested && (tglTurShowDone.Value || !TurretDone)),
            "PunchDayKey", SortOrder.Ascending,
            "GroupShipKey", SortOrder.Ascending,
            "GroupShipMaxKey", SortOrder.Ascending,
            "PairKey", SortOrder.Ascending,
            "PunchSort", SortOrder.Ascending,
            "ID", SortOrder.Ascending
        )
    },
    AddColumns(
        tVis As j,
        TurFirst, j.ID = First(Filter(tVis, PunchDayKey = j.PunchDayKey)).ID,
        TurDayCount, CountRows(Filter(tVis, PunchDayKey = j.PunchDayKey)),
        TurDayOpen, CountRows(Filter(tVis, PunchDayKey = j.PunchDayKey && !TurretDone)),
        TurDayLabel, If(j.PunchDayKey = 0, "Unscheduled", If(j.PunchDayKey = TodayKey, "Today  ", "") & Text(j.PunchDay, "ddd mmm d", "en-US"))
    )
)
```

lblTurEmpty.Visible only moved into a `|-` block in the YAML; its formula is unchanged, so it needs no patch. Afterwards run the 3.4 checks (expected: 0 errors) and test steps 6 and 8 below.

---

## What you should see

In the editor the screen shows **SB8**, or the machine you last tapped on Home in Preview during this Studio session (the SB8 / SB15 buttons set `varMachine`, and it keeps its value after you press Esc). The list is filled if there is data. The 30-second timer only runs in Preview (**F5**).

- **Header** (left to right):
  - the machine name, big: "SB8" in light blue, or "SB15" in purple;
  - grey "Turret: check off gauges";
  - "n jobs to punch";
  - a **Show complete** switch (off);
  - a blue **Refresh** button and a grey **Home** button. While Refresh is working, the button turns a darker blue and its white text stays readable.
- A thin line in the machine's colour runs under the header.
- **Day headers.** These are bars tinted in the machine's colour, with "n jobs" on the right.
  - "Unscheduled" comes first, then one bar per punch day, in date order, for example "Thu Oct 1", "Today  Fri Oct 2", "Sat Oct 3".
  - A day gets a bar only when it holds a job shown below it.
  - A past day's bar text is amber while that day still holds a job with a gauge to punch. That's work that should already be punched. With Show complete on, a past day that holds only finished jobs keeps white text.
- **The jobs:** this machine's Active jobs that are marked Nested and are not finished on the turret.
- **Order within a day:**
  - the earliest ship date first, where a pair counts by its earliest member;
  - when a single job and a pair tie on that date, the single job goes first if another member of the pair ships later; if the whole pair ships that same day, the pair comes first (a member with no ship date doesn't count);
  - a pair always sits together;
  - then the supervisor's punch order.
- **Each card:**
  - Row 1: the model (for example CASRTU3-I.250-24MF-3-RTU) in large bold text, then the customer (12 characters) and "📅 m/d" (red "📅 NO SHIP DATE" when blank). Then "#8481557-1", and on the right a small coloured pair number when the job is paired. The pair has the same number and colour as on Punch, and a strip of the same colour runs down the card's left edge.
  - Row 2: the job's notes in grey italics, when there are any.
  - Row 3: one big button for each gauge the job **needs**. A yellow "14 ga" is still to punch; a green "✓ 14 ga" is punched. Then comes the nest label in bold (grey "no nest label" when empty). A job with no gauges selected shows amber "No gauges selected" instead of buttons.
- **Tapping a gauge button** switches that gauge between to do and done. Only that one gauge is saved.
  - When you tick the last open gauge, a green banner says "8481557-1 - all gauges punched. It leaves this list (turn on Show complete to undo).", and the card disappears.
- **Show complete on:** finished jobs come back on a darker card with a green border and "✓ Complete", so a wrong last tick can be undone.
- **Nothing to show:** a grey message, "Nothing waiting on SB8 right now." with a line below explaining when jobs appear.

## Manual test (Preview)

Use TEST jobs (job # starting TEST, made with Punch > Add job, set to a machine and a punch day, gauges selected, and marked Nested on Nesting). Keep SharePoint open in another tab to check the values.

1. **SB8.** Select scrHome, press **F5** and tap **SB8**. The title reads "SB8" in light blue. The cards are the SB8 jobs from Punch's SB8 column that are Nested and still have a yellow gauge. A non-Nested TEST job on SB8 is not shown. "Show complete" in the header is shown in full (no letters cut off).
2. **SB15.** Tap **Home**, then **SB15**. The title, the line under the header and the day bars turn purple, and only SB15 jobs show.
3. **Tick one gauge.** On a TEST job with two needed gauges, tap the yellow **12 ga**. It turns green and reads "✓ 12 ga". In SharePoint, Done12 = Yes, and Need12 and the other columns are unchanged. Tap it again: yellow, Done12 = No. Tick it once more for the next step.
4. **Last gauge.** Tap the job's other yellow gauge. A green banner says the job's gauges are all punched, the card leaves the list, and "jobs to punch" in the header drops by 1. On Punch, the card disappears from the board (with Show completed off).
5. **Undo.** Turn **Show complete** on. The job is back, darker, with a green border and "✓ Complete". Tap one of its green buttons: it turns yellow and the green border goes. Turn Show complete off: the job stays, because it's no longer finished.
6. **Day headers.** Give three SB8 TEST jobs no punch day, today, and tomorrow (Punch > Edit). Here you see "Unscheduled", then "Today  Fri Oct 2", then the next day, each with the right "n jobs". Set one TEST job's punch day to yesterday (make it the only SB8 job on that day): its bar reads in amber.
   - Turn **Show complete** on and tick that job's yellow gauges. No banner shows, the card stays (darker, "✓ Complete") and the yesterday bar turns **white**, because nothing on that day is left to punch. Untick one gauge: the bar is amber again. Turn Show complete off.
7. **Pair.** Pair two SB8 TEST jobs on the same day (Punch > Edit > Pair). They sit next to each other with the same coloured number and side strip as on Punch.
8. **Refresh.** On a second device (or in SharePoint), set Done14 = Yes on a TEST job shown here. Within about 30 s the button turns green here without tapping anything. **Refresh** does it at once; while it works, the Refresh button is a darker blue with readable white "Refresh" text (not a pale box). (This is go-live check (4).)
9. **Bookmark.** Open the app link with `&screen=sb15` at the end. It opens straight on SB15.

Afterwards, set the TEST jobs to Dismissed in Punch.

---

## Decisions and assumptions (each with its fallback)

| # | What I did | Why | If you want it different |
|---|---|---|---|
| A1 | A job leaves the list on its **own** last tick. In the old turret page, a pair stayed until **both** mates were finished. | list-design ("Machine matches && Nested && !TurretDone") and app-spec say per job, and they rank above the old code. | Ask. Keeping a pair until both are done is a property patch on galTurJobs.Items, lblTurCount.Text and lblTurEmpty.Visible. |
| A2 | **One list.** Each day's header is drawn above the first card of that day, instead of a day list with a card list inside each day (CONTRACT 3.5's suggestion). The sort is CONTRACT 5.1 "Turret", with the punch day put first. | It avoids guide U4 (a day row growing to fit a list inside it). It also gives one smooth scroll, including the mouse wheel on a PC. The order and the day headers come out the same. | None needed. If cards look cut off, see U-a below. |
| A3 | The machine comes from a hidden label, `lblTurMachine`, using exactly the contract's expression, instead of a context variable set in OnVisible. OnVisible still refreshes the list. | Studio doesn't reliably run a screen's OnVisible when Preview starts on that screen, so a variable could stay empty during your first test. The label is always current: in the editor, on F5, and after the Home buttons. | None needed. |
| A4 | Cards show the job's **Notes** line. | list-design: Notes are "Shown on Punch, SB8/SB15 and Bending cards". The old turret page didn't show them. | Hide them with lblTurNotes.Visible = `false`. |
| A5 | A green **"all gauges punched"** banner appears after the last tick, when Show complete is off. | Otherwise the card just vanishes, and the operator may think the tap failed. | Ask; it can be removed. |
| A6 | A **Refresh** button sits in the header. | CONTRACT 9.1 header, as on Nesting and Bending. app-spec lists only the switch and Home. | Ask; it can be removed. |
| A7 | **Inside a pair**, members are ordered by punch order (CONTRACT D3). | The contract's settled sort. The old page put the mate with the earlier ship date on top. | Ask. |
| A8 | The **Show complete** switch starts off when the app opens and keeps its position while the app stays open. | Fewer surprises on a shared tablet. | Ask for it to reset every time the screen opens. |
| A9 | **Size** isn't on the turret card. | app-spec's card list and the old turret page don't have it. | Ask. |
| A10 | A past punch day's header is amber while that day still holds a job with a gauge to punch (`TurDayOpen > 0`, a local column in galTurJobs.Items). Today's header reads "Today  Fri Oct 2". | It matches Nesting, and late work stands out. A past day with only finished jobs (seen with Show complete on) has nothing late, so it stays white. | Ask. |
| A11 | Gauge buttons are 130 wide on a **140** pitch (10 px gap), as CONTRACT 6.2 says ("keep the pitch"). | Contract compliance; the earlier build used 142. | None needed. |

## Uncertainties and fallbacks

| # | What could differ in Studio | How you'll notice | Fallback |
|---|---|---|---|
| U-a | **The first card of each day needs a taller row** (header + card). galTurJobs is a flexible-height gallery and should grow those rows; this is the same behaviour the guide's smoke test, Example 3, relies on, and Microsoft's EAM sample uses a flexible-height gallery the same way. Likely fine. | The first card under a day header has its gauge buttons cut off at the bottom. | Property patch (guide 3.6). Every row then gets room for a header, so cards have a larger gap between them, but nothing is cut off. See the table below. |
| U-b | **Scroll position after a tap.** Each tick recalculates the list, and Studio may scroll it back to the top. The same can happen on the 30 s refresh. | After a tick or a refresh, the list jumps to the top. | Not testable offline. Report it if it gets in the way. |
| U-c | **Symbols** ✓ and 📅 on a tablet browser (guide U12). | A box instead of the symbol. | Report the device; the text can be swapped for plain words. |
| U-d | **Other devices' ticks** showing up after the 30 s refresh (guide U9). | Test step 8 doesn't update. | Report it (CONTRACT 7.5); don't add collections. |
| U-e | **Button look while working.** Buttons briefly disable while they run (so a double tap can't double-write) and show a darker shade of their colour: the gauge buttons during a save, the Refresh button during a refresh. Text stays readable. | A darker flash on tap. That is expected. | None needed. |

Fallback patch for U-a (only if needed):

| Screen | Control | Property | New formula (paste into formula bar) |
|---|---|---|---|
| scrTurret | galTurJobs | TemplateSize | `206` |

## Requests for App.Formulas / CONTRACT

**App.Formulas:** none. The screen uses only existing names: `ActiveJobs` (columns MachineText, Nested, TurretDone, PunchDayKey, PunchDay, GroupShipKey, GroupShipMaxKey, PairKey, PunchSort, PairNo, PairRank, PairColor, NeedCount, Gauges, JobLabel, CustShort, ShipText, Need12..24, Done12..24, ProductModel, JobName, NestLabel, Notes, ShipDate), `TodayKey`, the `clr...` colours, `varMachine`, `gblRefreshTick` and `scrHome`. The per-day columns (TurFirst, TurDayCount, TurDayOpen, TurDayLabel) are added locally in galTurJobs.Items.

**CONTRACT** (each one is already worked around locally on this screen; nothing here blocks the paste):

| # | Section | Request | Local workaround |
|---|---|---|---|
| C1 | 9.1 Refresh button | Add `DisabledColor: =Self.Color` and `DisabledFill: =ColorFade(Self.Fill, -30%)` to the btnXxxRefresh template. The button disables itself while `Refresh(RunListJobs)` runs (AutoDisableOnSelect defaults to true), and the template defaults `ColorFade(Self.Fill, 70%)` / `ColorFade(Self.Fill, 90%)` give a pale-blue box with near-white text. Every screen that copied 9.1 has this. Same as scrNesting's C1. | Added on btnTurRefresh. |
| C2 | 9.2 header toggle label | 140 px (and the 130 px this screen had) is too narrow for 14-pt "Show complete(d)" with Wrap off; suggest 150. Same as scrNesting C4 / scrBending request 3. | lblTurShowDone is 150 wide. |

## Open issues

- **O1. A1 needs the user's confirmation:** a paired job leaves the list on its own last tick (list-design and app-spec), where the old `machine.js` kept the pair until every mate was done. The property patch is ready on request.
- **O2. A7 (order inside a pair)** follows CONTRACT D3 (punch order), not the old page's ship-date order. Only the user can change D3.
- **O3. "All gauges punched" banner on stale data.** The banner is decided from the job as shown before the tap. If another device changes the same job at the same moment (or the save had to retry after a conflict), the banner can be wrong or missing. Cosmetic only: the saved value is always the one the operator tapped, and the card itself always reflects the saved data after the refresh.
- **O4. To confirm in Preview:** U-a (first card of a day not cut off), U-b (scroll position after a tap or a refresh), U-d (other devices' ticks, the shared go-live test).
- **O5. CONTRACT requests C1-C2** are open. Neither blocks this screen.

## Changes after the 2026-10-02 reviews

- lblTurEmpty.Visible (113 characters) moved into a `|-` block (guide 5.1: inline only under about 100 characters). No other inline formula in the file is over 95 characters.
- btnTurRefresh got `DisabledColor` and `DisabledFill`, so it stays readable while it refreshes (CONTRACT request C1).
- galTurJobs.Items has a new local column `TurDayOpen`; lblTurDay.Color is amber only for a past day that still holds an unfinished job (A10). Before, a past day holding only completed jobs turned amber when Show complete was on.
- Gauge buttons and the nest label use a 140 pitch (CONTRACT 6.2) instead of 142 (A11).
- lblTurShowDone widened from 130 to 150 so "Show complete" is not clipped (raised in scrBending's notes; CONTRACT request C2).
- Notes: the editor shows the machine last tapped on Home in Preview, not always SB8; the single-versus-pair order is described correctly; counts below brought up to date; a property-patch table added for anyone who pasted the earlier version.

## Data and contract compliance

- **RunListJobs** is touched only by the CONTRACT 6.2 write helper on the six gauge buttons, `Patch(RunListJobs, LookUp(RunListJobs, ID = id), {DoneNN: v})` (IfError, then Refresh, retry once, then Notify), and by `Refresh(RunListJobs)`. Each button writes only its own Done column. Nothing else reads RunListJobs; all other reads use `ActiveJobs`, which is in memory, so no delegation warning is expected. Any warning is a bug, so report it.
- Writes come only from Classic/Button `OnSelect` and use `ThisItem`, never `galTurJobs.Selected`. There is no gauge gallery (CONTRACT 6.2), no `Coalesce(x, "")`, and no `AllItems`.
- The timer runs every 30000 ms with the tick bump (CONTRACT 7.1). OnVisible is Refresh + tick (7.2). Home is the last header item (9.1).
- Checked offline (2026-10-02, after both reviews):
  - `tools/palint.py` gives 0 errors and 0 warnings on this file (33 names), and 0 errors with no duplicate names across all screens together (425 names).
  - Every property exists in the Sept 2026 Studio control template for its control type.
  - All 443 formulas were type-checked and evaluated in the Power Fx 1.8 interpreter, in both default and V1 modes, against sample rows (today = Fri 2026-10-02).
  - 104 behaviour checks passed in both modes: SB8/SB15 lists and order, day headers, counts and open counts, Show complete, button positions on the 140 pitch, a tick, the last tick with its banner, the undo, a past day turning from amber to white when its only job is finished with Show complete on (and back on undo), a pair that ships the same day as a single sorting first (and the single first once a pair member ships later), the machine choice for every Home/bookmark case, and the empty message.
