# Connecting online bookings to Google Calendar

Once this is set up, the booking system and your Google Calendar stay in step **both ways**:

- **Website → calendar:** every online booking appears in your calendar straight away. The event title is the booking reference and the customer's name, for example `Domestic - Washing Machine — Jane Smith (TW13 6AD)`. The event also holds the address, phone number, email and the problem description.
- **Calendar → website:** **anything** you add to that calendar makes the slots it overlaps unavailable on the website. This includes:
  - jobs you book by phone
  - holidays, including all-day events
  - appointments marked "Free"

  The only exception is an invitation you've **declined**, which doesn't block anything.
- **Cancelling** a booking in `/hs-admin/` → **Bookings** removes its calendar event and frees the slot.

It takes about 15 minutes, needs no coding, and is free. Until you do it, bookings still work: each one reserves its slot on the website and is emailed to you. In that case, use **Bookings → Block a day or slot** for holidays and phone jobs.

> **Changing or deleting events directly in Google Calendar.** Deleting a booking's event in Google doesn't cancel the booking on the website. The slot stays reserved until you cancel it in **/hs-admin/ → Bookings**, so always cancel there.

---

## 1. Create a Google Cloud project (one time)

1. Go to <https://console.cloud.google.com/> and sign in with the **same Google account as the calendar** (house.shopappliances@gmail.com).
2. At the top, click the project picker, then **New project**. Name it `HS Appliances Website` and click **Create**. Make sure the new project is selected.
3. Open **APIs & Services → Library**, search for **Google Calendar API** and click **Enable**.

## 2. Create a service account (the website's "robot" user)

1. Go to **APIs & Services → Credentials → Create credentials → Service account**.
2. Name: `hs-website-bookings`. Click **Create and continue**, skip the optional role steps, and click **Done**.
3. Click the new service account, open the **Keys** tab, then **Add key → Create new key → JSON → Create**. A `.json` file downloads.
   - **Treat this file like a password.** Never email it, and never put it in the website folder or in git.
4. Copy the service account's email address. It looks like `hs-website-bookings@hs-appliances-website.iam.gserviceaccount.com`.

## 3. Share your calendar with the service account

1. Open <https://calendar.google.com/> on a computer.
2. Under **My calendars**, hover over the calendar you want bookings in, click **⋮ → Settings and sharing**.
   - This can be your main calendar, or a new one called "Bookings".
3. Under **Share with specific people or groups**, click **Add people and groups**. Paste the service account email and choose **Make changes to events**, then click **Send**.
4. Scroll down to **Integrate calendar** and copy the **Calendar ID**.
   - For your main calendar, this is your Gmail address.
   - A separate calendar has an ID ending in `@group.calendar.google.com`.

## 4. Put the key on the server and update config.php

1. In Hostinger **File Manager**, open the `private` folder next to `public_html`. This is the same folder that holds `config.php`.
2. Upload the JSON key there and rename it to `google-service-account.json`.
3. Edit `private/config.php` and add this inside the main `[` … `]`, with your own values:

   ```php
   'google_calendar' => [
       'calendar_id' => 'house.shopappliances@gmail.com',
       'credentials_file' => __DIR__ . '/google-service-account.json',
   ],
   ```

4. Save.

## 5. Check it works

1. Log in to `/hs-admin/` and open **Bookings**. The green banner should say **Connected to Google Calendar**.
2. In Google Calendar, add an event tomorrow from 09:30 to 10:30. On `/book/`, tomorrow's **09:00–11:00** slot should show **Slot not available**. Allow up to a minute for the change to show.
3. Make a test booking on the website. It should appear in your calendar, and the slot disappears from the form.
4. Cancel the test booking in **/hs-admin/ → Bookings**. The event disappears from the calendar and the slot is free again.

## Troubleshooting

| Problem | Fix |
|---|---|
| Banner still says "isn't connected" | Check that `calendar_id` and `credentials_file` are set and that the path is correct. The file must be readable by PHP. |
| Booking shows **Not in calendar** in the admin | Hover over the badge to see the error. The usual causes are that the calendar wasn't shared with the service account email, or was shared with "See all event details" instead of **Make changes to events**. Fix it, then click **Add to calendar** on the booking. Open bookings also retry automatically each time you open the Bookings page. |
| `token request failed` in `private/hs-data/logs/api.log` | The JSON key was deleted in Google Cloud or the file is damaged. Create a new key (step 2.3) and upload it again. |
| Calendar events don't block slots | Make sure you're adding them to the **same calendar** whose ID is in config.php. Changes can take up to 60 seconds to show. |

If Google is unreachable for a moment, bookings still go through. The database still prevents double bookings, the booking is marked **Not in calendar**, and it's added automatically the next time you open the Bookings page.
