# White Board (RunList) → Power Apps

A basic rebuild of the shop's White Board run list as a Power Apps canvas app on a SharePoint list. It uses Microsoft 365 E3 with standard features only: nothing premium and no flows.

## What's in the basic version
- **Punch:** jobs on SB8 / SB15 by punch day and order, an Incoming tray, nesting, gauges and labels.
- **Assembly:** jobs on Line 1 / 2 / 3 by start date and order, and the Started tick.
- **Floor screens:** SB8 / SB15 (gauge ticks), Bending (PB and P4 ticks) and Nesting.
- **TV / Progress:** read-only.
- **Import:** a read-only Tampermonkey button in CASMFG copies the job list, and you paste it into the app. New jobs are then placed on both boards automatically (a basic auto-place, see `design/app-spec.md`).

Left out: the full auto-planner (only a basic auto-place is in), approvals and locks, Utility Sets, QC photos, parts issues, Electrical, stats, and sending dates back to CASMFG.

## Steps, in order
1. `01-sharepoint-list-setup.md`: create the **TheWhiteBoard** list (about 30 minutes, in the browser).
2. `02-build-the-app.md`: build the app in Power Apps Studio, paste by paste (22 pastes from the `app` folder), then publish, share, set up each device's link, and run the go-live tests.
3. `casmfg-copy-jobs.user.js`: install it on each supervisor PC that imports (Tampermonkey; see `02-build-the-app.md` Part F).

## Reference
- `design/list-design.md`: the full list design, the rules the app follows, and the reviewers' notes.
- `design/app-spec.md`: how each screen behaves.
- `design/yaml-authoring-guide.md`: the "guide" the screen notes cite (for example "guide 3.4").
- `app/CONTRACT.md`: the shared names and the paste order.
- `app/screens/*.notes.md`: each screen's paste notes and manual tests.
- `app/fallbacks/`: ready-made replacements for the Punch board (F2) and the Assembly grid (fixed day rows).
- `app/smoke/scrYamlTest.yaml`: the smoke test in Part B of `02-build-the-app.md`.
- `tools/palint.py`: an offline checker for the YAML files.
