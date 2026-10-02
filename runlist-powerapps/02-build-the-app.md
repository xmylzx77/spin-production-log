# Build the White Board app, paste by paste

This guide builds the app in Power Apps. You copy a file from the `app` folder, paste it into Power Apps Studio, and check that it looks right. There are 22 pastes, a few settings, then sharing, links for each device and a go-live test.

- **Time:** about 2 hours for the pastes, and about 1.5 hours for the tests.
- **Before this:** `01-sharepoint-list-setup.md` is done. The RunListJobs list exists, and IT has made the **RunList Users** and **RunList Viewers** groups.
- **Nothing premium:** the app uses only the SharePoint list RunListJobs.
- **More detail:** each screen has a notes file next to its code, for example `app/screens/scrPunch.notes.md`. Open it if a step here isn't enough.

---

## How every paste works

### Copy a whole file
Always copy the **whole** file. A missing first or last line breaks the paste.
- **On GitHub:** open the file and click **Copy raw file** (the two-squares icon at the top right of the file).
- **On your PC:** right-click the file > **Open with** > **Notepad**, then press **Ctrl+A** and **Ctrl+C**.
- Don't select the text with the mouse.

### Two kinds of paste
- **Formula-bar pastes** (Pastes 1, 2 and 22, the `.txt` files). Click the item in Tree view, pick the property in the drop-down at the top left of the formula bar, click into the formula bar, press **Ctrl+A**, press **Ctrl+V**, then press **Enter**. Never type an `=` in front.
- **Screen pastes** (the `.yaml` files). Right-click the place that the paste header names in **Tree view** (the layers icon on the left), then choose **Paste**. If Paste isn't in the menu, click that place once and press **Ctrl+V**.
- The first time you paste, the browser asks to use the clipboard: click **Allow**.

### After every paste: the checks
1. **Name.** The new screen's name in Tree view must not end in `_1`. If it does, delete that copy and see "If a paste fails".
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
| Nothing happens when you paste | Edge: **Settings > Cookies and site permissions > Clipboard**, add `https://make.powerapps.com` to **Allow**. Then paste again. |
| A name ends in `_1` | That name already existed. Delete the pasted copy. If you're replacing a screen, first copy the old one to Notepad as a backup, delete it, then paste again. |
| "Name isn't recognized" for something that exists | Use the "type a space" fix above. |
| The error names a control version (like `@2.2.0`) | Stop and report it. The screens all use the same versions. |
| The controls landed in the wrong place | Select them in Tree view, press **Delete**, click the right place, press **Ctrl+V**. |
| "While scanning a plain scalar..." or another YAML error | The copy wasn't complete. Copy the whole file again with the method above. |

---

## Part A. One-time setup (about 10 minutes)

1. **Browser.** Use Microsoft Edge or Chrome at https://make.powerapps.com.
2. **Create the app.** At the top right, pick the environment IT gave you ('Production PowerApps'). Then go to **Create > Blank app > Blank canvas app**. Name it `White Board`, choose Format **Tablet**, and click **Create**.
3. **Display.** In Studio, open **Settings** (gear icon, top bar) **> Display**. Check that **Scale to fit** is **On** and **Lock aspect ratio** is **On**. Leave the size at 16:9 (1366 x 768).
4. **Row limit.** **Settings > General > Data row limit**: set it to **2000**.
5. **Analysis engine.** **Settings > Updates > New**: **New analysis engine** should be **On** (it's on by default). Nothing in this app needs you to change it.
6. **Error handling.** **Settings > Updates > Retired**: keep **Disable formula-level error management** **Off**. The app needs it to clear values.
7. **Data.** Click the **Data** icon (cylinder) on the left, then **Add data**. Search for **SharePoint**, pick the connection, then the team site from `01-sharepoint-list-setup.md`. Tick **RunListJobs** and click **Connect**. RunListJobs now shows under Data.

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

The screen notes number the screen pastes like the build contract (4a, 4b ...). Each header below shows both numbers.

### Paste 1: App.OnStart

```
PASTE 1 of 22: App > OnStart (formula bar) - file app/App.OnStart.txt
Before this: Part A done. RunListJobs connected.
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
After: run the checks. Expected: exactly 1 error, on btnPunImport (OnSelect): "scrImport isn't recognized".
       Normal; it clears after Paste 12 or in the fix-up step. The Incoming tray stays empty until Paste 11.
```

If you used the OnStart fallback, delete **Screen1** now.

```
PASTE 5 of 22 (notes: 4b): scrPunch part 2 of 8, edit panel fields - file app/screens/scrPunch.2.yaml
Before this: Paste 4 done.
Where: Tree view → expand scrPunch → right-click conPunEditPanel → Paste.
After: run the checks. Expected: no new errors (only the btnPunImport one). The panel stays hidden; that's normal.
```

```
PASTE 6 of 22 (notes: 4c): scrPunch part 3 of 8, edit panel pairing and buttons - file app/screens/scrPunch.3.yaml
Before this: Paste 5 done.
Where: Tree view → scrPunch → right-click conPunEditPanel → Paste (the same container as Paste 5).
After: run the checks. Expected: no new errors (only the btnPunImport one).
```

```
PASTE 7 of 22 (notes: 4d): scrPunch part 4 of 8, Place panel - file app/screens/scrPunch.4.yaml
Before this: Paste 4 done.
Where: Tree view → scrPunch → right-click conPunPlacePanel → Paste.
After: run the checks. Expected: no new errors (only the btnPunImport one).
```

```
PASTE 8 of 22 (notes: 4e): scrPunch part 5 of 8, Find job # panel - file app/screens/scrPunch.5.yaml
Before this: Paste 4 done.
Where: Tree view → scrPunch → right-click conPunFindPanel → Paste.
After: run the checks. Expected: no new errors (only the btnPunImport one).
```

```
PASTE 9 of 22 (notes: 4f): scrPunch part 6 of 8, SB8 punch card - file app/screens/scrPunch.6.yaml
Before this: Paste 4 done.
Where: Tree view → scrPunch → expand galPunBoard → expand galPunCardsS8 → right-click conPunCardS8 → Paste.
       It must be conPunCardS8 (the container INSIDE galPunCardsS8), not a gallery.
After: run the checks. Expected: no new errors (only the btnPunImport one).
```

```
PASTE 10 of 22 (notes: 4g): scrPunch part 7 of 8, SB15 punch card - file app/screens/scrPunch.7.yaml
Before this: Paste 9 done.
Where: Tree view → scrPunch → galPunBoard → expand galPunCardsS15 → right-click conPunCardS15 → Paste.
After: run the checks. Expected: no new errors (only the btnPunImport one).
```

```
PASTE 11 of 22 (notes: 4h): scrPunch part 8 of 8, Incoming tray list - file app/screens/scrPunch.8.yaml
Before this: Paste 4 done.
Where: Tree view → scrPunch → right-click conPunTray (the left-hand container) → Paste.
       Don't select galPunBoard or any other gallery.
After: run the checks. Expected: no new errors (only the btnPunImport one).
       galPunTray is now the last item inside conPunTray.
```

Press **Ctrl+S**. If the list already has jobs, press **F5** to look: day bands with SB8 cards on the left and SB15 cards on the right. If the bands overlap or cards are cut off, see the Punch notes, "Assumptions and uncertainties", row 1: one property change (F1) fixes it.

### Pastes 12 and 13: Import screen (2 parts)

```
PASTE 12 of 22 (notes: 5a): screen scrImport, part 1 of 2 (new screen) - file app/screens/scrImport.1.yaml
Before this: Pastes 1-11 done.
Where: Tree view → Screens tab → right-click any screen → Paste.
After: run the checks. Expected: 0 errors on scrImport. One error may show on scrImport's OnVisible
       ("txtImpPaste isn't recognized"): use the "type a space" fix on scrImport > OnVisible.
       The scrImport errors on Home's and Punch's Import buttons may clear now; if not, the fix-up step clears them.
```

```
PASTE 13 of 22 (notes: 5b): scrImport part 2 of 2, result lists - file app/screens/scrImport.2.yaml
Before this: Paste 12 done.
Where: Tree view → expand scrImport → right-click conImpResults → Paste. Not the screen, not galImpTiles.
After: run the checks. Expected: 0 errors. The lists stay hidden; that's normal.
```

**Check where Paste 13 landed:** expand **conImpResults**. These 7 must be inside it: lblImpFailHead, galImpFailed, lblImpBlockHead, galImpBlocked, lblImpChgHead, lblImpChgEmpty, galImpChanges. If they're somewhere else, select those 7, press **Delete**, and paste again on conImpResults. Then **Ctrl+S**.

### Pastes 14 to 16: Assembly screen (3 parts)

```
PASTE 14 of 22 (notes: 6a): screen scrAssembly, part 1 of 3 (new screen) - file app/screens/scrAssembly.1.yaml
Before this: Pastes 1-13 done.
Where: Tree view → Screens tab → right-click any screen → Paste.
After: run the checks. Expected: 0 errors. Don't press F5 until Paste 16 is done.
```

```
PASTE 15 of 22 (notes: 6b): scrAssembly part 2 of 3, Assign panel - file app/screens/scrAssembly.2.yaml
Before this: Paste 14 done.
Where: Tree view → expand scrAssembly → right-click conAsmPanel → Paste.
After: run the checks. Expected: 0 errors. conAsmPanel now holds 11 controls (lblAsmPTitle ... btnAsmPCancel).
```

```
PASTE 16 of 22 (notes: 6c): scrAssembly part 3 of 3, grid card - file app/screens/scrAssembly.3.yaml
Before this: Pastes 14 and 15 done.
Where: Tree view → scrAssembly → expand galAsmDays → expand galAsmCells → right-click conAsmCard → Paste.
After: run the checks. Expected: 0 errors.
```

**Check Paste 16 by eye, because a wrong place gives no error:** the 19 new controls (lblAsmJob ... icoAsmEdit) must be indented **under conAsmCard**, not next to it under galAsmCells. If they're next to it, delete those 19, click conAsmCard, and press **Ctrl+V**. Then **Ctrl+S**.

### Paste 17: Nesting screen

```
PASTE 17 of 22 (notes: 7): screen scrNesting (new screen) - file app/screens/scrNesting.yaml
Before this: Pastes 1-16 done.
Where: Tree view → Screens tab → right-click any screen → Paste.
After: run the checks. Expected: 0 errors. The last control in the file is tmrNesRefresh.
```

### Paste 18: SB8 / SB15 turret screen

```
PASTE 18 of 22 (notes: 8): screen scrTurret (new screen) - file app/screens/scrTurret.yaml
Before this: Pastes 1-17 done.
Where: Tree view → Screens tab → right-click any screen → Paste.
After: run the checks. Expected: 0 errors. One screen serves both SB8 and SB15.
```

If a formula that uses lblTurMachine or tglTurShowDone says "isn't recognized", use the "type a space" fix on it.

### Paste 19: Bending screen

```
PASTE 19 of 22 (notes: 9): screen scrBending (new screen) - file app/screens/scrBending.yaml
Before this: Pastes 1-18 done.
Where: Tree view → Screens tab → right-click any screen → Paste.
After: run the checks. Expected: 0 errors.
```

### Pastes 20 and 21: TV screen (2 parts)

```
PASTE 20 of 22 (notes: 10a): screen scrTV, part 1 of 2 (new screen) - file app/screens/scrTV.1.yaml
Before this: Pastes 1-19 done.
Where: Tree view → Screens tab → right-click any screen → Paste.
After: run the checks. Expected: 0 errors. You see the header and two column titles; the board is empty for now.
```

```
PASTE 21 of 22 (notes: 10b): scrTV part 2 of 2, the board and timers - file app/screens/scrTV.2.yaml
Before this: Paste 20 done.
Where: Tree view → right-click scrTV (the SCREEN itself, not conTvHeader) → Paste.
After: run the checks. Expected: 0 errors. galTvBoard, tmrTvRefresh and tmrTvPage sit directly under scrTV,
       at the same level as conTvHeader. If they landed inside conTvHeader, press Ctrl+Z and paste again on scrTV.
```

Press **Ctrl+S**.

### Paste 22: App.StartScreen

```
PASTE 22 of 22: App > StartScreen (formula bar) - file app/App.StartScreen.txt
Before this: Pastes 1-21 done (every screen it names exists).
Where: Tree view → click App → property list → StartScreen → formula bar → Ctrl+A → Ctrl+V → Enter.
After: run the checks. Expected: 0 errors.
```

This picks the first screen from the device's link (Part F).

### Fix-up step (no paste)

Some buttons were pasted before the screen they open existed. Re-enter their formulas now. For each row: click the button in Tree view, pick **OnSelect**, click into the formula bar, type a space at the end, delete it, and press **Enter**. If the red mark stays, press **Ctrl+A** in the formula bar, paste the formula from the table (no `=` in front), and press **Enter**. Do **SB8 and SB15 first**.

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

Then:
1. Open **App checker**. The **Formulas** section must be empty. (Accessibility items are fine.)
2. In Tree view, drag **scrHome** to the top of the Screens list.
3. If any red mark won't clear: **Ctrl+S**, close the Studio tab, and open the app again from make.powerapps.com (Studio re-checks every formula when it opens). If it's still red, check that the screen name has no `_1`, and report it.

---

## Part D. Save and publish

1. Press **Ctrl+S**.
2. Click **Publish** (top right), then **Publish this version**.
3. Do this again after any later change: people always get the last **published** version.

## Part E. Share

1. Go to https://make.powerapps.com > **Apps**.
2. Next to **White Board**, click **...** (More commands) > **Share**.
3. Type `RunList Users`, pick the group, and leave **Co-owner** unticked.
4. Type `RunList Viewers`, pick the group, and leave **Co-owner** unticked.
5. Click **Share**.

Sharing the app does **not** give access to the list. The list permissions from `01-sharepoint-list-setup.md` step 9 do that. RunList Users can change jobs; RunList Viewers (the TV) can only look. Only these Entra security groups work here; a SharePoint group can't be used to share an app.

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
- Sign in to the browser with that device's licensed work account (in RunList Users, or RunList Viewers for the TV).
- Open its link, click **Allow** when asked, and save it as a bookmark. To open it at start-up in Edge: **Settings > Start, home, and new tabs > Open these pages**.
- The device's time zone must be the shop's time zone (the same as the SharePoint site).
- **Floor tablets and the TV:** keep the app's tab in front (browsers slow down timers in hidden tabs). On the TV, press **F11** for full screen and turn off sleep and the screen saver.
- **Import PC:** install the CASMFG copy button. Follow "HOW TO INSTALL" at the top of `casmfg-copy-jobs.user.js` (Tampermonkey > Create a new script > paste the file > Save).

---

## Part G. Go-live test checklist

Test in the **published** app (Part F links), not only in Studio. Use TEST jobs: job number `TEST`, made by the Import test copies or with Punch > **+ Add job**. Keep SharePoint open in another tab to check values. Each screen's notes file has the full steps ("Manual test").

### G1. The five gates (list-design step 20). Don't go live until all five pass.
- [ ] **1. Import date.** On Import, paste "Copy A" from `app/screens/scrImport.notes.md` (Manual test) and tap **Import**, then **Import anyway**. In SharePoint, row TEST|1 shows ShipDate **10/3/2026** (not 10/2 or 10/4). Its Incoming card on Punch shows ship 10/3.
- [ ] **2. Date picker.** On a tablet, Punch > pencil on a TEST job > set **Punch day** > **Save**. SharePoint shows the same day.
- [ ] **3. Same copy twice.** Paste Copy A again and import. The tiles show **Added 0, Ship moves 0**.
- [ ] **4. Two devices.** Tick a gauge on the SB8 tablet. A second device on Bending or Turret shows it within 30 seconds (the TV within 60).
- [ ] **5. PB and P4 together.** Two tablets on Bending tap **PB** and **P4** on the same TEST job within a few seconds. Both stay green, and SharePoint shows both as Yes.

If gate 1 or 2 is off by one day, **stop and report it**. It gets fixed once, centrally, never per screen.

- [ ] **Clearing a choice.** Punch > pencil on a TEST job that has an Assembly line > in **Assembly line**, pick the empty entry at the top of the list > **Save**. SharePoint's AssemblyLine is empty. If a banner says "Saved, but the assembly line did not change", report it.

### G2. Screen by screen

**Home** (`app/screens/scrHome.notes.md`)
- [ ] Each of the 8 buttons opens its screen, and that screen's **Home** button comes back.
- [ ] **SB8** shows "SB8" in light blue; **SB15** shows "SB15" in purple.
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
- [ ] **Find job #** `TEST` lists the dismissed job: **Restore** puts it in the Incoming tray. A Done job's **Reopen** puts it back on the boards.
- [ ] Ship-move tag: tap the amber "moved from" tag and it disappears. If SharePoint's ship date changed in the last minute, it warns and stays instead.
- [ ] With a panel open, the board doesn't refresh; with none open, another device's change shows within 60 seconds.

**Import** (`app/screens/scrImport.notes.md`)
- [ ] `hello` gives a red "not a White Board copy" message.
- [ ] Copy A: **Added 3, Watch only 1**. Copy A again: Added 0, Ship moves 0 (gates 1 and 3).
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

**Nesting** (`app/screens/scrNesting.notes.md`)
- [ ] SB8 jobs come before SB15, Unscheduled first. **Not nested only** hides nested jobs.
- [ ] Tapping a grey gauge turns it yellow (Need in SharePoint); a punched (green) gauge refuses.
- [ ] Type a label and tap **Save**: one new version in SharePoint's Version history. Tapping away also saves.
- [ ] **Nested** removes the row (with a banner); turn the switch off and it shows "Nested" in green.
- [ ] Another device's change shows within about 30 seconds (don't tap into a label box during this check).

**SB8 / SB15** (`app/screens/scrTurret.notes.md`)
- [ ] Only that machine's Nested jobs with a gauge still to punch show, under day headers.
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
- [ ] A finished gauge on SB8 makes that job leave the TV within about a minute.
- [ ] The page turns every 30 seconds when the board needs more than one page. The clock moves.

### G3. Clean up
- [ ] On Punch, **Find job #** `TEST`, then **Open** and **Dismiss job** (twice) on each TEST row.
- [ ] A site Owner deletes the TEST rows in SharePoint. These are the only rows anyone ever deletes.

When every box is ticked, the app is ready to go live.
