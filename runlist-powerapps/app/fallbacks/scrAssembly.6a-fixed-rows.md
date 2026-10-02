# scrAssembly fallback: Paste 6a with fixed-height day rows

**Use this only if the Assembly grid's day rows don't grow to fit their cards** (scrAssembly notes, U-a; guide U4). You'll see it in Preview after Pastes 14-16 (notes: 6a-6c): cards in a cell are cut off, or the next day's date bars sit on top of cards. If the grid looks right, ignore this file.

This replaces Paste 14 (notes: 6a). Pastes 15 and 16 (6b, 6c) don't change, but you paste them again, because deleting the old screen deletes them too.

| File | What it is |
|---|---|
| `app/fallbacks/scrAssembly.6a-fixed-rows.yaml` | The new Paste 6a: the whole screen with fixed-height day rows (612 lines) |
| `app/screens/scrAssembly.2.yaml` | Paste 6b, **unchanged** (Assign panel, 11 controls) |
| `app/screens/scrAssembly.3.yaml` | Paste 6c, **unchanged** (grid card, 19 controls) |

Time: about 15 minutes, plus the checks in Step 7.

---

## What changes, and what stays the same

**Only the day list (`galAsmDays`) changes how it is laid out.** Everything else on the screen is exactly as before: header, tray, column titles, timer, Assign panel, cards, ▲ ▼, Start, the ship-date chip, warnings and counts. `scrAssembly.notes.md` still describes the screen and its tests.

- **Before:** each day row grew to fit its own cards. This is the part that doesn't work in your Studio.
- **Now:** every day row is the **same height**. That height fits the busiest cell on the grid (the most cards on one line on one day), up to 3 cards high:

  | Busiest cell on the grid | Height of every day row |
  |---|---|
  | No assigned jobs | 38 px (only the date bars) |
  | 1 card | 172 px |
  | 2 cards | 306 px |
  | 3 or more cards | 440 px (3 rows of cards) |

- **A cell with more than 3 cards** scrolls inside its own day:
  - That line's date bar ends in **"▼ +n"**: n more cards are below. This is the cue to look for.
  - To see them, swipe up inside that day.
  - On a PC, hover over that day's cards to see a thin scroll bar at their right, and drag it. On a tablet the scroll bar only shows while you swipe.
- **To scroll the list of days**, swipe on the date bars or on another day. On a PC, hover over the grid and use the scroll bar at its far right.
- All rows change height together when the busiest cell changes. For example, adding a second job to one cell makes every day row taller. That's expected.

**Why the whole screen is replaced, not patched.** The guide prefers property patches unless the structure changes (guide 1.12 and 3.5.6). Here it does:
- The gallery type (`Variant`) can't be changed in Studio, so galAsmDays has to be re-created.
- Pasting galAsmDays alone would put it on top of recAsmOverlay and conAsmPanel in z-order (guide 4.5), and the grid would cover the Assign panel. So the whole screen is replaced, as in guide 3.5.
- Guide U4's first fallback (one flat list of date-bar rows and card rows) wasn't used. It needs a new `Items` formula built with `Ungroup` (untested, guide U4) and a different card layout, so 6c couldn't be pasted again unchanged.

---

## Before you start: read this

**Delete the old screen before you paste the new one.**
- The new file reuses all 32 names of the old Paste 6a: the screen `scrAssembly` and its 31 controls (`conAsmHeader` ... `conAsmPanel`).
- Studio doesn't overwrite on paste. If the old screen still exists, it adds a copy named `scrAssembly_1` with `_1` on every clashing name, and the formulas point at the wrong controls.
- Step 2 deletes the old screen, which frees every one of those names. Only then is it safe to paste.

**Re-apply your own changes afterwards.**
- Deleting the screen also deletes every formula you changed on scrAssembly since Pastes 14-16. Examples: a property patch from the notes (A1, A3, A4, A12, U-i Size/Width) or a fix an agent sent.
- If you changed any scrAssembly formula, re-apply it after Step 5. The Step 1 backup has the old text.
- Exception: if a change was to one of the 7 properties under "What changed, compared with the original 6a" (below), don't re-apply it. Report it instead.

**Still building the app (Paste 22 not done yet)?** You can use this file right after Paste 16. Three things differ:
- **Step 2:** App > StartScreen isn't listed. Other scrHome buttons may already be red from Paste 3. That's normal.
- **Step 6:** do only 6.2 and 6.6. Skip 6.3: scrNesting, scrTurret, scrBending and scrTV don't exist yet, so `App.StartScreen.txt` would fail. Skip 6.5: the other scrHome buttons stay red until the build guide's fix-up step after Paste 22.
- **After Step 7 (A and B):** continue with Paste 17 of `02-build-the-app.md`. Skip 7C.

---

## Step 1. Back up the old screen

1. In Studio, open **Tree view** (layers icon on the left) and the **Screens** tab.
2. Right-click **scrAssembly** and choose **Copy**.
3. Open **Notepad**, press **Ctrl+V**, and save the file as `scrAssembly-backup.txt`.

## Step 2. Delete the old screen (this frees the names)

1. Right-click **scrAssembly** and choose **Delete**.
   - This deletes all 61 Assembly controls: the 31 from 6a, the 11 inside conAsmPanel (6b) and the 19 inside conAsmCard (6c).
2. Check that **scrAssembly** is gone from the Screens list.
3. **Expected now:** App checker shows red errors on two formulas that open this screen:
   - **scrHome > btnHomAssembly > OnSelect**
   - **App > StartScreen**

   Both say that scrAssembly isn't recognized. Leave them for now; Step 6 clears them.
   - If you haven't done Paste 22 yet, App > StartScreen isn't listed, and other scrHome buttons may already be red. That's normal (see "Still building the app?" above).

## Step 3. Paste the new 6a

```
REPLACEMENT PASTE 14 of 22 (notes: 6a, fixed-height rows): screen scrAssembly (new screen) - file app/fallbacks/scrAssembly.6a-fixed-rows.yaml
Before this: Steps 1-2 done (old scrAssembly backed up, then deleted). Pastes 1-13 done.
Where: Tree view → Screens tab → right-click any screen → Paste.
After: run the checks. Expected: 0 errors on scrAssembly. The new screen is named exactly "scrAssembly" (no _1).
       Don't press F5 until Step 5 is done.
```

Copy the **whole** file (on GitHub, **Copy raw file**; on your PC, Notepad, then **Ctrl+A** and **Ctrl+C**).

Check:
- **Name.** The new screen is **scrAssembly**, not `scrAssembly_1`. If it ends in `_1`, the old screen wasn't deleted. Delete the `_1` copy, do Step 2, then paste again.
- **It's the new version.** Expand scrAssembly and click **galAsmDays**. Pick **TemplateSize** in the property drop-down at the top left. The formula starts with `With(` and a comment line `// Fixed-height day rows`. (In the old version it was `40`.)
- The two errors from Step 2 may still show. Step 6 clears them.

## Step 4. Paste 6b again (unchanged file)

```
PASTE 15 of 22 again (notes: 6b): Assign panel - file app/screens/scrAssembly.2.yaml (unchanged)
Before this: Step 3 done.
Where: Tree view → expand scrAssembly → right-click conAsmPanel → Paste.
After: run the checks. Expected: 0 errors on scrAssembly. The errors from Step 2 stay until Step 6.
       conAsmPanel holds 11 controls (lblAsmPTitle ... btnAsmPCancel).
```

## Step 5. Paste 6c again (unchanged file)

```
PASTE 16 of 22 again (notes: 6c): grid card - file app/screens/scrAssembly.3.yaml (unchanged)
Before this: Steps 3 and 4 done.
Where: Tree view → scrAssembly → expand galAsmDays → expand galAsmCells → right-click conAsmCard → Paste.
       (Or click conAsmCard and press Ctrl+V.) Don't have a gallery selected when you paste.
After: run the checks. Expected: 0 errors on scrAssembly. The errors from Step 2 stay until Step 6.
```

**Check by eye, because a wrong place gives no error.** The 19 new controls (lblAsmJob ... icoAsmEdit) must be indented **under conAsmCard**, not next to it under galAsmCells. If they're next to it, select those 19, press **Delete**, click **conAsmCard**, and press **Ctrl+V**.

## Step 6. Re-connect Home and the start screen, then save

**Paste 22 not done yet?** Do only 6.2 and 6.6, then Step 7 (A and B), then continue with Paste 17. Skip 6.3 and 6.5 (see "Still building the app?" above).

If you changed any scrAssembly formula before this (see "Re-apply your own changes"), re-apply it now, before 6.6.

1. Open **App checker** (stethoscope icon, top right) and look at the **Formulas** section. (Accessibility items such as "Focus isn't showing" are expected; ignore them.)
2. **scrHome > btnHomAssembly > OnSelect.** Click the button in Tree view, pick **OnSelect**, click at the end of the formula bar, type a space, delete it, and press **Enter**. If it stays red, press **Ctrl+A** in the formula bar, paste this, and press **Enter**:
   ```
   Navigate(scrAssembly, ScreenTransition.None)
   ```
3. **App > StartScreen.** Click **App** in Tree view, pick **StartScreen**, and do the same "type a space" fix. If it stays red, press **Ctrl+A** in the formula bar, paste all of `app/App.StartScreen.txt` (as in Paste 22), and press **Enter**.
4. **Screens list.** Check that **scrHome** is still at the top; drag it there if not. The new scrAssembly may sit at the bottom of the list, which is fine.
5. The **Formulas** section of App checker must now be empty. If a red mark won't clear: press **Ctrl+S**, close the Studio tab, and open the app again from make.powerapps.com. Studio re-checks every formula when it opens. If it's still red, report it (see "If something goes wrong").
6. Press **Ctrl+S**.

## Step 7. Check it in Preview (F5)

**A. The whole screen.** The screen was rebuilt, so run the checks in `scrAssembly.notes.md`: "What you should see" and the manual tests. Tests 1 (Assign), 3 (Cancel), 4 (Order) and 6 (Start) are the minimum.

**B. The fixed rows.** Use four TEST jobs (job # starting TEST, made with Punch > **+ Add job**). Put them all in one empty cell a few days ahead, for example **Line 1** next Wednesday (the "TEST cell"). Leave **Show started** off.

0. **Before you assign any TEST job,** check whether real jobs already set the row height:
   - Look at every date bar and find the largest "n jobs". Call it M.
   - Every day row is M card rows high (at most 3), plus the date bars. If M is 0, there are only date bars.
   - **M is 0 or 1:** do steps 1-6 as written.
   - **M is 2 or more:** real jobs already make the rows taller, so steps 1-3 can't show the change. Assign the first three TEST jobs without checking anything, then do steps 4-6 with the notes marked "M ≥ 2".
1. Assign one TEST job to the TEST cell. Every day row is the same height: the date bars plus one row of cards. No card is cut off, and no date bar sits on a card.
2. Assign a second TEST job to the TEST cell. **Every** day row gets taller (two rows of cards). Both cards are whole, and the next day's date bars are below them.
3. Assign a third TEST job to the TEST cell. The rows are three cards high and all three cards show. No "▼" anywhere.
4. Assign a fourth TEST job to the TEST cell. The rows stay three cards high. The TEST cell's date bar now ends in **"▼ +1"**.
   - Swipe up inside that day: the fourth card appears. On a PC, you can instead hover over that day's cards and drag the thin scroll bar at their right. On a tablet that scroll bar only shows while you swipe, so don't look for it.
   - Tap **▲** on the fourth card: it moves up one place. The day may jump back to its top after the tap, or after the 60 s auto refresh (F4).
   - **M ≥ 2:** the checks above still apply: once the TEST cell has more than 3 cards, its bar ends in "▼ +(its count − 3)", so "▼ +1" with 4 cards. Other date bars may show ▼ too, but only a bar whose own count is more than 3, and it ends in "▼ +(its count − 3)".
5. Swipe on the date bars, or on another day: the list of days scrolls. On a PC, hover over the grid and use the scroll bar at its far right edge.
6. Afterwards, set the TEST jobs to Dismissed in Punch. The rows shrink back to the height they had in step 0.

**C. Publish.** If the app was published before, publish again (`02-build-the-app.md`, Part D). People always get the last published version.

---

## If something goes wrong

- **A paste fails.** A failed paste creates nothing, so it's safe to paste again. Send:
  - the exact error text (a screenshot is fine);
  - the paste number: "Replacement Paste 14 (6a fixed rows)", "Paste 15 again (6b)" or "Paste 16 again (6c)";
  - what was selected in Tree view when you pasted.
- **To go back to the old screen:**
  1. Delete the new **scrAssembly** (right-click > **Delete**).
  2. In Notepad, open `scrAssembly-backup.txt`, then press **Ctrl+A** and **Ctrl+C**.
  3. Screens tab > right-click any screen > **Paste**.
  4. Check the name has no `_1`, then do Step 6.

---

## Optional adjustments (property patches, guide 3.6)

Each is one formula, typed into the formula bar with **no leading `=`**. The date bars' "▼ +n", the inner scroll bar and the card list's height all follow `TemplateSize` on their own, so nothing else needs to change.

| Screen | Control | Property | Change |
|---|---|---|---|
| scrAssembly | galAsmDays | TemplateSize | **At most 2 cards high:** more days fit on screen, but a cell with 3 or more cards scrolls inside its day. Use formula P1 below. |
| scrAssembly | galAsmDays | TemplateSize | **At most 4 cards high:** fewer days scroll inside, but a 4-card row is 574 px, so you see little more than one day at a time. Use P1 with `Min(4,` instead of `Min(2,`. |
| scrAssembly | galAsmDays | TemplateSize | **Always 2 cards high:** rows never change height. Formula: `306` |

P1:

```
With({vis: Filter(ActiveJobs, LineText <> "" && AsmYmd <> "" && (tglAsmShowStarted.Value || AsmShown))}, 38 + 134 * Min(2, Coalesce(Max(ForAll(Distinct(vis, AsmBand) As d, {n: CountRows(Filter(vis, AsmBand = d.Value))}), n), 0)))
```

---

## What changed, compared with the original 6a

There are 7 changes, all inside `galAsmDays`. The other 26 controls of 6a, and the `Items` formula of `galAsmDays`, are copied unchanged.

| Control | Property | Original 6a | This fallback |
|---|---|---|---|
| galAsmDays | Variant | `VariableHeight` (rows grow) | `Vertical` (every row the same height) |
| galAsmDays | TemplateSize | `40` (the minimum; rows grew from it) | `38 + 134 * Min(3, busiest cell)`: the busiest cell is the most visible assigned cards with the same `AsmBand`, the same filter as the cells use |
| galAsmCells | Height | `ThisItem.RowCount * 134 + 4` | `Parent.TemplateHeight - 34` (fills the row under the date bars) |
| galAsmCells | ShowScrollbar | `false` | `ThisItem.RowCount > RoundDown((Parent.TemplateHeight - 28) / 134, 0)`: allowed only on a day whose cards don't all fit (on a PC it shows on hover; on a tablet only while swiping) |
| lblAsmDay1, lblAsmDay2, lblAsmDay3 | Text | date, "(today)", count | the same text, plus `"   ▼ +n"` when that line has more cards than the row shows (▼ is `UniChar(9660)`) |

Why these numbers:
- **38** is the 34 px strip for the date bars (the bars sit at Y 4, 28 px high, and the cards start at Y 34) plus the 4 px that the original card list added below the cards. With no assigned jobs, every row is now 38 px. In the original, a day with no cards was 40 px (its minimum row height, `TemplateSize: =40`).
- **134** is one row of cards: a 128 px card plus a 6 px gap. Unchanged.
- **At most 3:** a 3-card day row is 440 px, so a whole day always fits in the 662 px grid, with part of the next day showing.
- **Whole card rows that fit** in a row of height T: `RoundDown((T - 28) / 134, 0)`. Card row k (0, 1, 2 ...) ends at 34 + 134k + 128, which must be no more than T. The date bars use this to work out "+n", and the card list uses it to decide whether to show its scroll bar.
- **The card itself is unchanged:** 346 × 128, three across at a 352 px pitch, under the date bars. That's why 6c pastes unchanged.

---

## Assumptions and risks

| # | What could differ in Studio | How you'll notice | Fallback |
|---|---|---|---|
| F1 | **A formula in TemplateSize.** It's an ordinary formula property on the standard (Vertical) gallery, but this exact use isn't tested in Studio. | Step 7 B2 fails: the rows don't get taller when a cell gets a second card, so cards are cut off. (If B0 found M ≥ 2: the rows aren't M card rows high, up to 3.) | Patch TemplateSize to the constant `306` (above). |
| F2 | **A list scrolling inside a list (touch).** On a day whose cards scroll, a swipe on its cards scrolls that day, not the list of days. | The list of days doesn't move when you swipe on that day's cards. | Swipe on the date bars or on another day. On a PC, use the scroll bar at the far right. To make it rarer, patch the cap to 4. |
| F3 | **Width of the inner scroll bar.** On a day that scrolls, the scroll bar may cover the right-most few pixels of the Line 3 card while it shows (on a PC when you hover over that day's cards; on a tablet only while you swipe). | The right edge of a Line 3 card's pencil (✎) is slightly covered on that day only, while the scroll bar shows. | Cosmetic. No action needed. |
| F4 | **Scroll position after a tap or a refresh** (notes U-d). Inside a scrolled day, the cards may jump back to the top after ▲, ▼, Start, Refresh, or the auto refresh that runs every 60 s (tmrAsmRefresh) while no panel is open. | You have to swipe that day up again, about once a minute at worst. | Report it if it's annoying. |
| F5 | **Jobs more than 400 days away** still count toward the busiest cell, although the grid draws no row for them (AsmDays). | Rows taller than any cell you can see. | Fix the mistyped Assembly date in Punch > Edit. |
| F6 | **Text width of "▼ +n".** Segoe UI isn't available offline. The longest case, "Wed Sep 30  (today)      12 jobs   ▼ +9", measured about 310 px with Open Sans and Arial metrics (both wider than Segoe UI). The bar has 331 px of space. | The end of a date bar is cut off. | Report it; it's one Text patch per date bar. |

Unchanged from the notes: U-b to U-j, including the mouse wheel on a PC (U-g).

---

## Offline checks done

- **palint** (`tools/palint.py`):
  - The fallback alone: 0 errors, 0 warnings, 32 names.
  - With every other file in `app/screens` (the original 6a left out, as after Step 2): 0 errors, 0 warnings, 426 names, so no name clashes with any other screen. That's the same total as the original set.
  - With the original 6a included as well: exactly 31 errors, all "duplicate control name". There is one for each control of the original 6a, plus the screen name `scrAssembly`, which palint doesn't check. These are the names the fallback reuses, which is why Step 2 deletes the old screen first.
  - The rebuilt screen (this 6a with the unchanged 6b and 6c in their containers): 0 errors, 0 warnings, 62 names.
- **No forward references.** The new formulas use only `tglAsmShowStarted` (earlier in the paste), `ThisItem`, `Parent` and App.Formulas names, so no "Name isn't recognized" is expected (guide U3).
- **Type check:** all 859 property formulas of the rebuilt screen ran in the Power Fx 1.8.1 interpreter, in default and V1 mode, against the current App.Formulas and sample RunListJobs rows: 0 failures. Results are the same as for the original screen. The new TemplateSize formula was also checked with its comments in place.
- **Behaviour runs:** 65 assertions over 8 scenarios, in default and V1 mode, all passed. They used the real formulas from the YAML and sample rows, with today = Fri 2026-10-02.

  | Busiest cell | Row height | Result |
  |---|---|---|
  | 5 (sample: Line 1, Mon 10/5) | 440 | That bar reads "Mon Oct 5      5 jobs   ▼ +2". Only that day's card list has ShowScrollbar true. No other bar has a ▼. |
  | 5, "Show started" on | 440 | The started job's 9/28 row is added. |
  | 2 | 306 | No ▼, and ShowScrollbar is false on every day. Every date bar's text is identical to the original 6a's. |
  | 1 | 172 | The same. |
  | 3 | 440 | Everything fits, so no ▼. |
  | 4 | 440 | Only Line 2 of Mon 10/12 reads "▼ +1", and only that day's card list has ShowScrollbar true. |
  | Nothing assigned | 38 | 10 workday rows, no ▼. |
  | TemplateSize patched to `306` or `300` | 306 / 300 | Two card rows show and the bar reads "▼ +2". |

  In every scenario:
  - The row height equals `38 + 134 * Min(3, busiest cell)`, cross-checked against the gallery's own day rows.
  - The card list's height equals the original's `RowCount * 134 + 4` for a day of that size.
