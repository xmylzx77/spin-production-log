# Set up the SharePoint list (TheWhiteBoard)

This takes about 30 minutes in a web browser on your work PC. A site **owner** (you or IT) must do steps 1 and 9.

## 1. Where it goes and who gets access
- **Site:** use a SharePoint **team site** in the company tenant. That can be an existing Production/Shop site, or ask IT for one such as "Shop Floor Apps". Do not use OneDrive.
- **Time zone (do this first):** gear icon > **Site information** > **View all site settings** > **Regional settings** > set **Time zone** to the shop's time zone > **OK**. Every tablet, PC and the TV must also be set to this time zone.
- **Groups:** ask IT for two **security groups**:
  - **RunList Users**: supervisors, the nester and every floor-tablet account. They change jobs.
  - **RunList Viewers**: the TV account and anyone who only looks.
- Every tablet and the TV must sign in with a licensed Microsoft 365 work account (E3 is fine) that is in one of these groups.

## 2. Create the list
Site home > **+ New** > **List** > **Blank list**. Name: `TheWhiteBoard` (exactly like that, no spaces) > **Create**. Never rename it.

## 3. Set up the Title column (the job key)
Gear > **List settings** > under Columns click **Title**. Keep the name **Title**. Set **Require that this column contains information** = Yes and **Enforce unique values** = Yes. When it says the column must be indexed, click **OK**. Then click **OK** again.

## 4. Add the other 36 columns
Go back to the list and click **+ Add column** > pick the type > **Next** > type the name **exactly** as shown (no spaces; the first name you type is permanent) > set the options > **Save**.
- **Every Yes/No:** set Default value to **No**. It starts at Yes.
- **Every Choice:** delete the "Choice 1/2/3" placeholders. Under More options, set **Allow multiple selections** Off and **Can add values manually** Off.
- **Every Date:** set **Include time** Off.

| Name to type | Type | Settings | Index? |
|---|---|---|---|
| Title | (already there) | Required, unique values (step 3) | Yes (automatic) |
| JobNumber | Single line of text | Defaults | Yes (step 6) |
| UnitNumber | Single line of text | Defaults | No |
| FanNumber | Single line of text | Defaults | No |
| JobName | Single line of text | Defaults | No |
| ProductModel | Single line of text | Defaults | No |
| NestLabel | Single line of text | Defaults | No |
| CasmfgId | Single line of text | Defaults | No |
| JobSize | Number | Decimal places 0; no min, max or default | No |
| PairNo | Number | Decimal places 0; no min, max or default | No |
| PunchOrder | Number | Decimal places Automatic; no default | No |
| AssemblyOrder | Number | Decimal places Automatic; no default | No |
| ShipDate | Date and time | Include time Off; format Standard; no default | No |
| PrevShipDate | Date and time | Same as ShipDate | No |
| PunchDay | Date and time | Same as ShipDate | No |
| AssemblyDate | Date and time | Same as ShipDate | No |
| StartedOn | Date and time | Same as ShipDate | No |
| JobStatus | Choice | Choices: Incoming, Active, Done, Dismissed. Default **Incoming**. More options: Require = **Yes** | Yes (step 6) |
| Machine | Choice | Choices: SB8, SB15. No default | No |
| AssemblyLine | Choice | Choices: Line 1, Line 2, Line 3. No default | No |
| Nested | Yes/No | Default **No** | No |
| Need12, Need14, Need16, Need18, Need20, Need24 | Yes/No (six separate columns) | Default **No** | No |
| Done12, Done14, Done16, Done18, Done20, Done24 | Yes/No (six separate columns) | Default **No** | No |
| PBDone | Yes/No | Default **No** | No |
| P4Done | Yes/No | Default **No** | No |
| Started | Yes/No | Default **No** | No |
| Notes | Multiple lines of text | More options: Use enhanced rich text **Off**, Append changes to existing text **Off** | No |

## 5. Check the names
Go to **List settings** and click 4 or 5 of the columns. The web address must end in `Field=` followed by the exact name, for example `Field=PunchOrder`. If you see `_x0020_` or an extra `0` at the end, **delete that column and create it again**. Renaming does not fix it.

## 6. Add the indexes
**List settings** > **Indexed columns** > **Create a new index** > Primary column = **JobStatus** > **Create**. Do the same for **JobNumber**. The page should now list exactly three: Title, JobStatus and JobNumber.

## 7. Turn on version history
**List settings** > **Versioning settings**:
- Require content approval = **No**
- Create a version each time you edit an item = **Yes**
- Keep the following number of versions = **500**

Click **OK**.

## 8. Turn off attachments
**List settings** > **Advanced settings** > Attachments = **Disabled** > **OK**. Leave everything else as it is.

## 9. Set permissions (site owner)
1. **Make a "no delete" level:** gear > **Site permissions** > **Advanced permissions settings** > **Permission Levels** > click **Contribute** > **Copy Permission Level** (at the bottom). Name it `Contribute - no delete`, untick **Delete Items** and **Delete Versions**, then click **Create**.
2. **List settings** > **Permissions for this list** > **Stop Inheriting Permissions** > **OK**.
3. Tick the site's **Members** group > **Edit User Permissions** > tick **Read** only > **OK**.
4. **Grant Permissions** > enter **RunList Users** > **Show options** > choose **Contribute - no delete** > untick the email > **Share**.
5. **Grant Permissions** > enter **RunList Viewers** > choose **Read** > **Share**.

The owners keep Full Control, and they are the only people who can delete. If step 1 is not allowed, give RunList Users **Contribute** instead and tell everyone: **never delete a row**. A deleted row can be restored from the site Recycle Bin for 93 days.

## 10. Hide the key, then test
1. In **All Items**, click a column header > **Column settings** > **Show/hide columns** > untick **Title** > **Apply**.
2. Add a test row: **+ New** > Title `TEST|1`, JobNumber `TEST`, ShipDate today > **Save**.
3. Check three things:
   - JobStatus shows **Incoming**.
   - Every Yes/No column shows **No**.
   - ShipDate shows today.
4. Then delete the test row. You are an owner, so you can.

## 11. Send this back when done
- The site address and the list address.
- A screenshot of the **Columns** section of List settings, and one of the **Indexed columns** page.
- The time zone you set.
- The names of the two groups, and which accounts are in each (tablets, TV, people).
- Whether the **Contribute - no delete** level was made, or Contribute was used instead.
- The test row results: Incoming? All No? Correct date?
- Anything below that's wrong.

## Calls already made (say if any are wrong)
1. **Fan # = CASMFG unit #.** Import fills FanNumber from the unit number, and you can still edit it.
2. **Started jobs stay on the Assembly board,** ticked, until their ship date passes, the same as today. They close for good 30 days after Started.
3. **The TV is read-only.** Operators tick gauges on the SB8/SB15 tablets, not on the TV.
4. **Still up to you and IT:** which site, and how the tablets and the TV sign in. They can use personal accounts or shared shop accounts, but each needs a license.
