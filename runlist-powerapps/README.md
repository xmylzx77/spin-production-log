# White Board (RunList) → Power Apps

A basic rebuild of the shop's White Board run list as a Power Apps canvas app on a SharePoint list. It uses Microsoft 365 E3 with standard features only: nothing premium and no flows.

## What's in the basic version
- **Punch:** jobs on SB8 / SB15 by punch day and order, an Incoming tray, nesting, gauges and labels.
- **Assembly:** jobs on Line 1 / 2 / 3 by start date and order, and the Started tick.
- **Floor screens:** SB8 / SB15 (gauge ticks), Bending (PB and P4 ticks) and Nesting.
- **TV / Progress:** read-only.
- **Import:** a read-only Tampermonkey button in CASMFG copies the job list, and you paste it into the app.

Left out: the auto-planner and capacities, approvals and locks, Utility Sets, QC photos, parts issues, Electrical, stats, and sending dates back to CASMFG.

## Steps, in order
1. `01-sharepoint-list-setup.md`: create the **RunListJobs** list (about 30 minutes, in the browser).
2. `02-build-the-app.md`: build the app in Power Apps Studio, paste by paste (22 pastes from the `app` folder), then publish, share, set up each device's link, and run the go-live tests.

## Reference
- `design/list-design.md`: the full list design, the rules the app follows, and the reviewers' notes.
