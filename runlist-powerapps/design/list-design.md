# TheWhiteBoard list design (reference)

The design behind `01-sharepoint-list-setup.md`. It was drafted, then checked by three reviewers (Power Apps/SharePoint technical, shop workflow fit, import and data lifecycle), then finalized. The app code follows the rules on this page.

## Where, who, and system columns

ONE list only: TheWhiteBoard, with one row per job. No second list is needed: gauges, ticks, pairs and both schedules all fit on the job row, and capacities, settings, stats, approvals, QC and electrical were dropped.

WHERE: a SharePoint TEAM site in the company tenant. That can be an existing Production/Shop site, or a new site from IT such as "Shop Floor Apps". Do not use OneDrive or a personal site. The canvas app in the IT-managed 'Production PowerApps' environment reaches it through the standard SharePoint connector. There are no flows, nothing premium and no gateway. Ask IT to confirm that the environment's DLP policy allows the SharePoint connector.

FIRST: a site owner sets the site's Regional settings > Time zone to the shop's time zone, before any dates are entered. Every tablet, PC and the TV must use that same time zone in its device settings.

WHO GETS WHAT: the app runs as each signed-in user, so SharePoint permissions are the real security. Sharing the app does NOT give anyone access to the list.
- Ask IT for two Entra (Microsoft 365) SECURITY groups. A SharePoint group cannot be used to share a Power App, but a security group works for both the list and the app.
  - RunList Users: supervisors, the nester and every floor-tablet account.
  - RunList Viewers: the TV/Progress account and look-only people.
- Owners (Full Control): the builder plus one backup (IT). Only Owners can delete rows.
- RunList Users get a custom permission level, 'Contribute - no delete': a copy of Contribute with Delete Items and Delete Versions unticked.
  - The whole re-import guard depends on rows never being deleted. A deleted CASMFG job comes back as a new Incoming card on the next import.
  - The app never deletes, so nobody loses anything they need.
  - If IT cannot create a custom level, use Contribute and tell everyone never to delete a row. A deleted row can be restored from the site Recycle Bin for 93 days.
- RunList Viewers get Read.
- Break inheritance on the list and set the site Members group to Read, or remove it. Otherwise everyone in Members keeps Edit, which includes delete and changing columns.
- Share the canvas app (as User, not Co-owner) with both security groups.
- Every tablet and the TV must be signed in with a licensed M365 account (E3 includes Power Apps for Office 365) that is in one of the groups.
- Leave Advanced settings > Item-level permissions at 'Read all items' / 'Create and edit all items'. Otherwise one tablet cannot edit a job that another person created.

SYSTEM COLUMNS USED (nothing to create):
- ID: every Patch base record is LookUp(TheWhiteBoard, ID = n), which is delegable.
- Created: the NEW tag, meaning created today and CasmfgId is not blank.
- Modified / Modified By plus Version history: the audit trail of who ticked what.

## Status model, shared formulas and import contract

JobStatus (an indexed Choice) is the ONLY lifecycle field. Every server query starts with one indexed equality.

SHARED FORMULAS: the working set lives in App.Formulas named formulas, not in collections. Named formulas recalculate when the data source changes, so Refresh(TheWhiteBoard) and every Patch update every screen.
- ActiveJobs = Filter(TheWhiteBoard, JobStatus.Value = "Active"), plus local columns:
  - TurretDone = (Need12 || Need14 || Need16 || Need18 || Need20 || Need24) && (!Need12 || Done12) && (!Need14 || Done14) && (!Need16 || Done16) && (!Need18 || Done18) && (!Need20 || Done20) && (!Need24 || Done24)
  - PunchDone = TurretDone && PBDone && P4Done
  - the pair group keys GroupShip / GroupOrder
- IncomingJobs = Filter(TheWhiteBoard, JobStatus.Value = "Incoming").
Screens read ThisItem.TurretDone; the formula is written once.

1) INCOMING: created only by Import, with Machine blank, every Yes/No false and FanNumber blank (or pre-filled, see open question 1). Shown in the Punch Incoming tray, sorted by ShipDate. A CASMFG ship move simply overwrites ShipDate.

2) ACTIVE: the supervisor PLACES an Incoming job.
- Placing sets Machine (sizes 1 and 4 default to SB8; warn on SB15), an optional PunchDay (blank = Unscheduled) and PunchOrder = band max + 1.
- Manual Add creates the row as Active directly.
Screen rules, all local on ActiveJobs:
- Punch: hides TurretDone jobs. 'Show completed' shows them.
- SB8 / SB15: Machine matches && Nested && !TurretDone. A 'Show complete' toggle shows the TurretDone ones, so a wrong last tick can be undone.
- Nesting: all Active.
- Bending: Nested && !(PBDone && P4Done), dimmed until TurretDone. Toggles: 'ready only' and 'show complete'.
- Assembly: unstarted jobs. Started jobs follow open question 3: by default they stay, ticked, until ShipDate has passed, as today. A 'show started' toggle shows the rest.
- TV/Progress: the punch board (Active && !TurretDone, grouped by machine and punch day, no Unscheduled band), read-only.

3) DONE: HOUSEKEEPING runs only in the supervisor app (Punch OnVisible plus its timer).
- Rule: ForAll(Filter(ActiveJobs, PunchDone && Started && !IsBlank(StartedOn) && DateDiff(StartedOn, Today(), TimeUnit.Days) >= 30), write {JobStatus: Done} through the write helper).
- The 30-day wait matches the original's 30-day retention. The Active set stays small (about 50-150 open jobs plus about 80-200 recently started jobs, far under the 2,000 row limit), and every 'show completed/started' toggle and every mistaken tick stays reachable on the boards for 30 days.
- If housekeeping doesn't run for a while, nothing breaks; the next run catches up.
- Done rows are never deleted. They are the years of history AND the re-import block. Never list all Done rows.

4) DISMISSED: the app's Delete button patches JobStatus = Dismissed and never removes a row. Dismissed rows are hidden from the boards and kept forever.

REACHING CLOSED ROWS:
- A 'Find job #' box on Punch runs Filter(TheWhiteBoard, JobNumber = text), which is indexed and matches any status, and opens Edit.
- REOPEN is one button that writes {JobStatus: Active, Started: false, StartedOn: Blank()}. The job reappears on Assembly and Bending, where ticks can be fixed, and housekeeping cannot re-close it at once.
- RESTORE (on a Dismissed row) writes JobStatus = Incoming.

IMPORT CONTRACT (the userscript Claude will adapt):
- The userscript always queries 180 days ahead and copies {v:1, pulledAt (ISO), fromYmd, toYmd, days, jobs:[{id, number, name, shipDate 'YYYY-MM-DD', runNumber, status, model, unit}]}.
  - Filter: In-Process and the model contains casrtu.
  - shipDate is sliced to 10 characters.
- The Import screen shows a red banner when days < 90 ('narrow pull, moved ship dates past 16 days are invisible, re-pull'). It asks for confirmation when pulledAt is more than 2 hours old.
- The Import button is disabled while a run is going.

IMPORT RUN:
- Read ActiveJobs and IncomingJobs (two indexed queries).
- For each pasted job, key = Upper(Trim(number)) & "|" & Upper(Trim(unit)).
(a) Key is in the open set: re-read the row with LookUp(TheWhiteBoard, ID = id) and decide from that fresh row.
- The ship date is valid and Text(ShipDate,"yyyy-mm-dd") <> pasted text:
  - Incoming: ShipDate = new.
  - Active && !Started: PrevShipDate = If(new = PrevShipDate, Blank(), Coalesce(PrevShipDate, ShipDate)), ShipDate = new.
  - Active && Started: ignore.
- The pasted id differs from CasmfgId: update CasmfgId.
(b) Key is not open, and the ship date is invalid/blank or <= Today()+16: LookUp(TheWhiteBoard, Title = key).
- Dismissed: listed under 'Blocked - dismissed' (label, ship date, Modified) with a Restore button.
- Done: counted.
- Not found: create with EVERY value explicit: Title, JobNumber, UnitNumber, JobName, ProductModel, JobSize (parsed), ShipDate (or blank), CasmfgId, JobStatus Incoming, and Nested/Need*/Done*/PBDone/P4Done/Started all false. Defaults() is never relied on.
- If the create fails: LookUp(Title = key) again. If a row is found, count it as 'already had'. Otherwise add key & ": " & FirstError.Message to a red 'Failed' list with Retry.
(c) Key is not open and the ship date is beyond Today()+16: watch-only, skipped.
- Summary: added / ship moves / already had / blocked-dismissed / failed / watch-only.
- Pasting the same clipboard twice must give 0 added and 0 moves.

RE-IMPORT GUARD:
- Title is unique, and the key is never rewritten on imported rows. Rows are never deleted (the permission level enforces this), so a Done or Dismissed job cannot come back.
- If two people import at once, the unique rule makes the second create fail, and the re-check counts it as 'already had'.

## Columns

| Name (internal = display) | Type | Required | Indexed | Unique | Settings | Used by |
|---|---|---|---|---|---|---|
| Title | Single line of text (the built-in Title column) | Yes | Yes | Yes | Built-in; keep the name Title. Require = Yes. Enforce unique values = Yes, which also creates its index. Holds the JOB KEY = Upper(Trim(JobNumber)) & "\|" & Upper(Trim(UnitNumber)), e.g. 8481557\|1. A manual job with no Unit # gets Upper(Trim(JobNumber)) & "\|M" & Text(Now(),"yymmddhhmmss"), so it can never collide. Hidden from every SharePoint view so nobody quick-edits it. | Import dedup: LookUp(TheWhiteBoard, Title = key) finds the job in ANY status. Manual Add sets it. On rows where CasmfgId is not blank (imported), the key is NEVER rewritten. On a manual '\|M' row it becomes the real key the first time a Unit # is typed. If that save fails on the unique rule, the app says 'already in the list as <status>'. Never shown on cards. |
| JobNumber | Single line of text |  | Yes |  | Max 255, no default. CASMFG job number, or typed for manual jobs. Read-only in Edit when CasmfgId is not blank. | Card label JobNumber-FanNumber on every screen. Import. Add/Edit. The 'Find job #' box, Filter(TheWhiteBoard, JobNumber = text), which is indexed and reaches rows in any status (Done/Dismissed included) for Reopen/Restore after the list passes 5,000 rows. |
| UnitNumber | Single line of text |  |  |  | Max 255, no default. CASMFG unit number. Read-only in Edit when CasmfgId is not blank. | Import (second half of the key). Manual Add/Edit: optional; once typed, a manual job blocks its CASMFG twin. |
| FanNumber | Single line of text |  |  |  | Max 255, no default. Always its own editable column. Import leaves it blank, or pre-fills it from UnitNumber if open question 1 says fan # = unit #. | Card label JobNumber-FanNumber on every screen. Punch Add/Edit. Editing it never touches the key. |
| JobName | Single line of text |  |  |  | Max 255, no default. Customer, which is the CASMFG job name. | Cards (shown cut to about 12 characters) on Punch, SB8/SB15, Bending, Assembly and TV. Import. Add/Edit. |
| ProductModel | Single line of text |  |  |  | Max 255, no default. CASMFG product model, e.g. CASRTU3-I.250-24MF-3-RTU. Manual jobs type anything. | Card title on SB8/SB15 and Bending. JobSize is parsed from it on import and on Edit when Size = Auto. Add/Edit. |
| NestLabel | Single line of text |  |  |  | Max 255, no default. Free text typed by the nester (nest/file label, may contain e.g. 25TON). | Typed inline on the Nesting and Punch screens. Shown on SB8/SB15 and Bending cards. Heavy size-3 rule: the TON token is extracted exactly like the original, Match(NestLabel, "(?<t>\d+(\.\d+)?)TON", MatchOptions.IgnoreCase).t, and tested with in ["25","30","2530"] (no substring IsMatch). |
| CasmfgId | Single line of text |  |  |  | Max 255, no default, not indexed. The CASMFG production record id from the last import. NOT stable: Import overwrites it when the pasted id differs, because a re-release changes it. Blank = a manual job. | Imported/manual flag: locks JobNumber/UnitNumber in Edit and drives the NEW tag (Created today && CasmfgId not blank). Keeps the current CASMFG id, which a later production-date push (casmfg-production-dates.user.js sends productionJobId = casmfg_id) would need without a back-fill. Never used as a dedup key. |
| JobSize | Number |  |  |  | Number of decimal places: 0. No min/max in SharePoint (an out-of-range value would make a Patch fail); the app writes only 1-4 or blank. No default. One parse formula everywhere (Import and Edit 'Auto'): With({m: Match(Upper(ProductModel), "CASRTU\s*(?<sz>\d+)")}, If(!IsBlank(m) && Value(m.sz) >= 1 && Value(m.sz) <= 4, Value(m.sz), Blank())). The Edit dialog has a Size drop-down: Auto, 1, 2, 3, 4. Auto re-parses ProductModel on save. | Machine-rule warning (sizes 1 and 4 punch on SB8; warn and allow SB15). Assembly line warnings (4 goes to Line 3 only; 3 never on Line 1; heavy 3 goes to Line 3; 1 not on Line 3). 'Size n' / 'SET SIZE' (blank) on cards. Size counts on Progress. Import. Edit. |
| PairNo | Number |  |  |  | Number of decimal places: 0. No default. Blank = not paired. Pairing gives every selected job PairNo = Min(ID) of the selected jobs: unique, needs no scan and cannot race. Groups of 2 or more are allowed. Unpair writes Blank(). | Pair badge, coloured by the pair's rank among the pairs visible on that board, so neighbouring pairs contrast. Pair grouping in every sort through local group keys: GroupShip = the earliest ShipDate in the pair, and GroupOrder = the lowest order value in the band. This keeps a pair together instead of relying on a tie-break. Punch pair/unpair. |
| PunchOrder | Number |  |  |  | Number of decimal places: Automatic (decimals allowed). No min/max, no default. The order within one Machine + PunchDay band, including Unscheduled. Place or move into a band = band max + 1. Up/Down is ONE Patch of the moved card to the midpoint between its two new neighbours (neighbour - 1 at the top, + 1 at the bottom); there are no pairwise swaps. An optional 'Renumber band' button rewrites the band to 1..n. | Punch place/move/up/down. SB8/SB15 and TV sort. Every local sort ends with ID, so equal values still show in a stable order. |
| AssemblyOrder | Number |  |  |  | Number of decimal places: Automatic. No default. The order within one AssemblyLine + AssemblyDate cell. Same rules as PunchOrder (max + 1 on place, midpoint on up/down, ID as the final tie-break). | Assembly place/move/up/down. |
| ShipDate | Date and time |  |  |  | Include time: No (date only). Display format: Standard. No default. Import writes Date(Value(Left(s,4)), Value(Mid(s,6,2)), Value(Mid(s,9,2))) ONLY when IsMatch(s, "\d{4}-\d{2}-\d{2}", MatchOptions.BeginsWith). A new job with an invalid/blank date is created with ShipDate blank and the card shows 'NO SHIP DATE'. An update never applies an invalid/blank date. | Ship badge everywhere. Incoming tray sort. Bending order (GroupShip, then pair, then own ShipDate). SB8/SB15 secondary sort. Import: the 16-day add window and ship-move detection, which compares Text(ShipDate,"yyyy-mm-dd") with the pasted text, never raw DateTime equality. Edit. |
| PrevShipDate | Date and time |  |  |  | Include time: No. No default. Blank = no flag. On a CASMFG move of an Active, not-Started job: PrevShipDate = If(new = PrevShipDate, Blank(), Coalesce(PrevShipDate, ShipDate)), and ShipDate = new. This keeps the first un-acknowledged date and clears the flag when CASMFG moves it back. The supervisor's tap writes Blank(). | Import. 'Ship moved from m/d' flag on Punch and Assembly cards. Supervisor acknowledge button. |
| PunchDay | Date and time |  |  |  | Include time: No. No default. Blank = the Unscheduled band. Any day of the week (the shop punches 7 days). | Punch day bands and moves. Past days keep showing while they still hold unfinished work (computed locally). SB8/SB15 order: unscheduled first, then PunchDay, GroupShip, PunchOrder, ID. TV. |
| AssemblyDate | Date and time |  |  |  | Include time: No. No default. The planned START day; the app offers Mon-Fri only. | Assembly day rows run Mon-Fri from Min(Today(), the earliest AssemblyDate of an unstarted job) through the latest AssemblyDate, at least about 10 workdays out. That way an overdue job always has a row. Blank AssemblyDate or AssemblyLine = the 'unassigned' band. |
| StartedOn | Date and time |  |  |  | Include time: No. No default. Set to Today() when Started is ticked, Blank() when it is unticked or the job is reopened. | Housekeeping: a job closes to Done only 30 days after StartedOn. 'Started m/d' on Assembly/Progress. |
| JobStatus | Choice | Yes | Yes |  | Choices exactly, in order: Incoming, Active, Done, Dismissed (delete the Choice 1/2/3 placeholders). Drop-down. Default value: Incoming. More options: Require = Yes, Allow multiple selections = Off, Can add values manually = Off. The app always writes it explicitly: {JobStatus: {Value: "Active"}}. Filter with JobStatus.Value = "Active" (delegable). | The first and indexed filter of every query: ActiveJobs (all boards, stations and TV) and IncomingJobs (tray), as two separate queries and never an OR. Import creates Incoming. Place/Add sets Active. Delete sets Dismissed. Housekeeping sets Done. Reopen/Restore sets Active/Incoming. |
| Machine | Choice |  |  |  | Choices: SB8, SB15. Drop-down. No default. Allow multiple selections = Off, Can add values manually = Off. Blank while Incoming; the app requires it when placing. | Punch columns, Place, move between turrets, machine-rule warning. SB8/SB15 screens (local filter Machine.Value = "SB8"). TV. |
| AssemblyLine | Choice |  |  |  | Choices: Line 1, Line 2, Line 3 (spaces exactly). Drop-down. No default. Allow multiple selections = Off, Can add values manually = Off. Blank = unassigned. | Assembly line columns, assign/move, line-rule warnings (with JobSize and the NestLabel TON token). Progress. |
| Nested | Yes/No |  |  |  | Default value: No (the panel starts at Yes). The app writes it explicitly on every create. | Nesting screen tick and the 'Nested' button on Punch cards. SB8/SB15 and Bending show only Nested jobs. |
| Need12 | Yes/No |  |  |  | Default value: No. Means the job needs 12 ga. | Selected on Punch and Nesting. Controls which gauge buttons SB8/SB15 show. TurretDone. Gauge pills on Bending/Assembly/TV. |
| Need14 | Yes/No |  |  |  | Default value: No. Needs 14 ga. | Same as Need12. |
| Need16 | Yes/No |  |  |  | Default value: No. Needs 16 ga. | Same as Need12. |
| Need18 | Yes/No |  |  |  | Default value: No. Needs 18 ga. | Same as Need12. |
| Need20 | Yes/No |  |  |  | Default value: No. Needs 20 ga. | Same as Need12. |
| Need24 | Yes/No |  |  |  | Default value: No. Needs 24 ga. | Same as Need12. |
| Done12 | Yes/No |  |  |  | Default value: No. 12 ga punched (operator tick). | Gauge button on SB8/SB15 (patches only its own column). Green pill on Punch. TurretDone, which drives Punch/SB8/SB15 hiding, Bending dimming and 'ready only', and housekeeping. Assembly task squares. TV. |
| Done14 | Yes/No |  |  |  | Default value: No. 14 ga punched. | Same as Done12. |
| Done16 | Yes/No |  |  |  | Default value: No. 16 ga punched. | Same as Done12. |
| Done18 | Yes/No |  |  |  | Default value: No. 18 ga punched. | Same as Done12. |
| Done20 | Yes/No |  |  |  | Default value: No. 20 ga punched. | Same as Done12. |
| Done24 | Yes/No |  |  |  | Default value: No. 24 ga punched. | Same as Done12. |
| PBDone | Yes/No |  |  |  | Default value: No. Press brake (PB) done. | PB tick on Bending (either order with P4). PunchDone. Bending hides PB && P4 unless 'show complete' is on. Assembly task squares. Progress. |
| P4Done | Yes/No |  |  |  | Default value: No. P4 done. | P4 tick on Bending. Same reads as PBDone. |
| Started | Yes/No |  |  |  | Default value: No. The line began the job. | Assembly 'Started' tick (also writes StartedOn). Assembly display of Started jobs (open question 3; display-only). Import ignores ship moves on Started jobs, as the original did. Housekeeping. Reopen clears it. |
| Notes | Multiple lines of text |  |  |  | Plain text: More options > Use enhanced rich text = Off, Append changes to existing text = Off. No default. Never filtered on. | Punch Add/Edit dialog. Shown on Punch, SB8/SB15 and Bending cards and on the TV. |

## Creation steps (detailed)

1. SITE PREP (site owner, 2 min): gear > Site information > View all site settings > Regional settings > Time zone = the shop's time zone > OK. Check that every tablet, PC and the TV is set to the same time zone.
2. GROUPS (IT): create Entra security groups 'RunList Users' (supervisors, nester, every floor-tablet account) and 'RunList Viewers' (TV account, look-only people). These same groups are later used to share the app.
3. CREATE THE LIST: site home > + New > List > Blank list. Name: TheWhiteBoard, exactly, with no spaces. Never rename it. Description: 'White Board jobs - one row per job'. Create.
4. TITLE COLUMN: gear > List settings > Columns > Title. Keep the name Title. Require that this column contains information = Yes. Enforce unique values = Yes, and click OK when SharePoint says the column must be indexed. OK.
5. ADD THE OTHER 36 COLUMNS from the list view: + Add column > type > Next > Name typed EXACTLY as in the column table (no spaces; the name typed at creation becomes the permanent internal name) > options > Save. Work grouped by type.
6. Single line of text (7): JobNumber, UnitNumber, FanNumber, JobName, ProductModel, NestLabel, CasmfgId. Leave all options at their defaults.
7. Number (4): JobSize and PairNo: More options > Number of decimal places = 0. PunchOrder and AssemblyOrder: decimal places = Automatic. No min, max or default on any of the four.
8. Date and time (5): ShipDate, PrevShipDate, PunchDay, AssemblyDate, StartedOn. Include time = Off, Display format = Standard, Default value = None.
9. Choice (3): delete the placeholder choices. More options: Allow multiple selections = Off, Can add values manually = Off. JobStatus: Incoming, Active, Done, Dismissed; Default value = Incoming; Require = Yes. Machine: SB8, SB15; no default. AssemblyLine: Line 1, Line 2, Line 3; no default. Spelling and spaces must be exact.
10. Yes/No (16): Nested, Need12, Need14, Need16, Need18, Need20, Need24, Done12, Done14, Done16, Done18, Done20, Done24, PBDone, P4Done, Started. Set Default value = No on every one (the panel starts at Yes).
11. Multiple lines of text (1): Notes. More options: Use enhanced rich text = Off, Append changes to existing text = Off.
12. CHECK NAMES: List settings > click 4 or 5 columns. The address must end in Field=<Name> exactly, with no _x0020_ and no trailing 0. If one is wrong, delete it and create it again; renaming only changes the display name.
13. INDEXES (now, while the list is empty): List settings > Indexed columns > Create a new index > Primary column = JobStatus > Create. Repeat for JobNumber. The page must show Title, JobStatus and JobNumber, and nothing else.
14. VERSIONING: List settings > Versioning settings > Require content approval = No. Create a version each time you edit an item = Yes. Keep the following number of versions = 500 > OK.
15. ADVANCED SETTINGS: List settings > Advanced settings > Attachments = Disabled (confirm) > OK. Leave Item-level permissions at the defaults.
16. NO-DELETE LEVEL (site owner): gear > Site permissions > Advanced permissions settings > Permission Levels > Contribute > Copy Permission Level. Name 'Contribute - no delete', untick Delete Items and Delete Versions > Create. If this is not allowed, skip it and use Contribute in the next step.
17. LIST PERMISSIONS: List settings > Permissions for this list > Stop Inheriting Permissions > OK. Tick the site's Members group > Edit User Permissions > Read only > OK. Grant Permissions > RunList Users > Show options > 'Contribute - no delete' (or Contribute), untick the email > Share. Grant Permissions > RunList Viewers > Read. Owners keep Full Control.
18. VIEWS: in All Items, hide the Title column (column header > Column settings > Show/hide columns). Optional view 'Open jobs': filter JobStatus is equal to Active, sort by ShipDate. Every view must filter on JobStatus.
19. SHAREPOINT TEST ROW: + New > Title TEST|1, JobNumber TEST, ShipDate = today > Save. Check that JobStatus shows Incoming, every Yes/No shows No and ShipDate shows today. Then an Owner deletes it (the only kind of row anyone ever deletes).
20. AFTER THE APP EXISTS (Claude's go-live checklist, using job number TEST rows that are dismissed and then deleted by an Owner): (1) Import a pasted test payload with shipDate 2026-10-03. SharePoint, a card label and Text(ShipDate,"yyyy-mm-dd") must all show 2026-10-03. (2) Pick a date on a tablet's date picker, left at the default Local: SharePoint shows the same day. (3) Paste the same clipboard twice: the second run shows 0 added and 0 ship moves. (4) A tick on tablet A shows on tablet B within one timer cycle. (5) Two tablets tick PB and P4 on the same job within seconds: both stick. If (1) or (2) is off by a day, fix it once in a shared read/write formula, never per picker, and repeat. Do not go live until all five pass.

## Pitfalls the app code must respect

1. DELEGATION HARD RULE (Microsoft's SharePoint table: Text only = and StartsWith; Boolean only =; Not never delegates; IsBlank on Text doesn't; Sort on Choice doesn't; ID only =). One non-delegable term makes the WHOLE query local, so it silently sees only the first 2,000 rows, which happens about a year in, well before 5,000. The expression that reaches TheWhiteBoard may contain ONLY = on Title, ID, JobStatus.Value, JobNumber, Yes/No or Number, joined with &&. StartsWith on JobNumber is also allowed. Everything else (!, <>, IsBlank, in, date bands, multi-column sorts, pair grouping) runs on ActiveJobs/IncomingJobs. Treat any delegation warning on a TheWhiteBoard formula as a bug. Never use UpdateIf/RemoveIf on TheWhiteBoard; they are local and capped. Settings > General > Data row limit = 2000.
2. WORKING SET = NAMED FORMULAS, NOT COLLECTIONS. Collections are static snapshots that Refresh() and Patch() do not update, so a tick would stay invisible. ActiveJobs and IncomingJobs live in App.Formulas, and each gallery reads them. Station and TV screens use a Timer that runs Refresh(TheWhiteBoard) every 30-60 s. Never bind a gallery to the unfiltered list.
3. ONE WRITE HELPER FOR EVERY PATCH, supervisor screens included. SharePoint rejects a write if the row changed since it was read ('Conflicts exist with changes on the server'), even when another column changed, e.g. PB and P4 on the same job. The helper:
(1) works out explicit values first, e.g. With({v: !ThisItem.PBDone, id: ThisItem.ID}, ...);
(2) uses LookUp(TheWhiteBoard, ID = id) as the base record;
(3) wraps the Patch in IfError, and on error runs Refresh(TheWhiteBoard) and retries once;
(4) shows Notify(..., NotificationType.Error) if the retry also fails.
Each button patches only the columns it owns. Never use an Edit form/SubmitForm for tick columns.
4. CREATE = EXPLICIT VALUES. Microsoft says Defaults() may omit or ignore source defaults. Every create (Import and manual Add) sets JobStatus and all 16 Yes/No columns explicitly. If a Yes/No column is ever added to a list that already has rows, back-fill it, because blank does not match = false.
5. DATES:
- All five date columns are date-only. Never switch one to date-and-time once data exists.
- Site time zone = shop time zone = every device's time zone.
- Write only Today(), a picker's SelectedDate (DateTimeZone left at Local) or Date(y,m,d) built from 'YYYY-MM-DD' text. Never Now(), never DateTimeValue on a '...Z' timestamp.
- Compare dates that matter as text: Text(d,"yyyy-mm-dd").
- NOT VERIFIED: Microsoft's docs do not say how the SharePoint connector maps date-only values, which is why go-live test steps (1) and (2) exist. If either is off, normalize once in a shared formula, never by switching single pickers to UTC.
6. CHOICE COLUMNS: write {JobStatus: {Value: "Active"}}, clear with Machine: Blank(), filter with .Value = "...", drop-down Items = Choices(TheWhiteBoard.Machine). Text must match exactly ('Line 1', 'SB15'). Keep 'Allow multiple selections' and 'Can add values manually' Off.
7. CLEARING VALUES (PrevShipDate, PairNo, StartedOn, Machine, AssemblyLine/Date: Blank()) needs formula-level error management, which is on by default. Do not turn it off.
8. KEY IS IMMUTABLE ON IMPORTED ROWS: Job # and Unit # are read-only in Edit when CasmfgId is not blank, and Title is never patched there. Otherwise the next import would add a duplicate card. Build the key with exactly one expression everywhere. A duplicate key fails with 'duplicate values were found': Import re-checks with LookUp, and manual Edit shows 'already in the list as <status>'.
9. NEVER DELETE ROWS, in SharePoint or with Remove(). A deleted CASMFG job comes back on the next import. The 'Contribute - no delete' level enforces this; Owners alone can delete (test rows only). Never rename the list or a column after the app is built, and keep Title named Title.
10. 5,000-ITEM THRESHOLD: the list passes 5,000 rows in about 2 years. Every query's first filter is an indexed equality that narrows below 5,000 (JobStatus Active/Incoming, Title, ID, JobNumber). JobStatus = Done eventually will not, so never list all Done rows. Sort locally. Create the indexes while the list is empty.
11. LOCAL ORDERING: every sort ends with ID. Up/down is one midpoint Patch. Pairs sort by GroupShip/GroupOrder, then PairNo, then the job's own value; a PairNo tie-break alone does NOT keep pairs adjacent.
12. IMPORT SPEED: match the paste against ActiveJobs + IncomingJobs (two queries) first. Run LookUp(Title = key) only for unmatched jobs inside 16 days, or with an invalid date. Jobs past 16 days that aren't open need no server call.
13. NOTES must be plain text with Append changes Off; Power Apps cannot show appended-history text.
14. VERSIONING at 500 per item is a best-effort audit (who ticked what, via Version history), not a guaranteed one. No 'ticked by' columns are needed.

## Open questions and the calls made

The calls made while you were away:
- Q1: yes, Import pre-fills FanNumber from UnitNumber, and it stays editable.
- Q2: left to you and IT.
- Q3: Started jobs stay on the Assembly board until the ship date passes.
- Q4: the TV is read-only.

The original questions:

1. Is the fan # on the card always the CASMFG unit #? If yes, Import pre-fills FanNumber from UnitNumber, and it stays editable. Either way, FanNumber stays its own column and the job key is never rewritten on imported jobs.
2. Which SharePoint site holds TheWhiteBoard, and how do the floor tablets and the TV sign in (personal or shared shop accounts)? Every account needs a license and membership in RunList Users or RunList Viewers. Shared accounts, the two security groups and the 'Contribute - no delete' level need IT's OK.
3. After the line ticks Started, should the job stay on the Assembly board (ticked) until its ship date passes, as today and as the default, or leave at once? This is a display rule only: either way the job closes to Done 30 days after Started.
4. Today an operator can tap a gauge on the TV to complete it. You decided the new TV is read-only (Read permission), so operators will tick on the SB8/SB15 tablets instead. Is that right? If the TV must take taps, its account needs the same access as the tablets.

## Changes from the first draft

- Added CasmfgId (Single line of text, not indexed): imported/manual flag, locks Job #/Unit # in Edit so the key is never rewritten on imported rows, updated on re-release, and keeps the door open for a later production-date push. The list now has 36 added columns plus Title.
- Done now waits 30 days after StartedOn (was the next day). This matches the original 30-day retention, keeps every 'show completed/started' toggle and mistaken tick reachable, and adds no column.
- Added a 'Find job #' lookup (indexed JobNumber, any status), a Reopen button that also clears Started/StartedOn so housekeeping can't re-close the job, and a Restore button for Dismissed rows.
- Working set fixed as App.Formulas named formulas (ActiveJobs with TurretDone/PunchDone/group keys; IncomingJobs) instead of 'collection or With()'. The turret-complete formula is now written once.
- One write helper for EVERY Patch (explicit values, base LookUp(ID), IfError, then Refresh, retry, Notify), not only floor patches.
- Up/down is now one midpoint Patch, with ID as the final sort key and an optional Renumber band button. Pairwise swaps are gone.
- Pairs: PairNo = Min(ID) of the selected jobs (race-free). Local group keys keep pairs adjacent. Colours are assigned by rank on the board.
- Import contract: 180-day pull with a clipboard header (pulledAt, fromYmd, toYmd, days), a narrow-pull banner, a stale-paste confirmation and the button disabled while running.
- Import logic: explicit create values (no Defaults reliance); failed creates re-checked and real failures listed with Retry; ship moves detected by text compare on a freshly read row; PrevShipDate keeps the first date and clears on a move back; Started jobs ignored for ship moves; invalid ship dates handled; Dismissed matches listed with Restore; Active and Incoming read as two queries, not an OR.
- JobSize parsing uses a CASRTU\s*digits regex limited to 1-4, and Edit gets a Size 'Auto' option that re-parses ProductModel.
- The heavy size-3 rule now uses the exact TON token (25/30/2530), not a substring match.
- Screens: SB8/SB15 get 'Show complete'. TV is defined as the punch board (not turret complete, no Unscheduled band). Assembly day rows extend back to the earliest overdue unstarted job.
- Hard delegation rule added; UpdateIf/RemoveIf banned; housekeeping is ForAll over the local set.
- Permissions: a custom 'Contribute - no delete' level, the site Members group set to Read on the list, Entra security groups (usable for app sharing too), and a Recycle Bin fallback.
- Versions raised from 100 to 500.
- Date handling: no per-picker UTC fallback. A go-live checklist now tests the Import path, the picker path, import idempotency and multi-tablet ticks.
- Choice columns: 'Allow multiple selections = Off' stated explicitly. Title hidden from SharePoint views.
- Open questions rewritten: Q1 keeps FanNumber separate either way; Q3 is now display-only; added Q4 on TV tapping.

## Reviewer findings that were rejected

- Technical #1, collection branch (write every tick back into colActive): rejected. Named formulas recalculate on Refresh and Patch, so there is no collection to keep in sync. The finding's core point (pick one pattern, base record from LookUp(ID), Notify on failure) is accepted.
- Technical #3, repeat the smoke test on a device set to a different time zone: rejected as overkill. Every device is physically in the shop, and the design instead requires all devices to use the shop's time zone. The rest of the finding (test the Import path, no per-picker UTC switch, fix centrally) is accepted.
- Technical #7, 'leave versions unlimited': rejected. 500 is plenty, and unlimited is not needed for an audit that is best-effort anyway.
- Workflow #1 alternative, a DoneOn date column (indexed): rejected. Delaying Done by 30 days gives the same reach with no new column and no extra query.
- Workflow #4, give the TV account Contribute so taps complete gauges: rejected because the user explicitly decided the TV/Progress screen is a read-only overview. It is raised as open question 4 instead. The view definition part (punch board, no Unscheduled band) is accepted.
- Lifecycle #5, index Modified for a 'recently dismissed' list: rejected. The Import screen's Blocked-dismissed list and the indexed 'Find job #' box already reach every Dismissed row; a third path is overkill for a basic app.
- Lifecycle #9, refuse a paste whose pulledAt isn't later than the last import's: rejected. A variable is lost when the app restarts, so the check would give false comfort without a settings list or column. The age check (confirm if older than 2 hours) is accepted.
- Technical #1 claim that collection records may not satisfy Patch's base-record rule: not adopted as a reason. In practice SharePoint records copied by ClearCollect keep their ID. The design avoids the question anyway by always using LookUp(TheWhiteBoard, ID = id).
