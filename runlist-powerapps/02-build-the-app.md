# Build the White Board app, paste by paste

This guide builds the app in Power Apps. You copy a file from the `app` folder, paste it into Power Apps Studio, and check that it looks right. There are 22 pastes, a few settings, then sharing, links for each device and a go-live test.

- **Time:** about 2 hours for the pastes, and about 1.5 hours for the tests.
- **Before this:** `01-sharepoint-list-setup.md` is done, and the list TheWhiteBoard exists on the **-RTU Build Schedule** site. For now the list uses the site's own groups instead of RunList Users and RunList Viewers: **-RTU Build Schedule Members** can change jobs, and **-RTU Build Schedule Visitors** can only look. Your own account must be a site **Owner** or **Member**.
- **Nothing premium:** the app uses only the SharePoint list TheWhiteBoard.
- **More detail:** each screen has a notes file next to its code, for example `app/screens/scrPunch.notes.md`. Open it if a step here isn't enough.

---

## How every paste works

### Copy a whole file
Always copy the **whole** file. A missing first or last line breaks the paste.
- **On GitHub:** open the file, click **Raw** (top right of the file), then press **Ctrl+A** and **Ctrl+C** on the plain-text page. (Clicking into the code and pressing Ctrl+A, Ctrl+C also works. The "Copy raw file" button may not work on a work PC.)
- **On your PC:** right-click the file > **Open with** > **Notepad**, then press **Ctrl+A** and **Ctrl+C**.
- Don't select the text with the mouse.

### Two kinds of paste
- **Formula-bar pastes** (Pastes 1, 2 and 22, the `.txt` files). Click the item in Tree view, pick the property in the drop-down at the top left of the formula bar, click into the formula bar, press **Ctrl+A**, press **Ctrl+V**, then press **Enter**. Never type an `=` in front.
- **Screen pastes** (the `.yaml` files). Right-click the place that the paste header names in **Tree view** (the layers icon on the left), then choose **Paste**. If Paste isn't in the menu, click that place once and press **Ctrl+V**.
- The first time you paste, the browser asks to use the clipboard: click **Allow**.

### After every paste: the checks
1. **Name.** No new name (screen or control) in Tree view ends in `_1`. If one does, delete that copy and see "If a paste fails".
2. **Errors.** Look for red ⊗ marks in Tree view, or open **App checker** (the stethoscope icon, top right). Only the **Formulas** section counts. Items under **Accessibility** such as "Focus isn't showing" are expected (the touch buttons have no focus border on purpose), so ignore them. Each paste header says which errors are normal.
3. **The "type a space" fix.** If an error says *"Name isn't recognized"* for something that does exist: click that control, pick the named property, click at the end of the formula bar, type a space, delete it, and press **Enter**.
4. **Yellow triangles** (delegation warnings) are never expected. If you see one, report it.
5. **Save:** press **Ctrl+S** after every screen.
6. **Preview:** press **F5** to try a screen, and **Esc** to leave. Timers (auto refresh) only run in Preview and in the published app.

### If a paste fails
A failed paste creates **nothing**, so it's always safe to paste again once it's fixed. Send these three things:
- the **exact error text** (a screenshot is fine);
- the **paste number** from its header (for example "Paste 9 (4f)");
- what was **selected in Tree view** when you pasted.

Quick fixes to try first:

| What you see | What to do |
|---|---|
| Nothing happens when you paste | Edge: **Settings > Cookies and site permissions > Clipboard**, add `https://make.powerapps.com` to **Allow**. Chrome: **Settings > Privacy and security > Site settings > Additional permissions > Clipboard**, add `https://make.powerapps.com` to **Allowed**. Then paste again. |
| A name ends in `_1` | That name already existed. Delete the pasted copy. If you're replacing a screen, first copy the old one to Notepad as a backup, delete it, then paste again. |
| "Name isn't recognized" for something that exists | Use the "type a space" fix above. |
| The error names a control version (like `@2.2.0`) | Stop and report it. The screens all use the same versions. |
| The controls landed in the wrong place | Select them in Tree view, press **Delete**, click the right place, press **Ctrl+V**. |
| "While scanning a plain scalar..." or another YAML error | The copy wasn't complete. Copy the whole file again with the method above. |

---

## Part A. One-time setup (about 10 minutes)

1. **Browser.** Use Microsoft Edge or Chrome at https://make.powerapps.com. Studio must be in **English (US)**. In a language that puts `;` between formula parts (for example German or French), Pastes 1, 2 and 22 and the fix-up formulas fail.
2. **Create the app.** At the top right, pick the environment IT gave you ('Production PowerApps'). Then go to **Create > Blank app > Blank canvas app**. Name it `White Board`, choose Format **Tablet**, and click **Create**.
3. **Display.** In Studio, open **Settings** (gear icon, top bar) **> Display**. If there's an **App layout** drop-down, change it from **Responsive** to the other choice (Scale to fit / fixed), which unlocks the settings below. Then: Orientation **Landscape**, Size **16:9 Default** (1366 x 768), **Lock aspect ratio** **On**. In older Studio versions, just check that **Scale to fit** is **On**.
4. **Row limit.** **Settings > General > Data row limit**: set it to **2000**.
5. **Analysis engine.** **Settings > Updates > New**: **New analysis engine** should be **On** (it's on by default). Nothing in this app needs you to change it.
6. **Error handling.** **Settings > Updates > Retired**: keep **Disable formula-level error management** **Off**. The app needs it to clear values.
7. **Data.** Click the **Data** icon (cylinder) on the left, then **Add data**. Search for **SharePoint**, pick the connection, then the team site from `01-sharepoint-list-setup.md`. Tick **TheWhiteBoard** and click **Connect**. TheWhiteBoard now shows under Data.
   - If no SharePoint connection is listed, click **Add a connection** > **Connect directly (cloud services)** > **Connect**.
   - If the site isn't listed, paste its address (the one sent back in step 11 of `01-sharepoint-list-setup.md`).

Close Settings, then press **Ctrl+S** to save.

---

## Part B. Smoke test (about 5 minutes)

This test proves that pasting works in your browser before any real paste. It uses no data.

```
TEST PASTE (not numbered): screen scrYamlTest (new screen) - file app/smoke/scrYamlTest.yaml
Before this: Part A done.
Where: Tree view → Screens tab → right-click Screen1 → Paste.
After: run the checks. Expected: 0 errors, a new screen "scrYamlTest".
```

1. Select **scrYamlTest** and press **F5**. You see a dark page titled "Test 1: gallery with template children" and three cards (24101-1, 24102, 24103-2). The third card shows "SET SIZE" in red.
2. Tap **To do** or **Done** on a card: a banner says "Tapped 24101-1" (or that card's job). Tap the up and down arrows on a card: a banner says "Move up ..." or "Move down ...".
3. Press **Esc**. Right-click **scrYamlTest** > **Delete**.

If the paste fails, or the screen doesn't look like this, **stop** and report it ("If a paste fails") before going on.

---

## Part C. The pastes

Do them in this order. Don't press F5 on a screen until all its parts are pasted (a panel without its Cancel button can block the screen; Esc gets you out).

The screen notes number the pastes like the build contract (4a, 4b ...). Each header below shows both numbers. In the notes:
- Paste 0 = Part A; 1, 2 and 3 = Pastes 1, 2 and 3; 4a-4h = Pastes 4-11; 5a-5b = 12-13; 6a-6c = 14-16; 7 = 17; 8 = 18; 9 = 19; 10a-10b = 20-21.
- **Notes "Paste 11" = Paste 22 here (StartScreen). Notes "Paste 12" = the fix-up step.**
- "guide 3.x" or "U-n" means `design/yaml-authoring-guide.md` (3.4 = the checks above, 3.5 = replacing a screen, 3.7 = If a paste fails).

From Paste 3 until the fix-up step, App checker keeps listing errors on scrHome's buttons (and, from Paste 4, on btnPunImport). They point at screens that aren't pasted yet. That's normal. "0 errors on this screen" below means none on the screen or part you just pasted.

### Paste 1: App.OnStart

```
PASTE 1 of 22: App > OnStart (formula bar) - file app/App.OnStart.txt
Before this: Parts A and B done. TheWhiteBoard connected.
Where: Tree view → click App → property list → OnStart → formula bar → Ctrl+A → Ctrl+V → Enter.
After: run the checks. Expected: 0 errors.
```

It's two lines: they start the refresh counter and the turret choice.

**If OnStart isn't in the property list:** look in **Settings** for a switch that turns OnStart on, and use it. If there's no such switch, paste the same two lines into **Screen1 > OnVisible** instead. Then keep Screen1 until **after Paste 4** and delete it there (not at Paste 3).

### Paste 2: App.Formulas

```
PASTE 2 of 22: App > Formulas (formula bar) - file app/App.Formulas.txt
Before this: Paste 1 done.
Where: Tree view → click App → property list → Formulas → formula bar → Ctrl+A → Ctrl+V → Enter.
After: run the checks. Expected: 0 errors. Wait for Studio to finish (it may take 10-30 seconds).
```

These are the shared colours and job lists that every screen uses.

**If the only error is on `TodayDate`** (about `gblRefreshTick`): in the formula bar, replace that one line with `TodayDate = Today();` and press **Enter**. The only loss is that a device left on past midnight shows the new day after a reload instead of on its own. Report it.

### Paste 3: Home screen

```
PASTE 3 of 22 (notes: 3): screen scrHome (new screen) - file app/screens/scrHome.yaml
Before this: Pastes 1-2 done.
Where: Tree view → Screens tab → right-click Screen1 → Paste.
After: run the checks. Expected: a red mark on each of the 8 big buttons (OnSelect), saying a screen
       name "isn't recognized" and maybe "Navigate has some invalid arguments". Normal: those screens
       don't exist yet. The fix-up step after Paste 22 clears them. An error anywhere else is not expected.
```

- Check that **lblHomTVInfo** is in Tree view under scrHome (21 controls in all). If it's missing, the copy stopped early: delete scrHome and paste again.
- Then right-click **Screen1** > **Delete** (unless you used the OnStart fallback; then delete it after Paste 4). Press **Ctrl+S**.

### Pastes 4 to 11: Punch screen (8 parts)

The Punch screen is too big for one paste. Part 1 makes the screen with empty containers; each later part goes **into** one container.

```
PASTE 4 of 22 (notes: 4a): screen scrPunch, part 1 of 8 (new screen) - file app/screens/scrPunch.1.yaml
Before this: Pastes 1-3 done.
Where: Tree view → Screens tab → right-click any screen → Paste.
After: run the checks. Expected on scrPunch: one red mark, on btnPunImport (OnSelect): "scrImport isn't
       recognized" (App checker may also list "Navigate has some invalid arguments" for it). The scrHome
       button errors from Paste 3 are still listed (btnHomPunch's may clear now). All are normal; the
       fix-up step clears them. The Incoming tray stays empty until Paste 11.
```

If you used the OnStart fallback, delete **Screen1** now.

```
PASTE 5 of 22 (notes: 4b): scrPunch part 2 of 8, edit panel fields - file app/screens/scrPunch.2.yaml
Before this: Paste 4 done.
Where: Tree view → expand scrPunch → right-click conPunEditPanel → Paste.
After: run the checks. Expected: no new errors (the Paste 3 scrHome errors and the btnPunImport one remain).
       The panel stays hidden; that's normal.
```

```
PASTE 6 of 22 (notes: 4c): scrPunch part 3 of 8, edit panel pairing and buttons - file app/screens/scrPunch.3.yaml
Before this: Paste 5 done.
Where: Tree view → scrPunch → right-click conPunEditPanel → Paste (the same container as Paste 5).
After: run the checks. Expected: no new errors (the Paste 3 scrHome errors and the btnPunImport one remain).
```

```
PASTE 7 of 22 (notes: 4d): scrPunch part 4 of 8, Place panel - file app/screens/scrPunch.4.yaml
Before this: Paste 4 done.
Where: Tree view → scrPunch → right-click conPunPlacePanel → Paste.
After: run the checks. Expected: no new errors (the Paste 3 scrHome errors and the btnPunImport one remain).
```

```
PASTE 8 of 22 (notes: 4e): scrPunch part 5 of 8, Find job # panel - file app/screens/scrPunch.5.yaml
Before this: Paste 4 done.
Where: Tree view → scrPunch → right-click conPunFindPanel → Paste.
After: run the checks. Expected: no new errors (the Paste 3 scrHome errors and the btnPunImport one remain).
```

```
PASTE 9 of 22 (notes: 4f): scrPunch part 6 of 8, SB8 punch card - file app/screens/scrPunch.6.yaml
Before this: Paste 4 done.
Where: Tree view → scrPunch → expand galPunBoard → expand galPunCardsS8 → right-click conPunCardS8 → Paste.
       It must be conPunCardS8 (the container INSIDE galPunCardsS8), not a gallery.
After: run the checks. Expected: no new errors (the Paste 3 scrHome errors and the btnPunImport one remain).
```

```
PASTE 10 of 22 (notes: 4g): scrPunch part 7 of 8, SB15 punch card - file app/screens/scrPunch.7.yaml
Before this: Paste 9 done.
Where: Tree view → scrPunch → galPunBoard → expand galPunCardsS15 → right-click conPunCardS15 → Paste.
After: run the checks. Expected: no new errors (the Paste 3 scrHome errors and the btnPunImport one remain).
```

```
PASTE 11 of 22 (notes: 4h): scrPunch part 8 of 8, Incoming tray list - file app/screens/scrPunch.8.yaml
Before this: Paste 4 done.
Where: Tree view → scrPunch → right-click conPunTray (the left-hand container) → Paste.
       Don't select galPunBoard or any other gallery.
After: run the checks. Expected: no new errors (the Paste 3 scrHome errors and the btnPunImport one remain).
       galPunTray is now inside conPunTray (Tree view usually shows it first under conPunTray).
```

Press **Ctrl+S**. If the list already has jobs, press **F5** to look: day bands with SB8 cards on the left and SB15 cards on the right. If the bands overlap or cards are cut off, see the Punch notes, "Assumptions and uncertainties", row 1: try its one property change (F1) first. If F1 doesn't fix it, follow `app/fallbacks/scrPunch.board-F2-flat.md`.

### Pastes 12 and 13: Import screen (2 parts)

```
PASTE 12 of 22 (notes: 5a): screen scrImport, part 1 of 2 (new screen) - file app/screens/scrImport.1.yaml
Before this: Pastes 1-11 done.
Where: Tree view → Screens tab → right-click any screen → Paste.
After: run the checks. Expected on scrImport: no errors, except possibly one on scrImport > OnVisible
       ("txtImpPaste isn't recognized"): use the "type a space" fix on scrImport > OnVisible.
       The scrImport errors on Home's and Punch's Import buttons may clear now; if not, the fix-up step clears them.
```

```
PASTE 13 of 22 (notes: 5b): scrImport part 2 of 2, result lists - file app/screens/scrImport.2.yaml
Before this: Paste 12 done.
Where: Tree view → expand scrImport → right-click conImpResults → Paste. Not the screen, not galImpTiles.
After: run the checks. Expected: 0 errors on this screen. Older scrHome or btnPunImport errors may still be listed; that's normal.
       scrHome's Nesting, SB8, SB15, Bending and TV buttons are certainly still red. The lists stay hidden; that's normal.
```

**Check where Paste 13 landed:** expand **conImpResults**. These 7 must be inside it: lblImpFailHead, galImpFailed, lblImpBlockHead, galImpBlocked, lblImpChgHead, lblImpChgEmpty, galImpChanges. If they're somewhere else, select those 7, press **Delete**, and paste again on conImpResults. Then **Ctrl+S**.

### Pastes 14 to 16: Assembly screen (3 parts)

```
PASTE 14 of 22 (notes: 6a): screen scrAssembly, part 1 of 3 (new screen) - file app/screens/scrAssembly.1.yaml
Before this: Pastes 1-13 done.
Where: Tree view → Screens tab → right-click any screen → Paste.
After: run the checks. Expected: 0 errors on this screen. Older scrHome or btnPunImport errors may still be listed; that's normal.
       Don't press F5 until Paste 16 is done.
```

```
PASTE 15 of 22 (notes: 6b): scrAssembly part 2 of 3, Assign panel - file app/screens/scrAssembly.2.yaml
Before this: Paste 14 done.
Where: Tree view → expand scrAssembly → right-click conAsmPanel → Paste.
After: run the checks. Expected: 0 errors on this screen. Older scrHome or btnPunImport errors may still be listed; that's normal.
       conAsmPanel now holds 11 controls (lblAsmPTitle ... btnAsmPCancel).
```

```
PASTE 16 of 22 (notes: 6c): scrAssembly part 3 of 3, grid card - file app/screens/scrAssembly.3.yaml
Before this: Pastes 14 and 15 done.
Where: Tree view → scrAssembly → expand galAsmDays → expand galAsmCells → right-click conAsmCard → Paste.
After: run the checks. Expected: 0 errors on this screen. Older scrHome or btnPunImport errors may still be listed; that's normal.
```

**Check Paste 16 by eye, because a wrong place gives no error:** the 19 new controls (lblAsmJob ... icoAsmEdit) must be indented **under conAsmCard**, not next to it under galAsmCells. If they're next to it, delete those 19, click conAsmCard, and press **Ctrl+V**. Then **Ctrl+S**.

Later, with 3 or more jobs in one cell: if cards are cut off or the next day's date bars overlap them, follow `app/fallbacks/scrAssembly.6a-fixed-rows.md`.

### Paste 17: Nesting screen

```
PASTE 17 of 22 (notes: 7): screen scrNesting (new screen) - file app/screens/scrNesting.yaml
Before this: Pastes 1-16 done.
Where: Tree view → Screens tab → right-click any screen → Paste.
After: run the checks. Expected: 0 errors on this screen. Older scrHome or btnPunImport errors may still be listed; that's normal.
       Check that tmrNesRefresh is under scrNesting in Tree view (it is the last control in the file; if it's
       missing, the copy stopped early: delete scrNesting and paste again).
```

### Paste 18: SB8 / SB15 turret screen

```
PASTE 18 of 22 (notes: 8): screen scrTurret (new screen) - file app/screens/scrTurret.yaml
Before this: Pastes 1-17 done.
Where: Tree view → Screens tab → right-click any screen → Paste.
After: run the checks. Expected: 0 errors on this screen. Older scrHome or btnPunImport errors may still be listed; that's normal.
       One screen serves both SB8 and SB15.
```

If a formula that uses lblTurMachine or tglTurShowDone says "isn't recognized", use the "type a space" fix on it.

If you used the OnStart fallback and lblTurMachine (Text) says varMachine isn't recognized, leave it. The fix-up step clears it (its last row), after the rows for SB8 and SB15.

### Paste 19: Bending screen

```
PASTE 19 of 22 (notes: 9): screen scrBending (new screen) - file app/screens/scrBending.yaml
Before this: Pastes 1-18 done.
Where: Tree view → Screens tab → right-click any screen → Paste.
After: run the checks. Expected: 0 errors on this screen. Older scrHome or btnPunImport errors may still be listed; that's normal.
```

### Pastes 20 and 21: TV screen (2 parts)

```
PASTE 20 of 22 (notes: 10a): screen scrTV, part 1 of 2 (new screen) - file app/screens/scrTV.1.yaml
Before this: Pastes 1-19 done.
Where: Tree view → Screens tab → right-click any screen → Paste.
After: run the checks. Expected: 0 errors on this screen. Older scrHome or btnPunImport errors may still be listed; that's normal.
       You see the header and three column titles ('Punch day', 'SB-8 · n to punch', 'SB-15 · n to punch');
       the board is empty for now.
```

```
PASTE 21 of 22 (notes: 10b): scrTV part 2 of 2, the board and timers - file app/screens/scrTV.2.yaml
Before this: Paste 20 done.
Where: Tree view → right-click scrTV (the SCREEN itself, not conTvHeader) → Paste.
After: run the checks. Expected: 0 errors on this screen. Older scrHome or btnPunImport errors may still be listed; that's normal.
       galTvBoard, tmrTvRefresh and tmrTvPage sit directly under scrTV, at the same level as conTvHeader.
       If they landed inside conTvHeader, select those 3, press Delete, click scrTV and paste again.
```

Press **Ctrl+S**.

### Paste 22: App.StartScreen

```
PASTE 22 of 22 (notes: 11): App > StartScreen (formula bar) - file app/App.StartScreen.txt
Before this: Pastes 1-21 done (every screen it names exists).
Where: Tree view → click App → property list → StartScreen → formula bar → Ctrl+A → Ctrl+V → Enter.
After: run the checks. Expected: 0 errors on App > StartScreen. Older scrHome or btnPunImport errors may still be listed; that's normal.
```

This picks the first screen from the device's link (Part F).

### Fix-up step (no paste; notes: Paste 12)

Some buttons were pasted before the screen they open existed. Re-enter their formulas now. For each row: click the control in Tree view, pick the property from the table, click into the formula bar, type a space at the end, delete it, and press **Enter**. If the red mark stays, press **Ctrl+A** in the formula bar, paste or type the formula from the table (no `=` in front), and press **Enter**. Do **SB8 and SB15 first**.
- btnPunImport is inside a container: expand **scrPunch > conPunHeader** to find it.
- The table's formulas have no copy button. Copy only the text between the backticks, or type it exactly.

| Screen | Control | Property | Formula (formula bar) |
|---|---|---|---|
| scrHome | btnHomSB8 | OnSelect | `Set(varMachine, "SB8"); Navigate(scrTurret, ScreenTransition.None)` |
| scrHome | btnHomSB15 | OnSelect | `Set(varMachine, "SB15"); Navigate(scrTurret, ScreenTransition.None)` |
| scrHome | btnHomPunch | OnSelect | `Navigate(scrPunch, ScreenTransition.None)` |
| scrHome | btnHomAssembly | OnSelect | `Navigate(scrAssembly, ScreenTransition.None)` |
| scrHome | btnHomNesting | OnSelect | `Navigate(scrNesting, ScreenTransition.None)` |
| scrHome | btnHomImport | OnSelect | `Navigate(scrImport, ScreenTransition.None)` |
| scrHome | btnHomBending | OnSelect | `Navigate(scrBending, ScreenTransition.None)` |
| scrHome | btnHomTV | OnSelect | `Navigate(scrTV, ScreenTransition.None)` |
| scrPunch | btnPunImport | OnSelect | `Navigate(scrImport, ScreenTransition.None)` |
| scrTurret | lblTurMachine (only if red) | Text | `Coalesce(varMachine, If(Lower(Trim(Param("screen"))) = "sb15", "SB15", "SB8"))` |

Then:
1. Open **App checker**. The **Formulas** section must be empty. (Accessibility items are fine.)
2. In Tree view, drag **scrHome** to the top of the Screens list.
3. If any red mark won't clear: **Ctrl+S**, close the Studio tab, and open the app again: make.powerapps.com > **Apps** > **...** next to White Board > **Edit** (Studio re-checks every formula when it opens). If it's still red, check that the screen name has no `_1`, and report it.

---

## Ready-made fallbacks

Two boards use lists whose rows grow to fit the cards inside them, which may not work in every Studio. If yours shows the problem, use the ready-made replacement in `app/fallbacks/`. Each has its own step-by-step page. If the board looks right, ignore them.

| Fallback | Use it when | Follow |
|---|---|---|
| **Assembly fixed day rows** | On Assembly, with 3 or more jobs in one cell, cards are cut off or the next day's date bars sit on top of them. | `app/fallbacks/scrAssembly.6a-fixed-rows.md`. It replaces Paste 14, then you paste 15 and 16 again, unchanged. |
| **Punch flat board (F2)** | On Punch, day bands overlap or cards are cut off, **and** F1 (Punch notes, "Assumptions and uncertainties", row 1) didn't fix it. | `app/fallbacks/scrPunch.board-F2-flat.md`. It replaces the board with one list per machine, then you paste 9 and 10 again, unchanged. |

- You need a few jobs in the list to see either problem, so you may only notice it in Part G.
- Each page says what to delete first. Pasting over the old board gives `_1` names.
- Each page also says what to do if you haven't reached Paste 22 yet.

---

## Part D. Save and publish

1. Press **Ctrl+S**.
2. Click **Publish** (top right), then **Publish this version**.
3. Do this again after any later change: people always get the last **published** version.

## Part E. Share

1. Go to https://make.powerapps.com > **Apps**.
2. Next to **White Board**, click **...** (More commands) > **Share**.
3. Type each person's name (and each tablet or TV account), pick them, and leave **Co-owner** unticked.
   - You can try typing `-RTU Build Schedule` to share with the whole site group at once. If it doesn't show up, use names.
4. Click **Share**.

Sharing the app does **not** give access to the list. Everyone you share with must also be on the site:
- **-RTU Build Schedule Members:** anyone who changes jobs (supervisors, the nester, floor tablets).
- **-RTU Build Schedule Visitors:** look-only accounts (the TV).

To add people: on the site, click the gear > **Site permissions** (or **Members** at the top right) > **Add members**.

Site Members can also delete rows and change columns in SharePoint. Tell everyone to make changes in the app only, never in SharePoint. If a row is deleted by mistake, it can be restored from the site **Recycle bin** for 93 days. The stricter setup in `01-sharepoint-list-setup.md` step 9 can be added later.

The first time someone opens the app, it asks to use the SharePoint connection: click **Allow**.

## Part F. Links for each device

Every device gets its own bookmark that opens straight on its screen.

1. **Find the app's web link:** make.powerapps.com > **Apps** > **...** next to White Board > **Details**. Copy the **Web link**. It looks like `https://apps.powerapps.com/play/e/<environment>/a/<app id>?tenantId=<tenant>&hint=<...>`.
2. **Add the screen** to the end of that link: `&screen=` and a value from the table. (If the link has no `?` in it, use `?screen=` instead.)

| Device | Add to the link | Opens |
|---|---|---|
| Supervisor PC | `&screen=punch` | Punch board |
| Supervisor PC that imports | `&screen=import` | Import |
| Assembly supervisor | `&screen=assembly` | Assembly board |
| Nester | `&screen=nesting` | Nesting list |
| SB8 tablet | `&screen=sb8` | Turret screen, SB8 |
| SB15 tablet | `&screen=sb15` | Turret screen, SB15 |
| Bending tablet (brake / P4) | `&screen=bending` | Bending |
| TV | `&screen=tv` | TV wall display |
| Anything else, or nothing added | | Home |

Example: `https://apps.powerapps.com/play/e/abc/a/123?tenantId=xyz&hint=789&screen=sb8`.

On each device:
- Sign in to the browser with that device's licensed work account (a site Member, or a Visitor for the TV).
- Open its link, click **Allow** when asked, and save it as a bookmark. To open it at start-up in Edge: **Settings > Start, home, and new tabs > Open these pages**.
- The device's time zone must be the shop's time zone (the same as the SharePoint site).
- **Floor tablets and the TV:** keep the app's tab in front (browsers slow down timers in hidden tabs). On the TV, press **F11** for full screen and turn off sleep and the screen saver.
- **Import PC:** install the CASMFG copy button. Follow "HOW TO INSTALL" at the top of `casmfg-copy-jobs.user.js`:
  - Install the Tampermonkey browser extension first (IT may need to approve it).
  - Tampermonkey > **Create a new script** > **select all in the editor and delete it** > paste the whole file > **Save**.
  - Reload the CASMFG tab: a clipboard icon appears in the top bar (hover it: "Copy jobs for White Board").
  - Keep the old "CASMFG → RunList Sync" script turned **off** in Tampermonkey.
  - If the button doesn't appear, newer Edge and Chrome may need **Allow User Scripts** (in Tampermonkey's extension details) or **Developer mode** (on the Extensions page) turned on. This wasn't tested here.

---

## Part G. Go-live test checklist

Test in the **published** app (Part F links), not only in Studio. Use TEST jobs: job number `TEST`, made by the Import test copies or with Punch > **+ Add job**. Keep SharePoint open in another tab to check values. Each screen's notes file has the full steps ("Manual test").

### G1. The five gates (list-design step 20). Don't go live until all five pass.
The test copies (Copy A, B and C) are in `app/screens/scrImport.notes.md`, under "Manual test". To copy one: on GitHub, open that file, find "Copy A" (or B, C) and click the copy icon at the top right of its grey box. Each copy is one long line; don't select it with the mouse. Every test copy is old on purpose, so the amber "This copy is old" box always shows first: tap **Import anyway**.

- [ ] **1. Import date.** On Import, paste Copy A and tap **Import**, then **Import anyway**. In SharePoint, the row with JobNumber TEST and UnitNumber 1 (its hidden Title is TEST|1) shows ShipDate **10/3/2026** (not 10/2 or 10/4). Its Incoming card on Punch shows ship 10/3.
- [ ] **2. Date picker.** On a tablet, Punch > **Place** a TEST job from the Incoming tray (or **+ Add job**), then tap the pencil on its board card > set **Punch day** > **Save**. SharePoint shows the same day.
- [ ] **3. Same copy twice.** Paste Copy A again and tap **Import**, then **Import anyway**. The tiles show **Added 0, Ship moves 0**.
- [ ] **4. Two devices.** First, on Punch, **Place** a TEST job on SB8 with gauges 12 and 14, and tap **Nested** on its card. Then tick a gauge on the SB8 tablet. A second device on Bending or Turret shows it within 30 seconds (the TV within 60).
- [ ] **5. PB and P4 together.** Put two windows (or tablets) on Bending. On the same Nested TEST job (for example the one from gate 4), tap **PB** in one and **P4** in the other within a few seconds. The card disappears (PB + P4 = finished on Bending; that's normal). SharePoint shows PBDone and P4Done both Yes.

If gate 1 or 2 is off by one day, **stop and report it**. It gets fixed once, centrally, never per screen.

Extra check (not a gate):
- [ ] **Clearing a choice.** First give a TEST job an Assembly line (Assembly > **Assign**). Then Punch > pencil on that job > in **Assembly line**, pick the empty entry at the top of the list > **Save**. SharePoint's AssemblyLine is empty. If a banner says "Saved, but the assembly line did not change", report it.

### G2. Screen by screen

**Home** (`app/screens/scrHome.notes.md`)
- [ ] Each of the 8 buttons opens its screen, and that screen's **Home** button comes back.
- [ ] Tap **SB8**: the turret screen opens with "SB8" in light blue. **Home**, then **SB15**: "SB15" in purple.
- [ ] The header shows "Signed in as" and the device's account name.

**Punch** (`app/screens/scrPunch.notes.md`)
- [ ] Today's band is blue, followed by the next 5 days. Each column's "n to punch" matches its cards.
- [ ] **Place** a tray job on SB15 for tomorrow with gauges 12 and 16: it lands at the bottom of that band with yellow 12 and 16. A size 1 or 4 job warns when SB15 is picked.
- [ ] Gauge pills: grey turns yellow and back. A green (punched) pill refuses with a warning.
- [ ] **Nested** turns green. Type a nest label, tap the blue tick: it saves.
- [ ] Up and down arrows move a card one place; up on the top card does nothing.
- [ ] Pencil on an imported job: Job # and Unit # are greyed out. Change Punch day and Fan #, **Save**: the card moves to the end of the new band.
- [ ] **Pair** two jobs: same coloured number badge, side by side. **Unpair** removes it.
- [ ] **+ Add job** (Job # `TEST`, SB8, no punch day): the card appears under Unscheduled. **Dismiss job** (tap twice) removes it.
- [ ] **Find job #** `TEST` lists the dismissed job: **Restore** puts it in the Incoming tray. A Done job's **Reopen** puts it back on the boards (skip this if no job is Done yet, or first set a TEST row's JobStatus to Done in SharePoint).
- [ ] Ship-move tag: tap the amber "moved from" tag and it disappears. If SharePoint's ship date changed in the last minute, it warns and stays instead.
- [ ] With a panel open, the board doesn't refresh; with none open, another device's change shows within 60 seconds.

**Import** (`app/screens/scrImport.notes.md`)
- [ ] `hello` gives a red "not a White Board copy" message.
- [ ] Copy A and Copy A again are gates 1 and 3; don't repeat them.
- [ ] Place TEST-2 on Punch, then import Copy B: **Ship moves 1**, and Punch shows "moved from 10/10". Copy A again clears the flag.
- [ ] Dismiss TEST-1 (Punch > Find > Open > Dismiss twice), import Copy A: **Blocked 1**. **Restore** brings it back to the tray.
- [ ] Copy C shows the red "Narrow pull" banner and still imports.
- [ ] A fast double tap on an old copy only asks again; **Cancel** imports nothing.
- [ ] A real CASMFG copy imports with nothing in **Failed**. The same copy again gives Added 0, Ship moves 0.

**Assembly** (`app/screens/scrAssembly.notes.md`)
- [ ] **Assign** a tray job to Line 2 on a weekday: it lands at the bottom of that cell, and the counts go up.
- [ ] A size 4 job on Line 1 on a Saturday shows two amber warnings, saves anyway, and gets an amber border and warning button.
- [ ] **Cancel** changes nothing.
- [ ] Up and down arrows reorder within a cell; a pair moves as one block.
- [ ] **Start** turns green with today's date (Started and StartedOn in SharePoint); tapping again clears both.
- [ ] A started job whose ship date was yesterday disappears; **Show started** brings it back.
- [ ] Slack: Monday assembly with a Friday ship shows green "+4".
- [ ] With 3 or more jobs in one cell, no card is cut off and the next day's date bars don't overlap them. If they do, follow `app/fallbacks/scrAssembly.6a-fixed-rows.md`.

**Nesting** (`app/screens/scrNesting.notes.md`)
- [ ] SB8 jobs come before SB15, Unscheduled first. **Not nested only** hides nested jobs.
- [ ] Tapping a grey gauge turns it yellow (Need in SharePoint); a punched (green) gauge refuses.
- [ ] Type a label and tap **Save**: one new version in SharePoint's Version history. Tapping away also saves.
- [ ] **Nested** removes the row (with a banner); turn the switch off and it shows "Nested" in green.
- [ ] Another device's change shows within about 30 seconds (don't tap into a label box during this check).

**SB8 / SB15** (`app/screens/scrTurret.notes.md`)
- [ ] Only that machine's Nested jobs that aren't finished on the turret show, under day headers (a job with no gauges selected shows "No gauges selected").
- [ ] Tapping a yellow "14 ga" turns it green (Done14 = Yes); tapping again undoes it.
- [ ] The last gauge shows a green banner and the card leaves. **Show complete** brings it back to undo.
- [ ] The `&screen=sb15` link opens straight on SB15.

**Bending** (`app/screens/scrBending.notes.md`)
- [ ] Nested jobs in ship order, a pair together. Cards not fully punched are dimmed.
- [ ] **Ready only** hides the dimmed cards.
- [ ] **PB** and **P4** turn green and only change their own column. Both done: the card leaves with a banner. **Show complete** brings it back.

**TV** (`app/screens/scrTV.notes.md`)
- [ ] Opens on the TV link. Today's row is blue, and the next 5 days are always there.
- [ ] The cards and counts match Punch (Show completed off). Unscheduled jobs aren't shown.
- [ ] Tapping cards and pills changes nothing.
- [ ] Ticking a job's **last** yellow gauge on SB8 makes it leave the TV within about a minute.
- [ ] The page turns every 30 seconds when the board needs more than one page. The clock moves.

### G3. Clean up
- [ ] On Punch, **Find job #** `TEST`, then **Open** and **Dismiss job** (twice) on each TEST row.
- [ ] A site Owner deletes the TEST rows in SharePoint. These are the only rows anyone ever deletes.

When every box is ticked, the app is ready to go live.
