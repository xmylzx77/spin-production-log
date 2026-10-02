# scrPunch board fallback F2 (flat lists): replace instructions

This is fallback **F2** from the Punch notes (`app/screens/scrPunch.notes.md`, "Assumptions and uncertainties", row 1). Use it when the Punch board's day bands overlap or cut cards off (guide U4), and fallback F1 didn't fix it.

**What changes.** The board `galPunBoard` (one list of day bands, each holding an SB8 card list and an SB15 card list) is replaced by **two plain lists, one per machine**: `galPunSB8` on the left and `galPunSB15` on the right. Each list's rows are a day header followed by that day's cards for that machine. There are no lists inside lists any more, so nothing has to grow to fit.

**What stays the same.** The same day bands, header texts and colours, job counts, "No jobs" lines, card order, and the same cards: the card controls come from the **same files as before** (Paste 9 / 4f and Paste 10 / 4g), pasted again unchanged. Every button on a card (gauge pills, Nested, ▲ ▼, ✎, nest label ✓, the "moved from" tag) works exactly as before. The header, tray, banner, column titles, timers and panels are not touched. **Your own property patches on the cards or day labels are not kept**: step 1 has you note them, and step 7 has you put them back.

**What you will notice.**
- The two machines scroll **separately**. A day's SB8 cards and SB15 cards no longer sit side by side.
- A day header row is as tall as a card (guide U4: one row height for the whole list). The header sits right above its first card, with empty space above it that separates the days. A day with no jobs on that machine shows its header with "No jobs" under it.
- Each list starts with an empty strip of about 76 px under its column title (44 px when the first day has no jobs on that machine). That is the empty top of the first header row.
- The rows of the **whole list** move when a job earlier in it is added, moved, finished or dismissed. This shows after a refresh (every 60 s, paused while a panel is open) or when you flip **Show completed**. On the old board only that day's cards moved. A nest label you are typing can then be lost. It might also (uncertain) stay at the same spot in the list and so end up in another job's label box, when that job's saved label is the same (often: both empty). Type the label and tap ✓ straight away, and check the job number before you tap ✓.

---

## Files

| File | Lines | What it is |
|---|---|---|
| `app/fallbacks/scrPunch.board-F2-flat.yaml` | 188 | Paste F2: the two lists `galPunSB8` and `galPunSB15`, each with its day header labels and an **empty** card container (`conPunCardS8` / `conPunCardS15`) |
| `app/screens/scrPunch.6.yaml` | 686 | Paste 9 (notes: 4f), **unchanged**: the SB8 card controls. Pasted again, into the new `conPunCardS8` |
| `app/screens/scrPunch.7.yaml` | 686 | Paste 10 (notes: 4g), **unchanged**: the SB15 card controls. Pasted again, into the new `conPunCardS15` |

Why the cards aren't inside the F2 file: with them it would be one paste of about 1,600 lines, and the guide (3.8) keeps each paste under about 800. Pasting the two card files again also guarantees the cards are exactly the tested ones.

## What F2 replaces

| Paste | With F2 |
|---|---|
| Paste 4 (notes: 4a) | Keep all of it **except** `galPunBoard`, which you delete in step 2. F2 takes its place. |
| Pastes 5-8 and 11 (notes: 4b-4e, 4h) | Not affected. Don't paste them again. |
| Paste 9 (notes: 4f) and Paste 10 (notes: 4g) | Same files, **new place**: steps 5 and 6 below. Their old "Where" lines (`galPunBoard` → `galPunCardsS8` → `conPunCardS8`) no longer apply: those controls are gone. |
| Fallback F1 (TemplateSize patch on `galPunBoard`) | Superseded. `galPunBoard` no longer exists, so there is nothing to patch. Don't apply F1 after F2. |
| A later full re-paste of scrPunch (guide 3.5) | After Paste 4 (4a), do steps 2-6 of this page in place of the old Pastes 9 and 10. Then do Pastes 5-8 and 11 as written, and step 7 of this page last. |

## Names: delete first, then paste

F2 **reuses** six names from the old board: `conPunCardS8`, `conPunCardS15`, `lblPunBandS8`, `lblPunBandS15`, `lblPunEmptyS8`, `lblPunEmptyS15`. Pastes 9 and 10 reuse the 42 card control names (`lblPunJobS8` ... `lblPunNotesS8`, `lblPunJobS15` ... `lblPunNotesS15`). That is only allowed because **step 2 deletes `galPunBoard`, and with it every one of those controls** (51 in all). Never paste F2 while `galPunBoard` still exists: Studio would rename the new controls (`…_1`), and formulas could end up pointing at the old controls (guide 3.5). The two new names, `galPunSB8` and `galPunSB15`, are used nowhere else in the app.

---

## Steps (scrPunch is already pasted)

You need about 15 minutes. The app must be open in Studio for editing. "No new errors" below means no error other than those that were already there before step 2:
- the known one on `btnPunImport` ("scrImport isn't recognized"), while scrImport isn't pasted yet. It stays all the way through; that's normal;
- when building scrPunch fresh (see "Building scrPunch fresh with F2" below), also scrHome's screen buttons that are red since Paste 3. The build guide's fix-up step clears them (`02-build-the-app.md`).

### Step 1: Back up the old board

1. Press **Ctrl+S** (save).
2. Open **App checker** (stethoscope icon) and note which errors are listed now, if any. These are the errors that "no new errors" allows.
3. Note your own changes. Did you change any property, since Pastes 4, 9 and 10, on a **card control** (a control inside `conPunCardS8` or `conPunCardS15`) or a **day label** (`lblPunBandS8`, `lblPunBandS15`, `lblPunEmptyS8`, `lblPunEmptyS15`)? For example, Punch notes row 7 (plain words instead of ▲ ▼ ✓ ✨ 📅 ⚠) or row 13 (a card label's `Width`), or a fix an agent sent. If so, write down the control, the property and what you changed. Step 7 puts them back. (F1 on `galPunBoard` doesn't count: it is not put back.)
4. In **Tree view**, expand **scrPunch**, right-click **galPunBoard** → **Copy**.
5. Open Notepad, paste (**Ctrl+V**), and save the file as `galPunBoard-backup.txt`. It holds your changed formulas as they are now (for step 7), and you need it if you want to go back (see "Going back" at the end).

### Step 2: Delete the old board

1. In **Tree view** → **scrPunch**, right-click **galPunBoard** → **Delete**.
   This also deletes everything inside it: the day labels, `galPunCardsS8`, `galPunCardsS15`, `conPunCardS8`, `conPunCardS15` and all the card controls. That's intended; it frees their names.
2. Check: `galPunBoard` is no longer in Tree view. Open **App checker** (stethoscope icon): no new errors. Nothing else on any screen refers to the board.

### Step 3: Paste F2

```
PASTE F2-1 of 3: scrPunch board lists - file app/fallbacks/scrPunch.board-F2-flat.yaml
Before this: Paste 4 (notes: 4a) done, and step 2 done (galPunBoard deleted).
Where: Tree view → right-click the SCREEN name scrPunch → Paste.
       (If Paste isn't in the menu: click scrPunch once, then press Ctrl+V.)
       Don't have a gallery or a container selected when you paste.
After: run the 3.4 checks. Expected: no new errors.
       Tree view now has galPunSB8 and galPunSB15 directly under scrPunch.
       Expand them: galPunSB8 holds conPunCardS8, lblPunBandS8 and lblPunEmptyS8;
       galPunSB15 holds conPunCardS15, lblPunBandS15 and lblPunEmptyS15.
       No name ends in _1. If one does, galPunBoard wasn't deleted: delete galPunSB8
       and galPunSB15, go back to step 2.
       The cards are empty rounded boxes for now; steps 5 and 6 fill them.
```

If **Items** on `galPunSB8` or `galPunSB15` shows a red error (for example on `Table`, or "incompatible types"), first try the "type a space" fix (guide 3.4) on that Items formula. If the error stays, apply patch P1 in "If something goes wrong" below.

### Step 4: Put the two lists where the board was

A pasted control lands **on top of** everything on the screen, including the dark overlay and the Edit / Place / Find panels. Move both lists back to where `galPunBoard` was, between the column titles and the timers (CONTRACT 9.7: header, body, timers, then panels):

1. In Tree view, click **galPunSB8** once. Press **Ctrl+[** (Send backward) again and again, about 6 times, until `galPunSB8` sits between `lblPunColS15` and `tmrPunRefresh` in Tree view.
   Or: right-click **galPunSB8** → **Reorder** → **Send backward**, as often as needed.
2. Do the same for **galPunSB15**, until it sits between `galPunSB8` and `tmrPunRefresh`.
3. Check: in Tree view the order now runs `lblPunColS15`, `galPunSB8`, `galPunSB15`, `tmrPunRefresh` (Tree view may list it the other way round, from `tmrPunRefresh` up). `conPunFindPanel` and `conPunEditPanel` are still at the far end of scrPunch's list.

If the lists end up in a slightly different place (one press too many or too few, for example before `lblPunColS15`), that's harmless as long as they are behind `recPunOverlay` and the three panels. **Send to back** (Ctrl+Shift+[) also works on screen: the lists don't overlap the header, the tray, the ▶ strip, the banner or the column titles. It only puts them first in Tree view, before `conPunHeader`, instead of in the CONTRACT 9.7 order. The real proof is check 3 in step 7.

### Step 5: Paste the SB8 card controls again

```
PASTE F2-2 of 3: SB8 punch card again - file app/screens/scrPunch.6.yaml (same file as Paste 9 / 4f)
Before this: Steps 3 and 4 done.
Where: Tree view → scrPunch → expand galPunSB8 → right-click conPunCardS8 → Paste.
       (Or click conPunCardS8 once, then press Ctrl+V.)
       It must be conPunCardS8, the container INSIDE galPunSB8, not galPunSB8 itself.
After: run the 3.4 checks. Expected: no new errors.
       Expand conPunCardS8: it holds 21 controls, lblPunJobS8 to lblPunNotesS8, and no name ends in _1.
       Directly under galPunSB8 there are still only 3 items: conPunCardS8, lblPunBandS8, lblPunEmptyS8.
```

On the editing canvas the card may not show in the **first** row of the list. The first row is the one you edit (the template), and it is usually a day header, where the card is hidden. The later rows show the cards. Tree view is what counts here; Preview (F5) shows the whole list.

If the 21 controls landed **directly under `galPunSB8`** (next to `conPunCardS8` instead of inside it), they would show on the day header rows. Press **Ctrl+Z** once to undo the paste, then try again: click `conPunCardS8` once and press **Ctrl+V**. If undo doesn't remove them, delete `galPunSB8` and `galPunSB15` and start again at step 3.

If the card controls show red "isn't recognized" (or "Name isn't valid") errors on job columns such as `JobLabel`, `Need12` or `PairNo` while Items itself is fine, see "If something goes wrong".

### Step 6: Paste the SB15 card controls again

```
PASTE F2-3 of 3: SB15 punch card again - file app/screens/scrPunch.7.yaml (same file as Paste 10 / 4g)
Before this: Step 5 done.
Where: Tree view → scrPunch → expand galPunSB15 → right-click conPunCardS15 → Paste.
       It must be conPunCardS15, the container INSIDE galPunSB15.
After: run the 3.4 checks. Expected: no new errors.
       conPunCardS15 holds 21 controls, lblPunJobS15 to lblPunNotesS15, none ending in _1.
       Directly under galPunSB15: only conPunCardS15, lblPunBandS15, lblPunEmptyS15.
```

Same as step 5 if the controls land in the wrong place or show "isn't recognized".

### Step 7: Put back your changes, check, then save

1. **Your own changes** (from step 1; skip this if you noted none). Use guide 3.3 (formula bar). The old formula text is in `galPunBoard-backup.txt`.
   - **A card control:** make the same change again on the same control. If you had changed it on both machines' cards, do both: the `…S8` control and the `…S15` one.
   - **A day header** (`lblPunBandS8` / `lblPunBandS15`, for example the ⚠ or ·): **don't** paste the old formula back. It counts with `CountRows(ThisItem.CardsS8)`, which no longer exists. Make the same text change inside the new formula, which counts with `ThisItem.BandN`.
   - **A "No jobs" label** (`lblPunEmptyS8` / `lblPunEmptyS15`): put back only a `Text` change.
   - **Don't** put back anything you made on `galPunBoard`, `galPunCardsS8` or `galPunCardsS15` (they are gone), or F1.
2. **App checker**, Formulas section: no new errors. No delegation warnings (yellow triangles); one would be a bug, report it.
3. **Panels on top.** Press **F5** (Preview). Tap **+ Add job**: the dark overlay and the panel must cover both lists completely, and the cards must not show through or on top. Tap **Cancel**. Do the same with **Find** (type any job number, tap Find, then Close) and a tray card's **Place** (then Cancel). If a list draws over a panel, step 4 didn't take: repeat it for that list.
4. Press **Esc**, then **Ctrl+S**.

## Building scrPunch fresh with F2

If you are building the Punch screen for the first time and want F2 straight away:

1. Do Paste 4 (notes: 4a) as written in the build guide.
2. Skip step 1 here (there's nothing to back up), then do steps 2, 3 and 4.
3. Do steps 5 and 6 here **instead of** Pastes 9 and 10 (same files, new place).
4. Do Pastes 5-8 and 11 as written; they don't touch the board.
5. Do step 7 (skip its item 1: there is nothing to put back).

"No new errors" here allows scrHome's screen buttons that are still red from Paste 3 (see "Steps" above).

---

## What you should see (Preview, F5)

- Column titles "SB-8 · n to punch" and "SB-15 · n to punch", unchanged, with the SB8 list under the left title and the SB15 list under the right one.
- In each list, top to bottom: ⚠ Unscheduled (amber, only when a job has no punch day), past days still holding unfinished jobs (red-tinted), today (blue, "(today)"), the next 5 days, then any later day holding jobs. Both lists show the same days.
- Each header reads like "Fri Oct 2   (today)    ·    3 jobs", counting that machine's cards. Right under it are those cards, in the same order as before. A day with no cards on that machine: header, then "No jobs".
- Cards look and behave exactly as before (3 rows, pills, Nested, ▲ ▼, ✎, pair badge, label box, flags, notes).

Manual tests (Punch notes, "Manual test"): re-run tests 1-9 and 11, the 📅 moved-from tag part of test 10, and the "Show completed" check. Tests 2, 6 and 8 put a job into a day (tomorrow, another day, Unscheduled), so they check that a card lands at the end of the right machine and day in the new lists. Test 8 also checks the Unscheduled header and that Dismiss removes the card. The tag tap in test 10 is a card write. Plus these F2 checks:

| # | Do this | Expect |
|---|---|---|
| F2-a | Turn **Show completed** on, then off | Turret-complete cards appear darker in their day and disappear again; header counts change with them, in both lists. |
| F2-b | Tap **◀** on the tray, then **▶** | Both lists widen and move left, still lined up under their column titles; ▶ puts them back. |
| F2-c | Scroll each list to the very bottom | The last card shows in full. Each list scrolls on its own. |
| F2-d | With an amber "CASMFG moved…" banner showing (if any) | The column titles and both lists sit below the banner; nothing overlaps. |
| F2-e | Look at the right edge of a card while scrolling | The scroll bar runs in the small gap right of the cards; it doesn't cover ▼ or the pair badge. |
| F2-f | ▲ on the bottom card of a day with 3+ cards, then ▼ | It moves up one place, then back, within its own day, as before. |

---

## If something goes wrong

| Problem | Fix |
|---|---|
| A red error on `galPunSB8` or `galPunSB15` **Items** that the "type a space" fix doesn't clear (for example on `Table`, or "incompatible types") | Patch P1 below: the same rows built the guide U4 way, with `Ungroup`. If P1 shows an error too, see the paragraph after the P1 formulas. |
| After step 5 or 6, card controls show "isn't recognized" (or "Name isn't valid") on job columns such as `JobLabel`, `Need12` or `PairNo`, while Items itself has no error | That list's Items lost the card columns. Apply patch P1 to that list's Items, then run the 3.4 checks again. If the errors stay, see the paragraph after the P1 formulas. |
| Pasted names end in `_1` | `galPunBoard` (or an earlier F2 paste) still exists. Delete the controls you just pasted, delete what's left of the old board, and redo the step. |
| Card controls landed directly under the list, not in the card container | Steps 5 and 6: Ctrl+Z, then paste again with click + Ctrl+V. |
| A list is drawn over a panel | Step 4 for that list. |
| The scroll bar covers the ▼ button or the pair badge | Patch P2 below (hides the scroll bar; swiping and the mouse wheel still scroll). |
| Nothing above helps | "Going back" below, then report it (guide 3.7) with the error text and the step number. |

### Patch P1: Items with Ungroup (the guide U4 form)

Apply with guide 3.3 (formula bar, no leading `=`). It builds the same header and card rows as the pasted `Items`, but joins them the way guide U4 does: `Ungroup(Table({Rows: <header rows>}, {Rows: <card rows>}), Rows)`. Checked offline: same days, counts and card order as the old board and as the pasted `Items`, for both machines, Show completed on and off.

Both forms rely on the same thing: one table that holds both the header rows' columns and the card rows' columns. The pasted form gets it from `Table(<header rows>, <card rows>)`, which Learn documents (Table function: the result has the union of all columns). P1 gets it from `Ungroup` over a column that holds two different kinds of table, which Learn doesn't document. So P1 helps when Studio rejects `Table` with two tables, or types its result differently. It is **not** a sure cure for "incompatible types".

| Screen | Control | Property | New formula (paste into formula bar) |
|---|---|---|---|
| scrPunch | galPunSB8 | Items | formula P1-SB8 below |
| scrPunch | galPunSB15 | Items | formula P1-SB15 below |

P1-SB8:

```
With({show: tglPunShowDone.Value},
With({cards: Filter(ActiveJobs, MachineText = "SB8" && (show || !TurretDone))},
    SortByColumns(
        Ungroup(
            Table(
                {Rows: AddColumns(If(show, PunchBandsAll, PunchBandsOpen) As b, IsHeader, true, BandN, CountRows(Filter(cards, PunchDayKey = b.BandKey)))},
                {Rows: AddColumns(cards, IsHeader, false, BandKey, PunchDayKey)}
            ),
            Rows
        ),
        "BandKey", SortOrder.Ascending,
        "IsHeader", SortOrder.Descending,
        "PunchGroupOrder", SortOrder.Ascending,
        "PairKey", SortOrder.Ascending,
        "PunchSort", SortOrder.Ascending,
        "ID", SortOrder.Ascending
    )
))
```

P1-SB15:

```
With({show: tglPunShowDone.Value},
With({cards: Filter(ActiveJobs, MachineText = "SB15" && (show || !TurretDone))},
    SortByColumns(
        Ungroup(
            Table(
                {Rows: AddColumns(If(show, PunchBandsAll, PunchBandsOpen) As b, IsHeader, true, BandN, CountRows(Filter(cards, PunchDayKey = b.BandKey)))},
                {Rows: AddColumns(cards, IsHeader, false, BandKey, PunchDayKey)}
            ),
            Rows
        ),
        "BandKey", SortOrder.Ascending,
        "IsHeader", SortOrder.Descending,
        "PunchGroupOrder", SortOrder.Ascending,
        "PairKey", SortOrder.Ascending,
        "PunchSort", SortOrder.Ascending,
        "ID", SortOrder.Ascending
    )
))
```

**If P1 shows an error too** (or the card errors stay), Studio can't put header rows and card rows in one list, and F2 can't be used. Go back to the old board ("Going back" below). The backup includes F1 if you had applied it; leave F1 on if it helped. Then report it (guide 3.7) with the Items error text of both forms. The next fallback the agent can hand over is guide U4's second one: a `Vertical` day-band list with a fixed row height for the busiest day, where each day's cards scroll inside the band.

### Patch P2: hide a scroll bar

| Screen | Control | Property | New formula (paste into formula bar) |
|---|---|---|---|
| scrPunch | galPunSB8 (and/or galPunSB15) | ShowScrollbar | `false` |

### Going back to the old board

1. In Tree view, delete **galPunSB8** and **galPunSB15** (this also deletes the cards inside them).
2. Open `galPunBoard-backup.txt` in Notepad, **Ctrl+A**, **Ctrl+C**.
3. Tree view → right-click **scrPunch** → **Paste**. `galPunBoard` comes back with its cards. Check that no name ends in `_1`.
4. Click **galPunBoard** once and move it back as in step 4: **Ctrl+[** (Send backward) until it sits between `lblPunColS15` and `tmrPunRefresh`.
5. Step 7's checks (items 2-4), then **Ctrl+S**.

---

## How it works (for whoever maintains it)

- **Rows.** Each list's `Items` joins two tables into one with `Table(<header rows>, <card rows>)`. Learn's Table function page says `Table` takes records or tables, and the result's columns are the union of all their columns, blank where a row has no value.
  - Header rows are the band table (`PunchBandsOpen`, or `PunchBandsAll` with Show completed on) plus `IsHeader = true` and `BandN` (that machine's card count for the day).
  - Card rows are that machine's visible jobs (`Filter(ActiveJobs, MachineText = "SB8" && (show || !TurretDone))`) plus `IsHeader = false` and `BandKey = PunchDayKey`.
  - Together with the day-key match, this is the same set of cards as CONTRACT 3.5's `PunchBand = "SB8|" & BandYmd && (…)` filter. `PunchBand` is `MachineText & "|" & PunchYmd`, and `PunchYmd` and `PunchDayKey` come from the same `PunchDay` (Unscheduled: `""` and `0`). `BandN` counts the same cards.
  - A card row has every ActiveJobs column the card controls read.
  - Guide U4 builds the flat list with `Ungroup(Table({Rows: …}, {Rows: …}), Rows)` from two row tables with the **same** columns. Here the two have different columns, and `Ungroup` over two different table types isn't documented, so that form is only patch P1. Both forms depend on the same column union.
- **Order.** `BandKey` (0 = Unscheduled first, then yyyymmdd), `IsHeader` descending (the header first), then the punch band sort from CONTRACT 5.1: `PunchGroupOrder`, `PairKey`, `PunchSort`, `ID`. Each band key in the band table matches exactly the cards' `PunchDayKey`, so every visible card falls under its own day's header.
- **Template** (one row height, `TemplateSize` 110, as the old card lists): `conPunCardS8` (the card, `Visible = !ThisItem.IsHeader`) and the two header labels (`Visible = ThisItem.IsHeader`; "No jobs" also needs `BandN = 0`). The header is drawn at the bottom of its row (Y 76, or Y 44 with "No jobs" at 78), so it sits 4 px above its first card, like the old band header. The same layout leaves the empty strip at the top of each list.
- **Widths.** Each list is 8 px wider than its cards (528 / 654 px; cards `Parent.TemplateWidth - 8` = 520 / 646, the old card widths), so the scroll bar runs in the gap between the columns and right of SB15. SB8 starts at X 308 (56 with the tray hidden), SB15 at 838 (712), as the old columns did. Height and Y are galPunBoard's (they move down when the banner shows).
- **The card files are unchanged.** Inside the new lists, `ThisItem` is a flat row that has every ActiveJobs column, and `Parent.Width` (the card container) is 520 / 646 px as before. ▲ ▼ filter the band with `PunchBand = c.PunchBand && (tglPunShowDone.Value || !TurretDone)`, which is exactly the set of cards the list shows under that day (CONTRACT 6.4 rule).
- Nothing outside the board changed: no App.Formulas or CONTRACT change is needed, no other screen refers to the board, and the list reads only `ActiveJobs` and the band tables (no `RunListJobs` query, so no delegation question).

## How this was checked offline

- **palint** (`tools/palint.py`):
  - the F2 file alone: 0 errors, 0 warnings, 8 names;
  - the F2 file with every `app/screens/*.yaml` exactly as they are: 6 errors, all "duplicate control name", exactly the six reused names above, each pointing at a control inside `galPunBoard` (which step 2 deletes);
  - the F2 file with every screen file, `scrPunch.1.yaml` taken **without** its `galPunBoard` block (the app after step 2): **0 errors, 0 warnings, 425 names**. Pastes 9 and 10 add no names beyond `scrPunch.6.yaml` / `scrPunch.7.yaml`, already counted.
- **YAML hygiene:** no tabs, CR, BOM or trailing spaces; every inline formula is under 100 characters with no `:`, `#`, `{` or non-ASCII; non-ASCII (⚠ ·) only inside string literals in `|-` blocks.
- **Properties:** all 110 F2 properties are in the Sept 2026 Studio control templates (Gallery 2.15.0, GroupContainer 1.5.0, Label 2.5.1).
- **Power Fx 1.8 interpreter** (current `App.Formulas.txt`, sample rows). The pasted `Items` (the `Table` form) ran exactly as written. `Ungroup` is "recognized but not supported" in that interpreter, so patch P1 was run rewritten as `ForAll` over the two halves of the same `Table({Rows: …}, {Rows: …})`.
  - The pasted form equals the old board, and equals P1, for both machines, Show completed off and on: same days, header counts, labels, today flag and card order (8 comparisons).
  - All 2,495 formulas of the end state (Paste 4 without `galPunBoard`, F2, Pastes 5-8 and 11, and the unchanged 4f / 4g card files inside the new lists) type-check with 0 failures and 0 wrong result types. The value formulas were evaluated with `ThisItem` = a card row and = a header row (an empty and a non-empty day), Show completed off and on.
  - Card behaviour through the flat rows: ▲ on the bottom card, ▼ back, ▲ on the top card (no-op), ▲ on a pair that is its day's only unit (no-op), a grey 14 pill turning yellow, Nested on an SB15 card: 10 assertions pass.
- **Not testable offline:** `Table` with two tables and `Ungroup` in Studio (hence patch P1); pasting into `conPunCardS8` inside the new list (Punch notes row 2; the same kind of paste as the original Pastes 9 and 10); whether a gallery scroll bar sits over the template or narrows it (patch P2); the Tree view position after "Send backward" (step 7 check 3 is the real test); what a text box inside a gallery keeps when the rows move (the nest label point under "What you will notice").

## Assumptions and uncertainties

| # | Uncertainty | Fallback |
|---|---|---|
| 1 | `Table(header rows, card rows)` with different columns in Studio. It is documented (Learn, Table function: tables as arguments, union of columns) and ran in the interpreter, but it hasn't been tried in Studio. Guide U4's `Ungroup` form needs the same union, plus `Ungroup` over two different table types, which isn't documented. | Patch P1 (the `Ungroup` form). If that fails too: go back to the old board and report it with both Items errors. The next step is guide U4's second fallback (ask the agent). |
| 2 | Pasting 4f / 4g into the card container inside the new list. Landing one level up is **not** harmless here (unlike the original, Punch notes row 2): the controls would show on header rows. | Ctrl+Z and paste again with click + Ctrl+V (steps 5 and 6). |
| 3 | A gallery scroll bar may sit over the template (then it runs in the 8 px gap) or narrow it (then cards are a few px narrower; row 3 has 12 px to spare). | Patch P2 if it covers ▼ or the pair badge. |
| 4 | Header rows are as tall as a card (110 px), so the lists are longer than the old board and need more scrolling. | Accepted (guide U4: one row height). If it matters, report it; a variable-height version would bring back the U4 question. |
| 5 | Speed: every header row also builds a hidden card (21 controls). With about 8 days per list that is about 16 hidden cards on the screen. | Keep Show completed off normally (Punch notes row 8). |
| 6 | "Send backward" by keyboard (Ctrl+[) may differ on some keyboard layouts. | Right-click → Reorder → Send backward. |
| 7 | A refresh or Show completed moves the rows of the whole list (on the old board: one day's cards). A nest label being typed can be lost, or might stay at its spot in the list and land in another job's box when both jobs have the same saved label. | Type the label and tap ✓ straight away; check the job number before tapping ✓. Report it if a label ever lands on the wrong job. |
