# scrHome: paste notes

This screen is **one paste**: `scrHome.yaml` (394 lines, 21 controls plus the screen). Every name contains `Hom`. The screen shows the title, eight big buttons (one per screen) and a line saying who is signed in. It reads no job data and writes nothing.

---

## Paste steps

```
PASTE 3 of 12: screen scrHome (new screen)
Before this: Pastes 0-2 done (setup, App.OnStart, App.Formulas). TheWhiteBoard connected.
Where: Tree view > Screens tab > right-click Screen1 (the only screen so far) > Paste.
       Copy ALL of scrHome.yaml: 394 lines. Use the copy button; don't select by hand.
       The first line is "Screens:". The file ends with control lblHomTVInfo (the grey
       line under the TV button), and these are its LAST 5 lines (in the file each one
       starts with 12 spaces):
                   Text: ="Wall display, read only"
                   Width: =300
                   Wrap: =false
                   X: =1019
                   Y: =658
       Careful: the line "Y: =658" on its own appears 4 times in the file. Only the one
       right after "Wrap: =false" under "Wall display, read only" is the end.
After: 1. Tree view: a new screen "scrHome" (no _1 at the end). Open it: it must hold
          lblHomTVInfo and 21 controls in all (list below). If lblHomTVInfo or any other
          control in the list is missing, the copy stopped early: delete scrHome
          (right-click > Delete) and paste again.
       2. Run the 3.4 checks. Expected: a red mark on each of the 8 big buttons (Punch,
          Assembly, Nesting, Import, SB8, SB15, Bending, TV), all on OnSelect. The message
          says a screen name (scrPunch, scrAssembly, scrNesting, scrImport, scrTurret,
          scrBending, scrTV) "isn't recognized", and the same formula may ALSO say
          "The function 'Navigate' has some invalid arguments". Both are normal: those
          screens don't exist yet. So App checker's "Formulas" section may list anything
          from 8 to 16 items, all on those 8 OnSelect formulas. They are fixed in Paste 12
          (see "Paste 12 fix-up" below).
       3. App checker's "Accessibility" section may list items such as "Focus isn't
          showing" for the 8 big buttons. That is on purpose (touch screens; the focus
          border is turned off as in contract 9.1). Ignore the Accessibility section;
          only the "Formulas" section counts.
       An error on any OTHER control or property (for example on a clr... colour, or on
       lblHomUser) is not expected: report it.
Then:  delete Screen1 (Tree view > right-click Screen1 > Delete) and save (Ctrl+S).
       Exception: if you used the Paste 1 fallback (two lines in Screen1's OnVisible), keep
       Screen1 for now and delete it right after Paste 4 instead.
```

In Tree view, under scrHome, you should see these 21 controls (Studio may list them in reverse order, so `lblHomTVInfo` is often at the top):

- `conHomHeader`, holding `lblHomTitle` and `lblHomUser`
- `lblHomPlan` ("Planning"), then `btnHomPunch`, `lblHomPunchInfo`, `btnHomAssembly`, `lblHomAssemblyInfo`, `btnHomNesting`, `lblHomNestingInfo`, `btnHomImport`, `lblHomImportInfo`
- `lblHomFloor` ("Shop floor"), then `btnHomSB8`, `lblHomSB8Info`, `btnHomSB15`, `lblHomSB15Info`, `btnHomBending`, `lblHomBendingInfo`, `btnHomTV`, `lblHomTVInfo`

If the paste fails, nothing is created. Send the exact error text, "Paste 3", and what was selected in Tree view (guide 3.7).

### Paste 12 fix-up (this screen's part)

After every other screen is in (Pastes 4-10) and StartScreen is done (Paste 11), re-enter the eight button formulas so Studio finds the screens. For each row: click the button in Tree view, pick **OnSelect** in the property list, click into the formula bar, type a space at the end, delete it, and press **Enter** (guide 3.4). If that doesn't clear the red mark, press Ctrl+A in the formula bar and paste the formula from the table (no `=` in front). One re-entry clears both messages on a button ("isn't recognized" and "invalid arguments").

Do **SB8 and SB15 first**.

| Screen | Control | Property | Formula (formula bar, no leading `=`) |
|---|---|---|---|
| scrHome | btnHomSB8 | OnSelect | `Set(varMachine, "SB8"); Navigate(scrTurret, ScreenTransition.None)` |
| scrHome | btnHomSB15 | OnSelect | `Set(varMachine, "SB15"); Navigate(scrTurret, ScreenTransition.None)` |
| scrHome | btnHomPunch | OnSelect | `Navigate(scrPunch, ScreenTransition.None)` |
| scrHome | btnHomAssembly | OnSelect | `Navigate(scrAssembly, ScreenTransition.None)` |
| scrHome | btnHomNesting | OnSelect | `Navigate(scrNesting, ScreenTransition.None)` |
| scrHome | btnHomImport | OnSelect | `Navigate(scrImport, ScreenTransition.None)` |
| scrHome | btnHomBending | OnSelect | `Navigate(scrBending, ScreenTransition.None)` |
| scrHome | btnHomTV | OnSelect | `Navigate(scrTV, ScreenTransition.None)` |

Then, as the contract's Paste 12 says, drag **scrHome** to the top of the Screens list and save. App checker's **Formulas** section should now list nothing for scrHome, and no button has a red mark. The **Accessibility** section may still list "Focus isn't showing" for the 8 big buttons: that is on purpose, ignore it.

---

## What you should see

In the editor, right after Paste 3 (the red marks on the buttons don't change how it looks):

- A dark blue-black page.
- **Header bar** (slightly lighter): "The White Board" in bold on the left. On the right, in grey: "Signed in as" and your name. If the account has no display name, you see its email address. If it has neither, you see "unknown user".
- **"Planning"** in small grey text, then four big blue buttons with white text: **Punch**, **Assembly**, **Nesting**, **Import**.
- **"Shop floor"**, then four big buttons: **SB8** (light blue), **SB15** (purple), **Bending** (teal), all with dark text, and **TV** (grey, white text).
- Under each button, one line of grey text says what the screen is for, for example "Place and order punch jobs" or "Check off gauges on SB8".

The colours match each screen: SB8, SB15 and Bending use the same accent colours as their own screens. On a PC, a button darkens a little when the mouse is over it and more while it's pressed.

## Manual test (after Paste 12, in Preview)

1. **Look.** Select scrHome in Tree view and press **F5**. You see the title, your name on the right, and the eight buttons in two rows of four.
2. **Punch.** Tap **Punch**: the Punch board opens. Tap **Home** (top right): you're back here.
3. **Planning row.** Do the same with **Assembly**, **Nesting** and **Import**. Each opens its screen, and that screen's **Home** button brings you back.
4. **SB8.** Tap **SB8**: the turret screen opens with "SB8" in light blue and only SB8 jobs. Tap **Home**.
5. **SB15.** Tap **SB15**: the turret screen shows "SB15" in purple and only SB15 jobs. Tap **Home**, then **SB8** again: it shows SB8. The turret screen always follows the last machine button you tapped.
6. **Bending and TV.** Tap **Bending**, then **Home**. Tap **TV**, then **Home**. Both open and come back.
7. **Mouse (PC).** Move the mouse over a button: it darkens a little. Press and hold: it darkens more.
8. **Bookmarks** (after Paste 11 and **Publish**, in the played app, not in Studio). Open the app's web link with nothing added: Home opens. Add `&screen=sb15` to the end: the SB15 turret opens directly. Tap **Home**, then **SB8**: it shows SB8. Add `&screen=anything`: Home opens.
9. **Other accounts.** Open the app on a floor tablet: the right side of the header shows that tablet's account name, so you can see which account a device is signed in with.
10. **App checker** (Esc out of Preview first). Open App checker (stethoscope). The **Formulas** section lists nothing for scrHome. Anything under **Accessibility** (for example "Focus isn't showing" on the big buttons) is expected and can be ignored.

---

## Decisions and assumptions (each with its fallback)

| # | What I did | Why | If you want it different |
|---|---|---|---|
| A1 | **Needs your yes (open issue O1).** The buttons are in **two labelled rows**: "Planning" (Punch, Assembly, Nesting, Import) and "Shop floor" (SB8, SB15, Bending, TV). app-spec lists them as Punch, Assembly, Nesting, SB8, SB15, Bending, TV, Import. That order is kept inside each row; only Import moved up next to the other office screens. | In app-spec's order, four to a row, SB8 and SB15 would land on different rows. Grouping by who uses the screen is easier to scan. It changes no behaviour or data. | Apply the "A1 fallback" property patch below (14 rows): it puts the buttons in app-spec's exact order and hides the two row headings. |
| A2 | The signed-in line is on the **right of the header**: "Signed in as" + `User().FullName`. If that's empty it shows the email, and if both are empty it shows "unknown user". | app-spec asks for a small line with `User().FullName`. The header is always visible. The fallbacks mean the line is never just "Signed in as". | Ask to move it to the bottom of the screen. |
| A3 | Colours: blue for the four planning buttons (the contract's action colour), the screen accents for SB8 / SB15 / Bending, and grey for TV (the TV title is plain text colour, so it has no accent of its own). | Each button matches the screen it opens. | Ask. It's one `Fill` (and `Color`) patch per button. |
| A4 | Each button has a **grey line of text under it** saying what the screen is for. Only the button itself is tappable, not the grey line. | It helps new people find the right screen. Making the grey line tappable would add 8 more formulas to fix in Paste 12. | Hide any line with its `Visible` = `false`. |
| A5 | Home has **no Refresh button, no timer and no OnVisible**, and shows no job counts. | Contract section 1 (no timer for scrHome) and 7.2 (scrHome is the one screen without the refresh in OnVisible). Home reads no list data, so it opens instantly and doesn't load the jobs until you open a board. | Ask if you want job counts on the buttons. That would load the jobs on Home too. |
| A6 | **No date or clock** on Home. | Home never refreshes, so a date shown here would stay on yesterday's date if a PC was left on Home overnight. | Ask. |
| A7 | Opening Home doesn't clear `varMachine`. | It isn't needed: SB8 and SB15 always set it right before opening the turret screen. A device opened with a `&screen=sb8`/`sb15` bookmark keeps working until someone uses Home's buttons. | None needed. |
| A8 | The title uses the same size (22) as every other screen's header (contract 9.1). | All headers match. | lblHomTitle `Size` = `28` makes it bigger. |
| A9 | The 8 big buttons have `FocusedBorderThickness` = `0`, as every button in contract 9.1. | Touch screens: no focus outline left behind after a tap. App checker's Accessibility section lists this as "Focus isn't showing"; that is expected. | Ask. It's one `FocusedBorderThickness` patch per button (for example `2`). |

### A1 fallback: app-spec order (only if you say so)

Applies with guide 3.3 / 3.6 (select the control, pick the property, Ctrl+A, paste, Enter). Result, left to right: row 1 **Punch, Assembly, Nesting, SB8**; row 2 **SB15, Bending, TV, Import**. Each grey line moves with its button. The "Planning" and "Shop floor" headings are hidden because they no longer fit the rows. Nothing else changes: no formula, colour or name.

| Screen | Control | Property | New formula (paste into formula bar) |
|---|---|---|---|
| scrHome | btnHomSB8 | X | `1019` |
| scrHome | btnHomSB8 | Y | `148` |
| scrHome | lblHomSB8Info | X | `1019` |
| scrHome | lblHomSB8Info | Y | `354` |
| scrHome | btnHomSB15 | X | `47` |
| scrHome | lblHomSB15Info | X | `47` |
| scrHome | btnHomBending | X | `371` |
| scrHome | lblHomBendingInfo | X | `371` |
| scrHome | btnHomTV | X | `695` |
| scrHome | lblHomTVInfo | X | `695` |
| scrHome | btnHomImport | Y | `452` |
| scrHome | lblHomImportInfo | Y | `658` |
| scrHome | lblHomPlan | Visible | `false` |
| scrHome | lblHomFloor | Visible | `false` |

Check after: eight buttons in two rows of four with no overlap, each grey line directly under its own button. Manual test steps 1-7 still apply.

## Uncertainties and fallbacks

| # | What could differ in Studio | How you'll notice | Fallback |
|---|---|---|---|
| U-a | **Re-entering doesn't clear an error.** The contract expects the "type a space" fix to clear the "isn't recognized" (and "invalid arguments") errors once the screens exist (guide 3.4, U3). | A button still has a red mark after you re-enter its formula. | Paste the formula from the Paste 12 table with Ctrl+A, then paste. If it's still red: save (Ctrl+S), close the Studio tab and open the app again from make.powerapps.com, because Studio re-checks every formula when it opens an app. If it's still red after that, check that the target screen's name in Tree view is exactly as in the table (no `_1`). |
| U-b | **Only with the Paste 1 fallback** (no App.OnStart): `varMachine` is created by the SB8 / SB15 buttons. While those two formulas are red (from Paste 4, when Screen1 is deleted, to Paste 12), Studio may not treat `varMachine` as existing. | At Paste 8 or 12, scrTurret's `lblTurMachine` (Text) says `varMachine` isn't recognized. | Re-enter btnHomSB8 and btnHomSB15 first (Paste 12 table), then re-enter lblTurMachine's `Text` the same way. With App.OnStart (the normal path), this can't happen. |
| U-c | **Shared tablet accounts.** `User().FullName` is the account's display name in Microsoft 365. | A tablet shows something like "Signed in as Shop Tablet 3". In the editor, it shows your own name. | That's expected; nothing to fix. |
| U-d | **Look while tapping.** A button turns off for a moment after a tap, so a double tap can't open the screen twice. I gave the off look the same darker shade as the pressed look. | A brief darker flash on tap. | None needed. |
| U-e | **Control versions** (guide U1). | The paste fails with a message that names a version. | Follow guide U1 and send the message. Nothing is created, so it's safe to paste again after the fix. |
| U-f | **How many messages App checker shows after Paste 3.** Studio often adds "The function 'Navigate' has some invalid arguments" next to "isn't recognized". Not checkable offline. | App checker's Formulas section shows between 8 and 16 items, all on the 8 buttons' OnSelect. | None needed: the Paste 3 "After" step accepts both. Only a message on another control or property is a problem. |
| U-g | **Accessibility items.** App checker's Accessibility rules flag buttons whose focus border is 0. Exact wording and severity are from memory, not checked in Studio. | Items such as "Focus isn't showing" under Accessibility, on the 8 big buttons. | Ignore them (A9). They don't block saving, publishing or the paste. |
| U-h | **A hand-copied paste that stops early.** The 4 grey lines in the "Shop floor" row all end in `Y: =658`, so a selection that stops at one of the first three still pastes without an error. | Fewer than 21 controls under scrHome; `lblHomTVInfo` missing. | Paste 3 "After" step 1: delete scrHome and paste again with the copy button. |

## Requests for App.Formulas / CONTRACT

None for **App.Formulas**. The screen uses only existing names: the colours `clrPage`, `clrCard`, `clrText`, `clrMuted`, `clrWhite`, `clrBlue`, `clrGrey`, `clrSB8`, `clrSB15` and `clrBending`, the global `varMachine` (contract section 4), and the screen names from contract section 1.

For **CONTRACT.md** (or guide 3.4); these affect every screen, so they belong in the shared files. Until then, this file carries the same wording locally (Paste 3 "After", Paste 12, test step 10).

| # | Where | Request | Local workaround |
|---|---|---|---|
| C1 | CONTRACT 9.1 (or guide 3.4) | Add one line: "App checker's Accessibility section lists 'Focus isn't showing' for every button with `FocusedBorderThickness` 0. That is on purpose (touch screens). Ignore it; only the Formulas section counts." Every screen built from 9.1 has these buttons, so every screen's paste step would otherwise get the same false alarm. | Paste 3 "After" step 3, Paste 12, test step 10, A9, U-g. |
| C2 | CONTRACT section 1, Paste 12 row | After "Name isn't recognized", add: "the same formula may also say 'The function Navigate has some invalid arguments'; it clears with the same re-entry." This also covers scrPunch's Import button. | Paste 3 "After" step 2, Paste 12 intro, U-a, U-f. |

## Open issues

| # | Issue | Who | What happens next |
|---|---|---|---|
| O1 | **Button order (A1) differs from app-spec.** app-spec lists Punch, Assembly, Nesting, SB8, SB15, Bending, TV, Import; the screen groups them as Planning / Shop floor with Import in the top row. The contract says to raise app-spec differences instead of deciding alone. | You (the user) | Say yes to keep the two rows, or apply the "A1 fallback" patch (14 rows, no re-paste). |
| O2 | **C1 and C2** wait for the contract owner. | Contract owner | No action on scrHome either way: its notes already say it. |
| O3 | **Studio-only checks.** `Navigate` with the screen names, the exact App checker messages (U-f) and the Accessibility items (U-g) can't be checked offline. | Person pasting | Paste 3 "After" and Paste 12 cover both outcomes; report anything else. |

## Data and contract compliance

- **TheWhiteBoard is never touched**: no read, no write, no Refresh. The screen doesn't use `ActiveJobs` or `IncomingJobs` either, so no delegation warning is possible.
- **Navigation** follows contract section 8 exactly: `Navigate(scrX, ScreenTransition.None)` (never `Back()`). SB8 / SB15 run `Set(varMachine, "SB8")` / `"SB15"` first. `varMachine` is the only global this screen sets, and it holds Text, the same type App.OnStart gives it.
- **Header** is contract 9.1's bar (AutoLayout, title stretching). There is no Home button, because this is Home, and no Refresh button (A5). There's no timer and no OnVisible (contract sections 1 and 7.2).
- **No `Font`** anywhere, no `#` colours, no `ColorValue`, no `Coalesce(x, "")`, and no emoji. All the text on the screen is plain ASCII.
- Checked offline (after review round 1; the YAML did not change in that round):
  - `tools/palint.py scrHome.yaml`: 0 errors, 0 warnings, 22 names.
  - `palint.py` on all screens in `app/screens/` together: 0 errors, 0 warnings, 425 names, no duplicate names.
  - In the Power Fx 1.8 interpreter (default and V1 modes), the signed-in line passed 5 cases: full name, empty name (falls back to email), blank name, and both blank or empty (shows "unknown user"). `User()` was replaced by a test record because it only exists in Studio. The SB8 / SB15 `Set` with scrTurret's machine expression passed 4 cases: Home > SB8, Home > SB15, an `sb15` bookmark with `varMachine` still `""`, and that bookmark followed by Home > SB8.
  - The A1 fallback positions were checked by hand: columns X 47 / 371 / 695 / 1019 (width 300, ending at 1319), rows Y 148 / 452 (height 200), grey lines at Y 354 / 658 (height 30, ending at 688). No two controls share a slot.
  - `Navigate` and the screen names can't be checked offline. They're the contract's exact formulas, and Paste 12 confirms them.

## Review log

**Round 1** (paste-validity review + logic/data review). Both found no blocking defects; `scrHome.yaml` is unchanged. Notes-only fixes:

- Applied: the end-of-copy marker is now the last 5 lines of `lblHomTVInfo`, not the `Y: =658` line that appears 4 times, plus a Tree view check for `lblHomTVInfo` and the 21 controls (Paste 3 "After" step 1, U-h). The reviewer's wording said the last line is "directly under" `Text`/`Wrap`; in the file `Width`, `Wrap` and `X` come between, so the 5 lines are quoted as they are.
- Applied: Paste 3 now expects one red mark per big button, with "isn't recognized" and possibly "invalid arguments" (8 to 16 App checker items), and says what is NOT expected (U-f, C2).
- Applied: App checker's Accessibility items ("Focus isn't showing") are expected and ignored, at Paste 3, Paste 12 and test step 10 (A9, U-g, C1).
- Applied: A1 (button order) is flagged as needing the user's yes (O1), with a ready 14-row property patch to app-spec's order.
- Rejected: none.
