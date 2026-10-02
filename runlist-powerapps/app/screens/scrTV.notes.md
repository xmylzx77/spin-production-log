# scrTV: paste notes

This screen comes in **two pastes**, 10a and 10b. Together they hold 46 controls plus the screen, and every name contains `Tv`. The only context variable is `locTvPage`.

| Paste | File | Lines | Goes into |
|---|---|---|---|
| 10a | `scrTV.1.yaml` | 163 | a new screen: header, column titles |
| 10b | `scrTV.2.yaml` | 748 | the screen itself (right-click **scrTV**): the board (`galTvBoard`) and the two timers |

**Round 2 (two reviews applied, 2026-10-02).** The screen used to be one 884-line paste. It is now two pastes, and controls were added and removed. **If the round-1 scrTV is already pasted:** right-click scrTV > **Delete**, then do pastes 10a and 10b (guide 3.5). A list of single property patches would be longer than the two pastes. "Changes in round 2" at the end lists what changed and why.

The TV is **read-only**. Nothing on this screen writes to the list:
- there is no Patch, edit box, switch or drop-down;
- the gauge pills, the Nested pill and the pair badge are buttons with no action, so tapping them does nothing;
- the only control that does anything when tapped is **Home**, and it only navigates.

---

## Paste steps

```
PASTE 10a of 12 (scrTV part 1 of 2): screen scrTV (new screen)
Before this: Pastes 1-9 done (App.OnStart, App.Formulas, scrHome, scrPunch, scrImport, scrAssembly,
             scrNesting, scrTurret, scrBending). TheWhiteBoard connected.
             (This screen only needs Pastes 1-3: OnStart, Formulas and scrHome.)
Where: Tree view > Screens tab > right-click any screen > Paste. Copy ALL of scrTV.1.yaml
       (use the copy button; the first line is "Screens:" and the last is "            Y: =70").
After: run the 3.4 checks. Expected: 0 errors. A new screen "scrTV" (no _1 at the end).
       It shows the header and the three column titles ("Punch day", "SB-8 · n to punch",
       "SB-15 · n to punch"). The board stays empty until Paste 10b.
```

```
PASTE 10b of 12 (scrTV part 2 of 2): the board and its two timers
Before this: Paste 10a done.
Where: Tree view > right-click scrTV (the SCREEN itself, not conTvHeader or a label) > Paste.
       (If Paste isn't in the menu: click scrTV once, then press Ctrl+V.)
       Copy ALL of scrTV.2.yaml: the first line is "- galTvBoard:" and the last is "      Visible: =false".
After: run the 3.4 checks. Expected: 0 errors. In Tree view, galTvBoard, tmrTvRefresh and
       tmrTvPage sit directly under scrTV, at the same level as conTvHeader, and the board fills in.
       If they landed inside conTvHeader instead, press Ctrl+Z and paste again with scrTV selected.
```

Paste 11 (App > StartScreen) names scrTV, so do both pastes before Paste 11.

In Tree view, under scrTV, you should see:

- `conTvHeader`, holding lblTvTitle, lblTvPage, lblTvDate, lblTvClock and btnTvHome
- lblTvColDay, lblTvColS8 and lblTvColS15
- `galTvBoard`, holding recTvDayBg, recTvSep, lblTvDayName, lblTvDayInfo, `conTvCardS8` (lblTvJobS8, lblTvSizeS8, lblTvShipS8, lblTvNotesS8, lblTvCustS8, btnTvPairS8, btnTvG12S8 … btnTvG24S8, btnTvNestedS8), lblTvEmptyS8, `conTvCardS15` (the same with S15) and lblTvEmptyS15
- tmrTvRefresh and tmrTvPage

Studio may list the controls in reverse order, with the newest at the top. Either order is fine.

If a formula shows "Name isn't recognized" for something that does exist, use the "type a space" fix in guide 3.4. The most likely case is btnTvHome.OnSelect, if scrHome was pasted after this screen. No formula refers to galTvBoard or the timers, so Paste 10b should not cause any.

If a paste fails, nothing is created. Send the exact error text, the paste number ("10a" or "10b") and what was selected in Tree view (guide 3.7).

---

## What you should see

The board fills in while you're still editing. The timers (refresh every 60 s, page turn every 30 s) only run in Preview (**F5**) or in the played app.

- **Header:** "The White Board" in large letters. On the right are the date ("Wednesday, September 30" fits in full), a large clock ("12:58 PM" fits in full) and a small grey **Home** button. "Page 1 of 3" appears only when the board needs more than one page.
- **Column titles:** "Punch day" over a narrow left column, then "SB-8 · n to punch" in light blue and "SB-15 · n to punch" in violet. n is the same number Punch shows: every placed, active job on that machine that isn't turret-complete. That **includes unscheduled jobs**, which the TV doesn't show, just as on the old board.
- **The board:** one line per row. Each row has the day cell on the left, an SB-8 card in the middle and an SB-15 card on the right.
  - Days run in date order:
    - past days with unpunched work come first, with a red-tinted day cell reading "Overdue · n jobs";
    - then **today** (blue day cell, "Today · n jobs");
    - then the next 5 days, plus any later day that has jobs.
  - **No Unscheduled band.** Jobs with no punch day are not on the TV.
  - A day more than 400 days from today shows with its year, e.g. "12/1/2027". That is almost certainly a mistyped punch day. Punch shows the same day as its own band with the same label (request R1 is now in App.Formulas), so open the job there (✎) or with **Find job #** and fix it.
  - A day with 3 SB-8 jobs and 1 SB-15 job takes 3 rows. The SB-15 card is on the first row, and the SB-15 side of the other two rows is empty.
  - A machine with nothing on a day shows "No jobs" in grey italics. An empty upcoming day still gets one row ("No jobs" on both sides), so the next 5 days are always visible.
  - A grey line separates the days.
  - Cards in a day follow the Punch board order: pairs together, then the supervisor's ▲▼ order.
- **A card** has 2 lines:
  1. On the left: the job-fan (large, bold), "Size n" (red **SET SIZE** if blank) and 📅 ship m/d (red **📅 NO SHIP DATE** if blank). Then the job's **notes** in grey italics, on one line, cut off before the pair badge. On the right is the pair badge, a coloured number with the same number and colour as on Punch, SB8/SB15 and Bending. A paired card also has a border in the pair colour.
  2. Six gauge pills, 12 to 24: grey = not needed, yellow = needed, green = punched. Then the Nested state (green "✓ Nested" or grey "Not nested"), then the customer (12 characters).
- **Pages:** the TV can't scroll, so it shows 9 rows at a time and turns to the next page every 30 seconds. After the last page it goes back to page 1.
  - When a day carries on to the next page, that page's first row repeats the date with "(continued)".
  - With 9 rows or fewer, there is no page number and nothing turns.

---

## Manual test (Preview, F5; about 10 minutes)

Use a job number like `TEST` for anything you create, and dismiss it in Punch afterwards.

1. **Opens and fills.** Select scrTV in Tree view and press **F5**. The title, date and clock show. Today's day cell is blue, and the next 5 days each have a row, even empty ones ("No jobs").
2. **Same jobs as Punch.** Open scrPunch in another browser tab, with Show completed **off**.
   - For one day, the TV's SB-8 and SB-15 cards are the same jobs, in the same order, as Punch's SB8 and SB15 bands for that day.
   - Punch's Unscheduled jobs are **not** on the TV.
   - The TV's "SB-8 · n to punch" and "SB-15 · n to punch" equal Punch's column counts exactly.
3. **Card details.** On one card, check the job-fan, Size, 📅 ship and customer. Check that the yellow and green pills match that job on Punch, and that the Nested state and the pair badge's number and colour match too.
   - Then make a TEST job with **no size, no ship date and a note**.
   - Its card shows "SET SIZE" and "📅 NO SHIP DATE" in full, in red, with the note after them in grey.
   - Change the note in Punch, and the TV shows the new text within a minute.
4. **Read-only.** Tap a gauge pill, the Nested pill, a pair badge and a card. Nothing changes, and no box or panel opens. In SharePoint, that job's **Modified** time hasn't changed.
5. **Live update (60 s).** Leave the TV in Preview.
   - On another device or tab, open SB8 (scrTurret) and tick the last yellow gauge of a job shown on the TV. Within about a minute the job disappears from the TV, and "SB-8 · n to punch" drops by 1.
   - Tap **Nested** on a card in Punch. The TV's Nested state changes within a minute.
6. **Pages.** If "Page 1 of N" shows, wait 30 seconds and the page turns. A day split over two pages shows its date again with "(continued)". After page N it returns to page 1. If your board fits on one page, give 2-3 TEST jobs on one machine the same punch day in Punch until it doesn't.
7. **Clock and date.** The clock is never more than about 30 seconds behind the real time, and between 10:00 and 12:59 the whole time shows, "AM"/"PM" included. The date shows the full weekday and month.
8. **Deep link on the TV.** On the TV, open the app's bookmark ending in `&screen=tv`. It opens straight on this screen. Leave it 5 minutes: the clock moves and the pages turn. **Home** goes to the home screen.
9. **Can't reach the list (optional).** On a laptop in Preview, turn Wi-Fi off for 2 minutes.
   - The board keeps the last data it had, and the clock keeps moving.
   - Power Apps may show its own red error bar. That is normal; this screen has no warning of its own (decision 5).
   - Turn Wi-Fi back on. Within a minute a change made on another device shows up.

---

## Design decisions (each with its fallback)

| # | Decision | Why | If you don't like it |
|---|---|---|---|
| 1 | **Paging: 9 rows per page, 30 s per page.** | A wall TV can't scroll, and the board (6+ days × 2 machines) is usually taller than one screen. Without paging, the TV would only ever show the first screenful. 30 s is the contract's shortest timer (7.4). | Ask the agent for "scrTV without paging". The gallery then shows every row and scrolls with a mouse. |
| 2 | **Rows instead of band headers.** Each row holds the k-th SB-8 card and the k-th SB-15 card of a day, with the date in a left column. | Every row is the same height (72 px), so the gallery needs no flexible height (guide U4 doesn't apply here). Rows also make clean pages, and the two machines' days still line up side by side, as on the old board. | None needed. Within a day, the jobs, the filter and the order are exactly Punch's (contract 5.1, "TV band"). The list of days is built on this screen (decision 10). |
| 3 | **Counts** in the column titles are Punch's counts: every placed, active, not turret-complete job on the machine, unscheduled ones included. (Round 2. Round 1 counted only scheduled jobs.) | This matches scrPunch's column titles and the old board's `render()`, which counted unscheduled jobs even on the TV. The wall and the supervisor screen now show the same number. | Patch P3: count only what the TV shows. |
| 4 | **The clock** updates when the refresh tick **or** the page changes (contract 7.3 plus `0 * locTvPage`), so every 30 s instead of every 60 s. | It keeps the clock closer to real time with no extra timer. A stopped clock also tells you the app has stopped. | None needed. |
| 5 | **No "not updated" warning.** (Round 2.) The refresh is exactly the contract's (7.1/7.2): `Refresh(TheWhiteBoard); Set(gblRefreshTick, gblRefreshTick + 1)`. | Round 1 wrapped the refresh in `IfError` to show an amber "Not updated since" warning. Microsoft documents that Refresh returns nothing, and that IfError's arguments must currently have compatible types. So the warning would most likely never have appeared, or both formulas would have shown red and the board would never refresh. The plain form is the one every other screen uses. | Ask the agent for a stale-data warning, but only after a one-off Studio test shows that `IfError(Refresh(TheWhiteBoard), …)` really catches an offline refresh. |
| 6 | **Bigger text** than the contract's card sizes: title 30, clock 28, job-fan 18, other card text 14-15, pills 13 (pill pitch 48, not 46). Widths were sized to the longest text, measured: clock 180 px, date 280 px, Size 96 px, "📅 NO SHIP DATE" 184 px. | It has to be readable from across the shop, and nothing gets cut off (round 2 fixed the clock, the date, SET SIZE, NO SHIP DATE and "Overdue · 12 jobs"). | None needed. |
| 7 | **Cards show the job's Notes.** (Round 2.) They don't show the nest label, ✨ NEW or the moved-date flag. | The files disagree. list-design's Notes row says notes are "shown on … and on the TV", and the old TV cards showed them (`card-notes`). app-spec's scrTV card list leaves Notes out. list-design ranks higher (CONTRACT, opening paragraph), and scrTurret made the same call (its decision A4). **Question for you:** do you want notes on the wall? | Patch P1 hides them. Nothing else moves. |
| 8 | **Home button kept** (contract section 8: every screen except scrHome has one). | It only navigates; it doesn't write. | None needed. |
| 9 | **The customer is on card line 2**, after the Nested pill. (Round 2.) | That way the red "📅 NO SHIP DATE" (list-design's wording) fits in full on line 1, and a 12-letter customer gets 168 px, up from 163. | None needed. |
| 10 | **The list of days is built on this screen** (round 2): today and the next 5 days, plus every day that holds a TV job. On a normal board these are exactly the days of `Filter(PunchBandsOpen, BandKey > 0)` (checked offline). | `PunchBandsOpen` leaves out days more than 400 days from today, so a job with a mistyped year vanished from the TV while still being counted. App.Formulas can't be changed from this screen, so this is the local workaround for request R1. | None needed. R1 is now in App.Formulas (integration pass, 2026-10-02) and this screen's day list was checked equal to `Filter(PunchBandsOpen, BandKey > 0)` on every sample, far-away days included. Keep the local list; switching would be a re-paste for no change. |
| 11 | **Two pastes** (round 2). | The screen is 911 lines; guide 3.8 and U6 ask for under about 800 per paste. galTvBoard is a screen-level control, so 10b pastes onto the screen itself (guide 3.2), not into a gallery. No formula refers to galTvBoard or the timers, so nothing needs re-entering. (Round 1 said a split would mean pasting into the gallery. That was wrong.) | None needed. |

---

## Uncertainties and fallbacks

| # | Uncertainty | Fallback |
|---|---|---|
| 1 | Guide U1: control versions (`Label@2.5.1`, `Classic/Button@2.2.0`, `Gallery@2.15.0`, `GroupContainer@1.5.0`, `Rectangle@2.3.0`, `Timer@2.1.0`), the same as every other screen. | Guide U1. |
| 2 | Guide U12: 📅 and ✓ might show as boxes in the TV's browser. | Patch **P2** below (plain-text versions). |
| 3 | Browsers slow down timers in a **hidden** tab (guide 8.10). | Keep the app's tab in front, full screen (F11), and turn off the TV's (or PC's) sleep and screen saver. |
| 4 | Guide U9: whether the TV picks up other devices' changes after `Refresh(TheWhiteBoard)`. | This is covered by the go-live test (list-design step 20 (4)); manual test step 5 is the same check. If the TV never updates, report it. |
| 5 | The sign-in session on the TV can expire after a long time (tenant policy). | If the TV shows a sign-in page, sign in again with the TV account. Nothing on the board is lost. |
| 6 | The TV is assumed to be 16:9. The app is 1366 × 768 with Scale to fit on, so a 1080p or 4K TV just scales it up. | On a screen that isn't 16:9 you get dark bars at the edges; nothing is cut off. |
| 7 | Very busy boards: at about 60 open jobs, one full cycle is 3-4 pages (1.5-2 minutes). | That's fine for a wall display. If it ever gets too long, ask the agent for a denser card (one line per card). |
| 8 | Text widths were measured offline with Open Sans (the classic controls' default font) and an Arial-width font, without kerning. The tightest fits are "Page 10 of 12" (117 of 120 px), "Wed Sep 30" (120 of 125 px) and "Overdue · 12 jobs" (120 of 125 px). | If any label on the TV is cut off, send a photo and the label's name. The fix is a one-property patch. |
| 9 | Paste 10b relies on Studio adding pasted controls to the item you right-click (guide 3.2, VERIFIED by PnP). | If the three controls land inside conTvHeader, press Ctrl+Z and paste again with **scrTV** selected. |

### Property patches (guide 3.6; formula-bar text, no leading `=`)

| Patch | Screen | Control | Property | New formula |
|---|---|---|---|---|
| P1 (hide notes) | scrTV | lblTvNotesS8 | Visible | `false` |
| P1 (hide notes) | scrTV | lblTvNotesS15 | Visible | `false` |
| P2 (no emoji) | scrTV | lblTvShipS8 | Text | `If(IsBlank(ThisItem.J8.ShipDate), "NO SHIP DATE", "Ship " & ThisItem.J8.ShipText)` |
| P2 (no emoji) | scrTV | lblTvShipS15 | Text | `If(IsBlank(ThisItem.J15.ShipDate), "NO SHIP DATE", "Ship " & ThisItem.J15.ShipText)` |
| P2 (no emoji) | scrTV | btnTvNestedS8 | Text | `If(ThisItem.J8.Nested, "Nested", "Not nested")` |
| P2 (no emoji) | scrTV | btnTvNestedS15 | Text | `If(ThisItem.J15.Nested, "Nested", "Not nested")` |
| P3 (count only the cards on the TV) | scrTV | lblTvColS8 | Text | block P3-a |
| P3 (count only the cards on the TV) | scrTV | lblTvColS15 | Text | block P3-b |

The P2 ship texts fit their labels: "Ship 12/31" is about 99 of 104 px, and "NO SHIP DATE" about 141 of 184 px.

P3-a:
```
"SB-8  ·  " & CountRows(Filter(ActiveJobs, MachineText = "SB8" && PunchDayKey > 0 && !TurretDone)) & " to punch"
```

P3-b:
```
"SB-15  ·  " & CountRows(Filter(ActiveJobs, MachineText = "SB15" && PunchDayKey > 0 && !TurretDone)) & " to punch"
```

---

## Requests for App.Formulas / CONTRACT

| # | File | Request | Local workaround on scrTV |
|---|---|---|---|
| R1 | App.Formulas: `PunchBandsOpen` (and `PunchBandsAll`) | The `lo`/`hi` range is clamped to ±400 days from today. A not-turret-complete job whose punch day is further away gets no band: it disappears from Punch and was disappearing from the TV, but it is still counted. In round 1, a test job on 2027-12-01 was on no page but was counted in "SB-8 · 8 to punch" (review 2 #8). **Suggested fix:** build the dated bands from the 6-day window plus `Distinct(src, PunchDayKey)` instead of a continuous, clamped run of days. The TV's galTvBoard.Items shows the pattern: `PunchWindow` keys plus the used keys not in it, sorted. Consider adding the year to `Label` for days more than 400 days away, as the TV now does. | **Done** in the integration pass: App.Formulas now builds the bands from `PunchWindow` plus the used punch days, with the year in `Label` beyond 400 days. scrTV keeps its own (equal) list. |
| R2 | CONTRACT 3.5, "Uses: TV" | Until R1 lands, the line should say the TV builds its own band list (same days, without the 400-day limit), so a later agent doesn't "fix" it back. | **Done**: CONTRACT 3.5 now says scrTV keeps its own, equal list. |
| R3 | app-spec "scrTV" / list-design Notes row | They disagree about Notes on the TV (decision 7). One of them should change once the user has decided. | Notes are shown; P1 hides them. |
| R4 | CONTRACT 7 (optional) | There is no stale-data pattern. If a "not updated since" warning is wanted on the TV (or the floor screens), first prove once in Studio that `IfError(Refresh(TheWhiteBoard), …)` catches a failed refresh. Then add that pattern to 7.1/7.2. | None. The TV uses the contract's plain refresh (decision 5). |

---

## Data and contract compliance

- **Reads:** everything comes from `ActiveJobs` and `PunchWindow`, which are in memory. `TheWhiteBoard` appears only in `Refresh(TheWhiteBoard)`, in OnVisible and the 60-second timer. No delegation warnings are possible; one would be a bug.
- **Writes:** none. There is no Patch, Remove, Collect, SubmitForm, text box, switch, drop-down or date picker. The TV account can have Read permission only (list-design: RunList Viewers).
- **Days:**
  - The day list is today..today+5 (`PunchWindow`) plus every day with a TV job. This is the same as contract 3.5's `Filter(PunchBandsOpen, BandKey > 0)`, minus the 400-day limit (decision 10, request R1).
  - There is no Unscheduled band.
- **Cards:** `PunchBand = "SB8|" & <day> && !TurretDone`, sorted PunchGroupOrder, PairKey, PunchSort, ID. These are the same filter and order as scrPunch's band (contract 5.1, "TV band").
- **Counts:** `CountRows(Filter(ActiveJobs, MachineText = "SB8" && !TurretDone))`. That is scrPunch's lblPunColS8 formula, and the same for SB15.
- **Pair badge:** `Text(PairRank)` coloured `PairColor` (contract D4/D5).
- **Pills:** contract 9.4 colours. They are read-only: no OnSelect, and hover and pressed keep their own colours.
- **Refresh:** contract 7.1 and 7.2 exactly. tmrTvRefresh runs every 60000 ms (contract section 1), plus OnVisible. Both bump `gblRefreshTick`, so the board rolls over to the new day after midnight.
- **Names:** all `…Tv…` (guide 4.4). The only context variable is `locTvPage` (contract section 2). There are no new globals or collections.

---

## Offline verification done (round 2)

- **palint:**
  - 0 errors and 0 warnings on 10a alone (10 names), 10b alone (37 names) and the two together (47 names).
  - The same on every screen in this folder together: 426 names, no duplicates.
  - A separate scan found no inline formula with `:`, `#`, `{`, a non-ASCII character or a trailing space. Every one of the 14 `|-` blocks starts with `=` 2 spaces deeper than its key.
- **Properties:** all 692 control properties exist in the Sept 2026 Studio control templates (`pkgs/*.xml`).
- **Power Fx 1.8 interpreter** (default and V1 mode): the runs used the current `App.Formulas.txt`, with today = Fri Oct 2. All 694 formulas type-check and evaluate, and gallery-child formulas were run on 7 different rows.
  - **Main sample (30 rows), 84 asserts:**
    - every page shows the same rows, in the same order, as round 1, which proves the local day list equals `Filter(PunchBandsOpen, BandKey > 0)` on a normal board;
    - the counts equal scrPunch's formula: 9 (SB-8, unscheduled job included) and 16 (SB-15);
    - OnVisible and both timers behave as expected, including that the tick still moves when the refresh fails;
    - the card widths and positions are right, with and without a ship date.
  - **Far-date sample, 25 asserts:**
    - a job on 2025-08-01 is the first row and one on 2027-12-01 the last, labelled "8/1/2025" and "12/1/2027";
    - both are counted, and `PunchBandsOpen` leaves both out (the R1 gap);
    - a note containing a line break shows on one line;
    - the notes start further right on a card with no ship date.
  - **Empty board, 8 asserts:** 6 window rows, "No jobs", no page label and "0 to punch".
  - The interpreter caught one problem in a first draft: `win.BandKey` (column shorthand on a table) is flagged as deprecated. It was replaced with `LookUp`.
- **Text widths:** each label was checked against its longest text, measured with Open Sans and an Arial-width font:
  - clock "10:00 AM": 167 of 180 px;
  - date "Wednesday, September 30": 266 of 280 px;
  - title: 331 of 601 px;
  - "SET SIZE": 78-89 of 91 px;
  - "📅 NO SHIP DATE": 164-172 of 184 px;
  - "📅 12/31": 83 of 104 px;
  - customer "WOODWARD GOV" at 14: 158-164 of 168 px;
  - "Overdue · 12 jobs" at 11: 117-120 of 125 px;
  - "12/31/2027" day label: 107-115 of 125 px.
- **Layout** (card 596 × 64):
  - Line 1, Y 4-32: job 12-152, size 156-252, ship 256-360 (256-440 with no ship date), notes 368-554 (448-554), badge 558-586.
  - Line 2, Y 35-61: pills 12-296, Nested 304-414, customer 422-590.
  - Nothing overlaps and nothing leaves the card.
  - Header: 1334 px inside the padding, minus 4 gaps of 12 and fixed items of 680 px, leaves 606 px for the title.
- **Not testable offline:** the Studio paste itself (including where Paste 10b lands), how emoji render on the TV, and real font rendering.

---

## Changes in round 2 (from the two reviews)

- **Clock:** 150 → 180 px wide, so 10:00-12:59 is no longer cut off (review 1 #1, review 2 #1).
- **Date:** 230 → 280 px wide, keeping the full month name (review 1 #2). This also fixes review 2 #5, so the "mmm" format wasn't needed.
- **Card line 1:**
  - Size is 96 px wide (review 1 #4, review 2 #4).
  - Ship moves to X 256 and is 104 px wide, or 184 px with no ship date, so "📅 NO SHIP DATE" shows in full (review 1 #3).
  - The new notes label fills the rest of the line (review 2 #7).
- **Card line 2:** the customer moves here, at Size 14 and 168 px, after the Nested pill (review 1 #3). Pills are 48 px apart, not 50, to make room.
- **Day info:** Size 12 → 11, so "Overdue · 12 jobs" fits (review 1 #6, review 2 #6).
- **Refresh:** the IfError wrapper is gone. OnVisible and tmrTvRefresh are now contract 7.1/7.2 exactly. lblTvStatus and `locTvFailed`/`locTvUpdated` are removed (review 1 #7). That also settles review 1 #5, review 2 #2 and review 2 #9.
- **Counts:** they now include unscheduled jobs, as Punch and the old board do (review 2 #3).
- **Day list:** built locally, so no day is lost to the 400-day limit, with request R1 for App.Formulas (review 2 #8).
- **Split:** the screen is now two pastes, and the wrong reason given for one paste is corrected (review 1 #8).
- **Patch P2:** it now says "NO SHIP DATE", not "Ship NO SHIP DATE" (review 1 #9). The lblTvStatus row is gone.
