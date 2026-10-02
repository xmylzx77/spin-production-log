# scrBending: paste notes

This screen is **one paste**: `scrBending.yaml` (661 lines, 31 controls plus the screen). Every name contains `Ben`.

---

## Paste steps

```
PASTE 9 of 12: screen scrBending (new screen)
Before this: Pastes 1-8 done (App.OnStart, App.Formulas, scrHome, scrPunch, scrImport, scrAssembly, scrNesting, scrTurret). TheWhiteBoard connected.
             (This screen itself only needs Pastes 1-3: OnStart, Formulas and scrHome.)
Where: Tree view > Screens tab > right-click any screen > Paste. Copy ALL of scrBending.yaml
       (use the copy button; the first line is "Screens:", the last line is "            Visible: =false").
After: run the 3.4 checks. Expected: 0 errors. A new screen "scrBending" (no _1 at the end).
```

Paste 11 (App > StartScreen) names scrBending, so this paste must be done before Paste 11.

In Tree view, under scrBending, you should see:

- `conBenHeader`, holding lblBenTitle, lblBenSub, tglBenReady, lblBenReady, tglBenShowDone, lblBenShowDone, btnBenRefresh and btnBenHome
- lblBenCaption and lblBenCounts
- `galBenJobs` > `conBenCard`, holding recBenPairBar, lblBenModel, lblBenCust, lblBenShip, lblBenJob, btnBenPair, btnBenG12, btnBenG14, btnBenG16, btnBenG18, btnBenG20, btnBenG24, lblBenNoGauge, lblBenNest, btnBenPB and btnBenP4
- lblBenEmpty and tmrBenRefresh

If a formula shows "Name isn't recognized" for a control that does exist, use the "type a space" fix in guide 3.4. The formulas most likely to show it are the ones that read the two switches:

- galBenJobs.Items
- lblBenEmpty.Visible and lblBenEmpty.Text
- OnSelect on btnBenPB and btnBenP4

**App checker, Accessibility section.** App checker may list a few Accessibility items on this screen, for example about the focus border. Focus borders are turned off on purpose, because this is a touch screen. These items are expected. They are not errors and don't need a fix. Only red ⊗ marks on formulas count as errors.

If the paste fails, nothing is created. Send the exact error text, "Paste 9", and what was selected in Tree view (guide 3.7).

---

## What you should see

The list is already filled in the editor. The 30-second auto refresh only runs in Preview (**F5**).

- **Header:** "Bending" in teal, then the grey line "Brake & P4: punch status shown, mark bending done". On the right are a **Ready only** switch (off), a **Show complete** switch (off), a blue **Refresh** button and a grey **Home** button. Both switch labels show in full.
- **Under the header:** on the left, "Nested jobs in ship order (a pair stays together)". On the right, "Ready to bend: n      Waiting on punch: m". These count the nested jobs that still need PB or P4, whatever the switches are set to.
- **One card per job** that is Active and Nested. A job whose PB **and** P4 are both done is hidden until **Show complete** is on. **Ready only** also hides every job whose punching isn't finished.
- **Order:** soonest ship date first. A pair is kept together and sorts at the earlier ship date of its two jobs, with the earlier-shipping job on top. Jobs with no ship date are last.
- **Each card:**
  - **Top line:**
    - the product model in large type (the customer name when there's no model);
    - the customer (12 characters);
    - "📅 m/d", or a red "📅 NO SHIP DATE" when the ship date is blank (shown in full);
    - "#job-fan";
    - for a paired job, a small round number badge.
  - **Pair bar:** a paired job also has a coloured bar down its left edge, in the same colour as the badge. Both jobs of a pair have the same number and colour, matching the other screens.
  - **Second line:**
    - one round pill per **needed** gauge (12 14 16 18 20 24), packed to the left. Green = punched, yellow = still to punch. Tapping a pill does nothing.
    - "No gauges selected" when the job has none.
    - then the nest label ("no nest label" in grey italics when blank).
  - **On the right:** two big buttons, **✓ PB** and **✓ P4**. Grey = not done, green = done.
- **Dimmed cards:** a job that isn't fully punched yet has a darker card, grey text, and faded pills, badge and buttons. This is the "not ready to bend" look. The numbers on the faded pills and on the faded pair badge are light, so they stay readable. The buttons on a dimmed card still work.
- With nothing to show: "No nested jobs to bend right now." (or "Nothing is ready to bend right now (Ready only is on).").

## Manual test (Preview, F5)

Use TEST jobs, so nothing real changes. Make them with Punch > Add job (job # starting with TEST), then mark them Nested on the Nesting screen. Keep SharePoint open in another tab to check the values.

1. **List.** Open Bending (Home > Bending). Every nested TEST job shows. A TEST job that isn't Nested doesn't show. The jobs run from the soonest ship date down.
2. **Pair.** In Punch, pair two nested TEST jobs that have different ship dates. On Bending they sit next to each other, with the earlier-shipping one on top. Both have the same number badge and the same colour bar.
3. **Dimmed, then ready.** A TEST job with a yellow pill is dimmed. Tick that gauge on the SB8 or SB15 screen. Within 30 s (or after you tap **Refresh**), the pill here turns green and the card is no longer dimmed. "Ready to bend" goes up by 1 and "Waiting on punch" goes down by 1. If that job is paired, its badge number is light while the card is dimmed and dark once it's bright.
4. **Ready only.** Turn **Ready only** on: the dimmed cards disappear. Turn it off: they come back.
5. **✓ PB.** On a TEST job, tap **✓ PB**. It turns green. In SharePoint, PBDone = Yes and P4Done is unchanged. Tap it again: it turns grey, and PBDone = No.
6. **Finish a job.** On a TEST job, tap **✓ P4**, then **✓ PB**.
   - The card leaves the list.
   - A green banner says "TEST...-1 finished on PB and P4. Turn on Show complete to see it again."
   - In SharePoint, both are Yes.
7. **Undo with Show complete.** Turn **Show complete** on: that job is back with both buttons green. Tap **✓ P4**: it turns grey (P4Done = No in SharePoint), and no banner shows. Turn **Show complete** off: the job stays, because it isn't complete any more.
8. **Two tablets.** Open Bending on two devices, A and B.
   - (a) Turn on **Show complete** on both devices first (otherwise the second tap finishes the job and the card leaves). On device A, tap **✓ PB** on a TEST job. Within a few seconds, tap **✓ P4** on the same job on device B. Both buttons stay green, and SharePoint shows PBDone and P4Done both Yes. Device A shows B's tick within 30 s without anyone tapping. (This is go-live test (4) and (5) in list-design.)
   - (b) Turn **Show complete** off on both devices. On another TEST job, tap **✓ P4** on device A. A few seconds later, before B refreshes, tap **✓ PB** on device B. On B, the card leaves the list **and** the green "finished" banner shows. If the card leaves but no banner shows, see U-g.
   - (c) **Scroll position.** On one device, scroll down the list and wait 30 s without tapping. The list must not jump back to the top. Then tap a button on a card further down: the list must not jump to the top either. Report it if either happens (U-e).
9. **No gauges.** A nested TEST job with no gauges selected shows "No gauges selected" and is dimmed. It disappears when **Ready only** is on.
10. **Text fits.** On a TEST job with no ship date, the whole red "📅 NO SHIP DATE" shows, not cut. In the header, "Ready only" and "Show complete" show in full.
11. **Home.** Tap **Home**: you go to the home screen.

Afterwards, set the TEST jobs to Dismissed in Punch.

---

## Assumptions and decisions (each with its fallback)

| # | What I did | Why | If you want it different |
|---|---|---|---|
| A1 | **Which jobs:** Active && Nested. A job with PBDone && P4Done is hidden unless **Show complete** is on. **Ready only** also requires TurretDone. Incoming jobs never show. | app-spec scrBending; list-design status model. bending.js leaves out incoming jobs too. | None needed. |
| A2 | **Order:** GroupShipKey, then PairKey, then ShipKey, then ID (CONTRACT 5.1 "Bending"). The pair's group ship date counts every active member, so a pair whose other half is hidden still sorts at the pair's earliest date. A member can be hidden because it's already complete or not nested yet. bending.js most likely used only the jobs on screen. | app-spec: "GroupShip, then PairNo, then ShipDate, then ID", and GroupShip = "the earliest ShipDate in the job's pair". list-design pitfall 11; CONTRACT 3.4. | Ask, if a pair should sort only by the members on screen. This needs a different group key in App.Formulas. |
| A3 | **Dimmed look.** Power Apps has no opacity setting (guide 7.3). A card that isn't TurretDone gets: <br>• a darker card (`ColorFade(clrCard, -40%)`); <br>• main text in clrMuted, and secondary text faded 40%; <br>• pills and the pair badge faded 50% (CONTRACT 9.3); <br>• the PB and P4 buttons faded 45%. <br>The pill numbers and the pair badge number on a dimmed card are light (clrText), so they stay readable on the faded colours: 4.5:1 to 6.7:1, against 2.2:1 to 3.2:1 with dark text. | app-spec: "about 45% opacity look", with readable text. | If the dimmed PB and P4 buttons are too hard to see, apply **P2** (they keep full colour on every card). |
| A4 | **PB and P4 still work on a dimmed card.** | bending.js allows it, and the spec doesn't block it. | Ask, if bending must be refused before punching is finished. |
| A5 | **Success banner** (green, 4 s) when a tap finishes a job and it leaves the list. It names the job and says how to get it back. No banner shows when Show complete is on, because the card stays. The banner is decided from the row SharePoint returns after the save (`With({saved: Patch(...)}, ...)`), not from the card as last loaded. So it is right even when the other tick was made on another tablet a few seconds earlier, and no extra query runs. | The card vanishes from under the bender's finger. The banner says which job it was, so a wrong tap can be undone. bending.js had no banner. | Apply **P1** (the plain CONTRACT 6.1 write, with no banner). |
| A6 | **Extras not in app-spec:** <br>• the caption and the "Ready to bend / Waiting on punch" counts; <br>• a **Refresh** button in the header (CONTRACT 9.1/7.2); <br>• a coloured bar on the left edge of paired cards (like bending.js's coloured left border). | They're read-only and help the floor. | Ask to remove any of them. |
| A7 | The subtitle label stretches and the title has a fixed width. CONTRACT 9.1 says "only the title stretches"; here the title and subtitle together are the title area. | Keeps the subtitle next to the title. | None needed. |
| A8 | **Pair badge** shows `PairRank` and uses `PairColor` (CONTRACT D4/D5), not PairNo. | The same number and colour as on every other screen. | None needed. |
| A9 | **Card title** = ProductModel. When that's blank, the customer name. When both are blank, "(untitled)". | bending.js (`run_string \|\| job_name \|\| '(untitled)'`). | None needed. |
| A10 | **No ship date:** red "📅 NO SHIP DATE" (CONTRACT 9.3), sorted last. bending.js showed nothing. | Makes the missing date visible. | None needed. |
| A11 | **Gauge pills** show needed gauges only, packed to the left, 40 x 32 (pitch 46, CONTRACT 9.4/6.2). They're read-only: no OnSelect and no colour change when pressed. A job with none shows "No gauges selected" (the turret's wording; bending.js said "no gauges"). | app-spec, CONTRACT 9.4. | None needed. |
| A12 | **Blank nest label:** "no nest label" in grey italics (bending.js: "— no label —"). | Plain ASCII text. | None needed. |
| A13 | **Top-line widths** (measured with Open Sans, the default font): <br>• model, X 18, W 410: a 24-character model needs about 389 px; <br>• customer, X 436, W 165: "MIDWEST MECH" needs about 151 px; <br>• ship, X 606, W 175: "📅 NO SHIP DATE" needs about 164 px; <br>• job, X 786, W 160: "#8481557-12" needs about 130 px; <br>• badge at X 956. <br>Header: "Ready only" is 110 wide and "Show complete" is 150. | Nothing is cut on a normal job. | None needed. |

### Property patches (guide 3.6; formula-bar text, no leading `=`)

| Patch | Screen | Control | Property | New formula |
|---|---|---|---|---|
| P1 | scrBending | btnBenPB | OnSelect | block P1-PB |
| P1 | scrBending | btnBenP4 | OnSelect | block P1-P4 |
| P2 | scrBending | btnBenPB | Fill | `If(ThisItem.PBDone, clrGreen, clrGrey)` |
| P2 | scrBending | btnBenPB | Color | `If(ThisItem.PBDone, clrPage, clrText)` |
| P2 | scrBending | btnBenP4 | Fill | `If(ThisItem.P4Done, clrGreen, clrGrey)` |
| P2 | scrBending | btnBenP4 | Color | `If(ThisItem.P4Done, clrPage, clrText)` |

P1-PB:
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

P1-P4:
```
With({id: ThisItem.ID, v: !ThisItem.P4Done},
    IfError(
        Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {P4Done: v}),
        Refresh(TheWhiteBoard);
        IfError(
            Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), {P4Done: v}),
            Notify("Save failed: " & FirstError.Message, NotificationType.Error, 0)
        )
    )
)
```

## Uncertainties and fallbacks

| # | What could differ in Studio | How you'll notice | Fallback |
|---|---|---|---|
| U-a | **"Name isn't recognized"** right after the paste (guide U3). These formulas read tglBenReady or tglBenShowDone: <br>• galBenJobs.Items; <br>• lblBenEmpty.Visible and lblBenEmpty.Text; <br>• the OnSelect of the two big buttons. <br>The switches come earlier in the same paste, so this isn't expected. | A red ⊗ on those formulas. | The "type a space" fix in guide 3.4. |
| U-b | **Other people's ticks** showing after the 30 s refresh (guide U9, CONTRACT 7.5). | Test step 8a: device A never shows B's tick. | Report it. This is the shared go-live gate; don't add collections. |
| U-c | **Two tablets ticking PB and P4 on one job at the same moment.** The write helper re-reads the row and retries once (list-design pitfall 3). | Test step 8a: a red "Save failed" banner, or one tick doesn't stick. | Tap again. Report it if it happens more than rarely. |
| U-d | **The ✓ and 📅 symbols** on a tablet (guide U12). | A box shows instead of the symbol. | Report the device. The text can be swapped for plain words ("PB done", "Ship"). |
| U-e | **Scroll position.** The list is rebuilt after every save **and** on every 30-second timer refresh. If Studio resets the scroll each time, a bender who has scrolled down is sent back to the top, even without tapping. | Test step 8c: the list jumps to the top after a tap, or after 30 s with no tap. | Can't be tested offline. Report it, with which of the two cases happens. |
| U-f | **The button while it saves.** The buttons keep Studio's AutoDisableOnSelect (on), so a double tap can't write twice. While it saves, a button shows a slightly darker shade of its own colour (DisabledFill). | A brief darker flash after a tap. That's expected. | None needed. |
| U-g | **The "finished" banner reads the row that the save returns.** Learn says Patch returns the modified record. The banner assumes this record holds the job's current PBDone **and** P4Done from SharePoint, including a tick made on another tablet. If the record held only the changed column, no banner would show. Nothing wrong is ever written or shown. | Test step 8b: the card leaves but no banner shows. Or a red ⊗ on a button's OnSelect after the paste. | For a red ⊗: apply **P1**. For a missing banner: report it. The banner is optional, so P1 is also fine. |

## Requests for App.Formulas / CONTRACT

**App.Formulas:** none. The screen uses only existing names:

- `ActiveJobs`, with these columns: Nested, PBDone, P4Done, Need12..24, Done12..24, TurretDone, NeedCount, ProductModel, JobName, CustShort, ShipDate, ShipText, JobLabel, NestLabel, PairNo, PairRank, PairColor, GroupShipKey, PairKey, ShipKey, ID;
- the `clr…` colours;
- `gblRefreshTick`.

**CONTRACT** (proposed changes to the shared templates). Each one already has a local workaround in this screen's YAML, so nothing here blocks the paste.

1. **9.3 gallery template.** Add `FocusedBorderThickness: =0`. The Gallery template's default is 4, and guide rule 11 says to set it. Local: set on galBenJobs.
2. **9.3 "Dimmed card" and 9.6 pair badge.** On a dimmed card, text on a fill faded 50% should be clrText, not clrPage. Dark text on a faded pair colour has a contrast of only 2.2:1 to 3.2:1. Local: btnBenPair `Color: =If(ThisItem.TurretDone, clrPage, clrText)`, the same as the gauge pills.
3. **9.2 header toggle.**
   - Add `AccessibleLabel` (the text of the label next to it), so App checker doesn't flag the switch. Local: on tglBenReady and tglBenShowDone.
   - The label width 140 is too narrow for "Show completed" at Size 14. It needs about 145 px, and 135 px is available after the default right padding. Use 160. Local: "Show complete" here is 150 wide.
4. **6.1 write helper.** Note that a button may wrap the Patch as `With({saved: Patch(...)}, ...)` to read the saved row. This screen does it for the banner (A5). It adds no `TheWhiteBoard` read. If the contract prefers the plain shape everywhere, apply P1.

## Open issues

- **U-e scroll position:** whether the list jumps to the top on a save or a timer refresh. Only Studio can show this (test step 8c).
- **U-g banner:** whether the "finished" banner appears in the two-tablet case. Only Studio and SharePoint can show this (test step 8b). P1 is the fallback.
- **Long manual job numbers.** lblBenJob is 160 wide, which fits about 12 characters of "#job-fan" at Size 16 bold. CASMFG labels (#8481557-12) fit. A long typed job # such as "#TESTJOB12-12" (about 156 px) loses the end of its last character. It can't be widened without moving the pair badge.
- **Customer names** are cut to 12 characters (CustShort). A name made of very wide capitals (W, M) can still be cut at 165 px. The full name shows in the tooltip.
- **A2 order:** a pair sorts at its earliest active member's ship date even when that member is hidden. This follows app-spec and CONTRACT 3.4; bending.js most likely used only the jobs on screen. Ask the user if the original behaviour is wanted.
- **Other screens (not changed here):** scrTurret's lblTurShowDone is 130 wide with "Show complete" at Size 14, the same clip that was fixed here. CONTRACT 9.2's 140 for "Show completed" is also too narrow (request 3).

## Data and contract compliance

- **TheWhiteBoard** is touched only in two ways:
  - `Patch(TheWhiteBoard, LookUp(TheWhiteBoard, ID = id), …)`, 4 times (first try and retry, for PB and for P4);
  - `Refresh(TheWhiteBoard)`: in OnVisible, the Refresh button, the timer, and the helper's retry.
- Everything shown reads `ActiveJobs` (in memory), so no delegation warning is expected. Report any you see. The banner reads the record that Patch returns, not a new query.
- **Every write** is the CONTRACT 6.1 helper:
  - values frozen in `With`;
  - base record `LookUp(TheWhiteBoard, ID = id)`;
  - `IfError`, then Refresh, retry once, then `Notify(..., NotificationType.Error, 0)`;
  - `ThisItem`, never `Selected`.
- The only addition is the optional success banner. Each Patch sits in a `With({saved: …})` whose body shows the banner when the saved row has both ticks and Show complete is off. A failed Patch makes that body an error, so `IfError` still sees it and runs the retry or the error message. Each button patches only its own column:

  | Control | Column |
  |---|---|
  | btnBenPB | PBDone |
  | btnBenP4 | P4Done |

- The gauge pills, pair badge and switches never write.
- There are no collections, no `AllItems`, no `Coalesce(x, "")`, no new global variables and no context variables.
- **Refresh:** `tmrBenRefresh` runs every 30 000 ms (CONTRACT 1 and 7.1) with `AutoPause` on. OnVisible and the Refresh button both run `Refresh(TheWhiteBoard); Set(gblRefreshTick, gblRefreshTick + 1)` (CONTRACT 7.2).

## Offline verification done (2026-10-02, after both reviews)

- **palint:** `python3 tools/palint.py` reports 0 errors and 0 warnings on this file alone (32 names). Together with every screen file present, it also reports 0 errors and 0 warnings (425 names, no duplicates).
- **Properties:** all 454 control properties exist in the Sept 2026 Studio control templates for their control types. That includes `AccessibleLabel` on Classic/Toggle 2.1.0 and `FocusedBorderThickness` on Gallery 2.15.0.
- **Type check:** all 456 formulas type-check in the Power Fx 1.8.1 interpreter, in default and V1 mode. They were checked against the current App.Formulas and sample TheWhiteBoard rows (Notify and Refresh stubbed), each in its gallery-row context. This includes the new `With({saved: Patch(...)}, ...)` OnSelect.
- **Behaviour:** 108 assertions pass (today = Fri 2026-10-02), in default and V1 mode. The 87 original assertions cover:
  - the order with each of the four switch combinations, the counts, and both empty-list messages;
  - the card texts, the pair badge, and gauge pill packing;
  - bright and dimmed colours;
  - PB and P4 on and off;
  - finishing a job, undo with Show complete, a dimmed card, and a missing row.

  21 new assertions cover:
  - **Two tablets, stale card:** P4 is ticked elsewhere after the last refresh, then PB is tapped here. Both ticks are saved, the card leaves, and the banner shows.
  - **The reverse:** P4 is unticked elsewhere, then PB is tapped. The card stays and no banner shows.
  - **Retries:** the first save fails and the retry works (one refresh, saved, banner). Both tries fail ("Save failed: …", nothing written, no banner).
  - **Unticking** never shows the banner.
  - **Pair badge text:** dark on a bright card, light on a dimmed one.
- **Text widths:** measured with Open Sans at the template's point size (A13). Nothing on the card or header is cut for normal data.
