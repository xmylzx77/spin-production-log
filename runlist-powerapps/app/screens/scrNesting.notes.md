# scrNesting: paste notes

This screen is **one paste**: `scrNesting.yaml` (763 lines, 32 controls plus the screen). Every name contains `Nes`.

---

## Paste steps

```
PASTE 7 of 12: screen scrNesting (new screen)
Before this: Pastes 1-6 done (App.OnStart, App.Formulas, scrHome, scrPunch, scrImport, scrAssembly). RunListJobs connected.
             (This screen itself only needs Pastes 1-3: OnStart, Formulas and scrHome.)
Where: Tree view > Screens tab > right-click any screen > Paste. Copy ALL of scrNesting.yaml
       (use the copy button; the first line is "Screens:", the last line is "            Visible: =false").
After: run the 3.4 checks. Expected: 0 errors. A new screen "scrNesting" (no _1 at the end).
```

**Already pasted an earlier version of scrNesting?** Replace it as in guide 3.5: back up the old screen (right-click > Copy, paste into Notepad), delete it, then paste this file. Check that no name ends in `_1`.

In Tree view, under scrNesting, you should see:

- `conNesHeader`, holding lblNesTitle, lblNesCounts, tglNesNotNested, lblNesNotNested, btnNesRefresh and btnNesHome
- five column captions: lblNesColJob, lblNesColWhere, lblNesColSize, lblNesColGauges, lblNesColLabel
- `galNesJobs` > `conNesCard`, holding lblNesJob, lblNesCust, btnNesPair, lblNesMachine, lblNesDay, lblNesSize, lblNesShip, btnNesG12, btnNesG14, btnNesG16, btnNesG18, btnNesG20, btnNesG24, txtNesLabel, btnNesSave and btnNesNested
- lblNesEmpty and tmrNesRefresh

If a formula shows "Name isn't recognized" for a control that does exist (most likely on galNesJobs.Items or btnNesSave.Visible), use the "type a space" fix in guide 3.4.

If the paste fails, nothing is created. Send the exact error text, "Paste 7", and what was selected in Tree view (guide 3.7).

### Changes in this version (review round 1)

- Shorter texts so nothing is cut off: "Machine / day" caption, "Today Oct 2" (no weekday), red "NO SHIP DATE" without the 📅, and a wider "Not nested only" caption.
- The Refresh button stays blue (a bit darker) while it works, instead of going pale.
- Gauge buttons: before un-needing a yellow gauge, the button checks SharePoint, so a gauge the turret ticked a moment ago can't be un-needed.
- Nest label: one save per edit, even when tapping Save also counts as "tapping away". Labels typed in SharePoint with extra spaces no longer show a Save button.
- The typing pause is now 60-90 s as documented (was 90-120 s), and it ends as soon as the label is saved.
- With no open jobs at all, the screen says "No open jobs." (it used to say every job was nested).

---

## What you should see

In the editor, the list is already filled (the timer runs only in Preview, **F5**).

- **Header:** "Nesting"; a grey count line "To nest: n      Nested: m" (jobs that aren't finished on the turret); a **Not nested only** switch (on, green); a blue **Refresh** (it turns a darker blue while it works); a grey **Home**.
- **Column captions:** Job / customer, Machine / day, Size / ship, Gauges: tap to select, Nest label.
- **One row per job** that is Active and not finished on the turret. With **Not nested only** on, only the jobs not yet marked Nested show.
- **Order:** all SB8 jobs, then all SB15 jobs (then any job with no machine). Within a machine: Unscheduled first, then by punch day, then the punch-board order. A pair always sits together.
- **Each row, left to right:**
  - the job # (e.g. 8481557-1) with the customer (12 characters) under it, and a small coloured pair number if the job is paired;
  - the machine (SB8 in light blue, SB15 in purple) with the punch day under it: "Unscheduled", "Today Oct 2", or a date such as "Sat Oct 3". A past punch day is amber;
  - "Size n" (red "SET SIZE" when blank) with "📅 m/d" under it (red "NO SHIP DATE" when blank);
  - six round gauge buttons, 12 14 16 18 20 24: grey = not needed, yellow = needed, green = already punched;
  - the nest label box (hint "+ add label"). A blue **Save** appears next to it as soon as you type. Tapping **Save**, or anywhere else, saves it once;
  - a big **Nested** button on the right: grey "Nested", or green "✓ Nested".
- With nothing to show: "Nothing to nest: every open job is marked Nested." (switch on, open jobs exist), or "No open jobs." (there are no open jobs at all).

## Manual test (Preview, F5)

Use TEST jobs (job # starting TEST, made with Punch > Add job) so nothing real changes. Keep SharePoint open in another tab to check the values.

1. **List and order.** Open Nesting. Every TEST job that isn't Nested shows. SB8 jobs come before SB15 jobs, Unscheduled ones first, then by punch day. Check that no text is cut off: the "Machine / day" caption, "Today ..." under the machine, a red "NO SHIP DATE" (a TEST job with no ship date), and "Not nested only" in the header. Turn **Not nested only** off: the Nested jobs appear too, with a green "✓ Nested". Turn it back on.
2. **Select a gauge.** On a TEST job, tap the grey **14**. It turns yellow, and in SharePoint Need14 = Yes. Tap it again: grey, Need14 = No.
3. **Punched gauge.** Use a TEST job that is marked **Nested** and needs at least three gauges (e.g. 12, 14 and 16), so one tick doesn't finish it on the turret (the turret only lists Nested jobs). Tick 12 ga on the SB8/SB15 screen. Back here, switch **Not nested only** off (wait up to 30 s, or tap **Refresh**): the 12 is green. Tap it: an amber banner says "12 ga is already punched, so it stays selected", and nothing changes (Need12 stays Yes in SharePoint). Leave the switch off for step 3b.
   - **3b. Punched a moment ago on another device** (needs a second device). With the same job showing here, tick 14 ga on the second device's SB8/SB15 screen. Within a few seconds (before this screen refreshes), tap the still-yellow **14** here: the same amber banner shows ("14 ga is already punched, ..."), the list refreshes and the 14 turns green. Need14 stays Yes in SharePoint. Switch **Not nested only** back on.
4. **Nest label with Save.** Tap the label box on a TEST job and type `25TON TEST`. A blue **Save** appears. Tap it: Save disappears, and SharePoint shows NestLabel = 25TON TEST. In SharePoint, open the item's **Version history**: this save added **one** version, not two.
5. **Nest label without Save.** Change the text to `25TON TEST2`, then tap an empty part of the row. It saves the same way (Save disappears; SharePoint shows the new text). Clear the box and tap Save: NestLabel is empty in SharePoint.
6. **Nested.** Tap **Nested** on a TEST job that has at least one yellow gauge. A green banner says "TEST...-1 marked Nested." and the row leaves the list; the "To nest" count drops by 1. Turn **Not nested only** off: the job is there with a green "✓ Nested". Tap it: it goes grey (Nested = No in SharePoint). Turn the switch back on.
7. **Nested with no gauges.** Tap **Nested** on a TEST job with all six gauges grey. It is saved, and an amber banner warns that it has no gauges selected.
8. **Other devices.** Don't tap into any label box for this step. On a second device (or in SharePoint), set Need16 = Yes on a TEST job. Within about 30 s the 16 turns yellow here without tapping anything. (If you tapped into a label box without changing it in the last minute or so, it can take up to about 90 s: see step 9.)
9. **Typing pause.** Tap into a label box and type slowly for about 45 s without saving. The text you type is never wiped by the automatic refresh: after you tap into a box, the screen skips the next two automatic refreshes (the next one comes 60-90 s after the tap). Tap **Save**: the pause ends and refreshes run every 30 s again.
10. **Refresh and Home.** Tap **Refresh**: the button stays blue (slightly darker) while it works, and its text stays readable. Tap **Home**: you go to the home screen.

Afterwards, set the TEST jobs to Dismissed in Punch.

---

## Assumptions and decisions (each with its fallback)

| # | What I did | Why | If you want it different |
|---|---|---|---|
| A1 | The list shows Active jobs that **aren't TurretDone** (punched on the turret). | app-spec (scrNesting) and the task say so. list-design's one-line summary says "Nesting: all Active" (open issue O1). With **Not nested only** on (the default) the two give the same list in practice, because the turret only shows Nested jobs. | To show every Active job, apply the property patch **P1** below. |
| A2 | The nest label saves in **two ways**: when you tap away from the box (OnChange, as CONTRACT 6.4), and with the blue **Save** button that appears while the text differs from what's saved. Both write only when the trimmed text differs from the trimmed saved label, so a data refresh never writes. Tapping Save while typing fires both; they share a save key (`locNesSaveKey` = job ID, old label, new label), so whichever runs first writes and the other skips: **one write, one version**. A failed save clears the key, so Save can retry. Leading and trailing spaces are trimmed (Power Fx `Trim` also turns double spaces inside into single ones); up to 255 characters (the SharePoint limit). | The Save button is a visible "not saved yet" cue and still works if tapping away doesn't save (U-a). Save-only (as on Punch) was not chosen: with **Not nested only** on, typing a label and then tapping **Nested** removes the row, and the typed label would be lost. Tap-away-only was not chosen: Save could then not retry a failed save. | If OnChange ever saves at odd moments, apply **P2** (turns it off; the Save button still works). |
| A3 | **Refresh pause while typing.** Tapping into a label box skips the next **2** automatic refreshes, so the next one comes 60-90 s after the tap. Saving a label ends the pause at once; tapping into a box again re-arms it. The Refresh button always refreshes. Variable: `locNesHold` (screen-local). | A refresh rebuilds the list and can wipe half-typed text in a box. CONTRACT 7.1 has a plain timer for this screen; this is a local, safer variant (request C6). | Apply **P3** for the plain CONTRACT timer. |
| A4 | Gauge buttons are **44 x 40** (pitch 50) instead of CONTRACT 9.4's compact 40 x 28 (pitch 46). Same colours and rules. | app-spec: big touch targets on floor screens; the row has room. | Ask; it's Width/Height/X on six buttons. |
| A5 | Tapping a **green** (punched) gauge does nothing but show an amber banner. Before un-needing a **yellow** gauge, the button re-reads that one job from SharePoint (`LookUp(RunListJobs, ID = id)`). If the turret has ticked it since this screen last refreshed, it shows the same banner, writes nothing and refreshes (so the gauge turns green). Tapping a grey gauge makes no extra read. | app-spec: a done gauge can't be un-needed. This screen's copy of the list can be 30-90 s old. | None needed. |
| A6 | **Nested** shows a short green banner "... marked Nested." (amber, 8 s, when no gauge is selected). The job is still saved. | With Not nested only on, the row disappears at once; the banner says which job it was. Turret shows "No gauges selected" for such a job. | Ask to block Nested when no gauge is selected, or to drop the banner. |
| A7 | Extra details not in app-spec's row list: the customer (12 characters), the pair number badge (CONTRACT D4/D5), "Today" and amber past punch days, and column captions. | They help the nester find a job; no writes. | Ask to remove any of them. |
| A8 | A job with **no machine** (shouldn't happen for an Active job) is listed last and shows "No machine". | Never hide a job. | None needed. |
| A9 | The card is 12 px narrower than the list, so the scroll bar never covers the Nested button. | Safety margin. | None needed. |
| A10 | **Texts shortened to fit their fixed columns:** caption "Machine / day"; today's punch day "Today Oct 2" (other days keep the weekday); a blank ship date shows red "NO SHIP DATE" without the 📅 (CONTRACT 9.3 writes `"📅 " & ShipText`, request C5); the "Not nested only" caption is 150 px wide (CONTRACT 9.2 says 140, request C4). | The longer texts were cut off (estimated widths in "Offline verification"). | Ask; each is one Text or Width. |

### Property patches (guide 3.6; formula-bar text, no leading `=`)

| Patch | Screen | Control | Property | New formula |
|---|---|---|---|---|
| P1 | scrNesting | galNesJobs | Items | block P1a |
| P1 | scrNesting | lblNesEmpty | Visible | block P1c |
| P1 | scrNesting | lblNesEmpty | Text | block P1d |
| P1 | scrNesting | lblNesCounts | Text | block P1b |
| P2 | scrNesting | txtNesLabel | OnChange | `false` |
| P3 | scrNesting | tmrNesRefresh | OnTimerEnd | block P3 |

P1a:
```
SortByColumns(Filter(ActiveJobs, !tglNesNotNested.Value || !Nested), "MachineOrder", SortOrder.Ascending, "PunchDayKey", SortOrder.Ascending, "PunchGroupOrder", SortOrder.Ascending, "PairKey", SortOrder.Ascending, "PunchSort", SortOrder.Ascending, "ID", SortOrder.Ascending)
```

P1b:
```
"To nest: " & CountRows(Filter(ActiveJobs, !Nested)) & "      Nested: " & CountRows(Filter(ActiveJobs, Nested))
```

P1c:
```
IsEmpty(Filter(ActiveJobs, !tglNesNotNested.Value || !Nested))
```

P1d:
```
If(IsEmpty(ActiveJobs), "No active jobs.", "Nothing to nest: every active job is marked Nested.")
```

P3:
```
Refresh(RunListJobs); Set(gblRefreshTick, gblRefreshTick + 1)
```

## Uncertainties and fallbacks

| # | What could differ in Studio | How you'll notice | Fallback |
|---|---|---|---|
| U-a | **When the classic text box fires OnChange.** Expected: when you leave the box (tap elsewhere, including on Save), not on every key (Microsoft: a Patch from a gallery text box's OnChange "is usually fine"). | Saves while you're still typing, or the cursor jumps. | Apply **P2**; use the Save button. |
| U-b | **Whether tapping into the text box fires its OnSelect** (it starts the typing pause and clears the save key). | Test step 9: typed text vanishes after a refresh. | Report it. The save key is only a duplicate guard, so nothing else breaks. |
| U-c | **Scroll position** after a tap. Each save rebuilds the list and Studio may jump back to the top. | After tapping a gauge or Nested, the list jumps to the top. | Not testable offline. Report it if it's annoying. |
| U-d | **Symbols** ✓ and 📅 on a tablet (guide U12). | A box instead of the symbol. | Report the device; the text can be swapped for plain words. |
| U-e | **Other people's changes** showing after the timer's refresh (guide U9). | Test step 8 fails. | Report it (this is the shared go-live test); don't add collections. |
| U-f | **"Name isn't recognized"** right after the paste (guide U3): galNesJobs.Items reads tglNesNotNested, and btnNesSave reads txtNesLabel. Both are pasted earlier in the same block, so this isn't expected. | Red ⊗ on those formulas. | The "type a space" fix in guide 3.4. |
| U-g | **Tapping Save while typing** runs two formulas (the box's OnChange as you leave it, then Save's OnSelect). Whichever starts first sets `locNesSaveKey` before it writes, so the other skips. This relies on the first one starting before the second checks the key. | Test step 4: Version history shows two new versions for one Save. | Harmless (the same text is written twice). Report it; P2 makes Save the only writer. |
| U-h | **Text widths.** Widths were estimated with Arial-like metrics; the app's default font is a little wider. | Test step 1: a cut-off caption or date. | Report which label; it's one Text or Width. |

## Requests for App.Formulas / CONTRACT

**App.Formulas:** none. The screen uses only existing names: `ActiveJobs` (with TurretDone, NeedCount, JobLabel, CustShort, SizeText, ShipText, MachineText, MachineOrder, PunchDayKey, PunchGroupOrder, PairKey, PunchSort, PairRank, PairColor), `TodayKey`, the `clr…` colours and `gblRefreshTick`.

**CONTRACT** (each one is already worked around locally on this screen; nothing here waits for them):

| # | Section | Request | Local workaround |
|---|---|---|---|
| C1 | 9.1 Refresh button | Add `DisabledColor: =Self.Color` and `DisabledFill: =ColorFade(Self.Fill, -30%)`. The button disables itself while `Refresh(RunListJobs)` runs, and the template's disabled colours make its text almost invisible. Every screen that copied 9.1 has this. | Added on btnNesRefresh. |
| C2 | 5 (item 1), 6.1, 6.2 Need buttons | Before un-needing, re-check the server copy (block C2 below), and list this single-row guard read in section 5 (app-spec already allows "a single-row `LookUp(RunListJobs, ID = n)` before a Patch"). scrPunch's gauge pills have the same race. | Done on btnNesG12..G24 (A5). |
| C3 | 6.4 Nest label row | Compare trimmed with trimmed: `Trim(Self.Text) <> Trim(ThisItem.NestLabel & "")`. A label typed in SharePoint with extra spaces otherwise shows a Save button and is rewritten on the next tap-away. If a screen pairs OnChange with a visible Save button, give both a shared save key (A2) so one tap writes once. | Done on txtNesLabel and btnNesSave. |
| C4 | 9.2 header toggle label | 140 px is at the limit for 14-pt captions ("Not nested only" about 130 px, "Show completed" about 138 px with Arial metrics; the default font is wider). Suggest 150. | lblNesNotNested is 150. |
| C5 | 9.3 ship text | `"📅 " & ShipText` gives "📅 NO SHIP DATE" (about 133 px at Size 12), which is cut off in narrow columns. Suggest `If(IsBlank(ShipDate), "NO SHIP DATE", "📅 " & ShipText)` where space is tight. | Done on lblNesShip (A10). |
| C6 | 7.1 timer | Nesting keeps a typing pause (A3) instead of the plain 30 s timer. Either allow it in 7.1, or say so and the person applies P3. | A3; P3 ready. |

C2 (the guard, shown for 14 ga; `&&` and `||` stop early, so a tap on a grey gauge makes no extra read):
```
With({id: ThisItem.ID, v: !ThisItem.Need14},
    If(
        ThisItem.Need14 && (ThisItem.Done14 || LookUp(RunListJobs, ID = id).Done14),
        Notify("14 ga is already punched, so it stays selected", NotificationType.Warning);
        If(!ThisItem.Done14, Refresh(RunListJobs); Set(gblRefreshTick, gblRefreshTick + 1)),
        <the 6.1 IfError helper on {Need14: v}>
    )
)
```

## Open issues

- **O1. Which jobs Nesting lists** (user decision). list-design's status model says "Nesting: all Active"; app-spec says every active job "that isn't TurretDone". This build follows app-spec, which also matches the original punch board hiding finished jobs (A1). Keep it, or apply **P1** to list every Active job.
- **O2. CONTRACT requests C1-C6** are open. None blocks this screen.
- **O3. To confirm in Preview:** U-a (when OnChange fires), U-b (OnSelect on tapping into the box), U-g (one version per Save), U-h (no cut-off text), and U-e (other devices' changes; the shared go-live test).

## Data and contract compliance

- **RunListJobs** is touched only by:
  - `Patch(RunListJobs, LookUp(RunListJobs, ID = id), …)` (18 times, in the write helper);
  - `Refresh(RunListJobs)`;
  - the gauge buttons' guard read `LookUp(RunListJobs, ID = id).Done12` … `.Done24` (6 times). It runs only when un-needing a yellow gauge, just before that Patch. It is single-row, by ID and delegable; app-spec allows "a single-row LookUp before a Patch", and CONTRACT 5 is narrower (request C2).
  Everything shown reads `ActiveJobs` (in memory), so no delegation warning is expected; report any.
- **Every write** is the CONTRACT 6.1 helper (values frozen in `With`, base record `LookUp(RunListJobs, ID = id)`, `IfError`, Refresh, retry once, then `Notify(..., NotificationType.Error, 0)`), using `ThisItem`, never `Selected`. Each control patches only its own column:

  | Control | Column |
  |---|---|
  | btnNesG12 ... btnNesG24 | Need12 ... Need24 (refuses to un-need a gauge that is punched here or on the server) |
  | txtNesLabel (OnChange), btnNesSave | NestLabel (shared save key: one write per edit) |
  | btnNesNested | Nested |

- No Toggle writes (the toggle only filters). No `AllItems`, no collections, no `Coalesce(x, "")`.
- **Variables:** context `locNesHold` (Number, the typing pause) and `locNesSaveKey` (Text, the label save key); global `gblRefreshTick` (bumped after every Refresh, CONTRACT 7.2, including the refresh after a refused gauge tap). OnVisible: reset both context variables, Refresh, bump the tick.

## Offline verification done

- `python3 tools/palint.py` on this file: 0 errors, 0 warnings, 33 names. Together with every screen file present: 0 errors, 0 warnings, 425 names, no duplicates.
- All 484 property formulas type-check in the Power Fx 1.8.1 interpreter (default and V1 mode) against the current App.Formulas and sample RunListJobs rows (Notify / Refresh / UpdateContext stubbed).
- Behaviour runs (today = Fri 2026-10-02), 34 blocks, all passing in default and V1 mode:
  - the list order (SB8 Unscheduled, today, tomorrow; SB15 overdue day, a pair kept together ahead of a lower single, then the no-machine job), with the switch on and off;
  - TurretDone and Incoming jobs never listed; the counts; both empty messages ("Nothing to nest ..." when everything is nested; "No open jobs." with no open jobs, switch on and off);
  - row texts and colours ("Today Oct 2", amber past day, SET SIZE, red "NO SHIP DATE", machine colours, gauge colours, pair badge);
  - gauge taps: on a punched gauge (warning, no write); on a gauge the server shows punched but this copy doesn't (warning, no write, refresh and tick bump); need and un-need (other columns untouched; un-needing the last open gauge makes the job TurretDone, so it leaves the list);
  - Nested on and off, with the success and no-gauges banners;
  - nest label: save from OnChange and from Save (trimmed), clearing it, no write when unchanged; OnChange then Save writes once, Save then OnChange writes once, a different text still saves, a failed save shows the error and clears the key, and a label stored with extra spaces shows no Save button and isn't rewritten;
  - the timer pause count-down (2 cycles), the plain refresh, OnVisible (resets the pause and the key) and the Refresh button.
- Text widths, estimated with Liberation Sans (Arial metrics) at Size × 4/3 px, against the space inside each label: "NO SHIP DATE" about 113 px of 126; "Machine / day" about 102 of 131; "Today Oct 22" about 98 of 125; "Not nested only" about 130 of 145. The longer texts used before needed about 133, 153, 131 and 130 px.
