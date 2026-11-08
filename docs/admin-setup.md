# Admin panel setup (Hostinger)

The admin panel at **https://hsappliances.co.uk/hs-admin/** lets you edit services, Insights (blog posts), reviews and settings from your phone or computer. It runs on PHP + MySQL, which your Hostinger plan already includes.

You only do this once. It takes about 15 minutes.

**Before you start:** the site is already deployed (see [deploy.md](deploy.md)), and `private/config.php` exists from the forms setup.

---

## 1. Create the database
1. Go to **hPanel → Databases → Management**.
2. Under **Create a new MySQL database and database user**, enter:
   - Database name, e.g. `hsdb`. Hostinger saves it as `u123456789_hsdb`.
   - Username, e.g. `hsuser`. Saved as `u123456789_hsuser`.
   - A strong password. Use the generator, and copy the password somewhere safe.
3. Click **Create**. Note the **full** database name and username shown in the list, including the `u123456789_` prefix.

## 2. Import the tables and content
1. In the same list, click **Enter phpMyAdmin** next to the new database.
2. Go to **Import → Choose file**, select `database/schema.sql` from this project, and click **Import** (bottom of the page). You should see 6 tables: `admin_users`, `posts`, `reviews`, `services`, `settings`, `slug_redirects`.
3. Import again, this time with `database/seed.sql`. That adds:
   - all **16 services**, with full content, common faults, FAQs, compliance notes and SEO titles
   - the **3 existing blog posts** as published Insights
   - **16 redirects** from the old WordPress URLs (e.g. `washing-machine` → `washing-machine-repair`)
   - default **settings** (homepage shows 8 services, plus your phone, email and address)
   - **no reviews**. Add your real Google reviews yourself in the admin.

**Already imported `seed.sql` before the demo photos were added?** Import `database/update-images.sql` as well. It only fills service and post images that are still empty, so it never overwrites images you've uploaded.

Import `seed.sql` **once**, into an empty database. Importing it twice gives "Duplicate entry" errors. If that happens, drop all the tables and import both files again.

## 3. Add the database details to config.php
Open `domains/hsappliances.co.uk/private/config.php` in File Manager (right-click → **Edit**) and add these two sections inside the `return [ … ];` block. `config.example.php` has the full template.

```php
    'db' => [
        'host' => 'localhost',
        'port' => 3306,
        'name' => 'u123456789_hsdb',      // your full database name
        'user' => 'u123456789_hsuser',    // your full username
        'pass' => 'the-database-password',
        'charset' => 'utf8mb4',
    ],
    'admin' => [
        'install_token' => 'make-up-a-long-random-string-here',
        'session_idle_minutes' => 120,
        'max_login_attempts' => 5,
        'lockout_minutes' => 15,
    ],
```

Save the file. Its permissions should stay at **600**.

## 4. Create your admin account
1. In File Manager, upload `database/install.php` from this project into `public_html/hs-admin/`, next to `index.php`. It isn't part of the normal site upload on purpose.
2. Go to **https://hsappliances.co.uk/hs-admin/install.php**.
3. Enter:
   - the **install token** you just put in config.php
   - your **email**
   - a **password** of 12+ characters (a passphrase is easiest)
4. Click **Create admin**.
5. The installer then tries to **delete itself**. Check in File Manager that `public_html/hs-admin/install.php` is gone, and delete it by hand if it isn't. The dashboard shows a red warning until it's removed.
6. Remove the `'install_token' => …` line from config.php. It's no longer needed.

The installer refuses to run once an admin exists, so it can't be reused even if the file stays. Delete it anyway.

## 5. Log in
Go to **https://hsappliances.co.uk/hs-admin/** and bookmark it on your phone. You can also add it to your home screen: Safari or Chrome → Share → *Add to Home Screen*.

| Security feature | What it does |
|---|---|
| Login lockout | 5 wrong passwords lock that email and device out for 15 minutes |
| Auto logout | After 2 hours of inactivity |
| Session cookie | HttpOnly, Secure, SameSite=Lax, limited to `/hs-admin/` |
| CSRF tokens | On every form, so other websites can't submit changes as you |
| Hidden from search | `noindex` header, plus `Disallow: /hs-admin/` in robots.txt |

---

## Using the admin

- **Services:**
  - Search, filter by category, and change the sort order (lower numbers come first).
  - Show or hide a service, or feature it on the homepage, with one tap.
  - Changing a service's **URL slug** creates an automatic 301 redirect, so old links keep working.
- **Insights:**
  - **Save draft** keeps a post private.
  - **Publish now** puts it live.
  - **Schedule** publishes it automatically at the date and time you pick (UK time).
  - **Preview** shows a draft exactly as written.
  - Every image needs **alt text**: a short description for blind visitors and Google.
- **Reviews:** paste in real reviews only, exactly as written. You can link a review to a service.
- **Settings:**
  - Homepage service count.
  - Google rating, number of reviews and reviews link. These stay hidden on the site until they're filled in.
  - Contact details. Keep them identical to your Google Business Profile.

**Images** are checked to be real JPG/PNG/WebP files, resized to a maximum of 1600px, converted to WebP and saved in `public_html/uploads/`. **Never delete `uploads/` when redeploying** the site, because it holds your live images. Extracting the site zip over `public_html` leaves it alone.

## What updates where
- **Service and Insights pages** (`/services/…`, `/insights/…`), the sitemap and the menus on those pages read the database directly, so changes are live as soon as you save. A new service gets its page, a menu entry and a sitemap entry automatically. Hiding a service makes its page return "not found" and removes it everywhere.
- **Other pages** (home, areas, about…) load the latest services, reviews and insights in the browser a moment after opening. The next `npm run build` bakes the same content into the page HTML.
- Insight URLs are `/insights/{slug}/`. Old `/blog/…` links redirect automatically.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Could not connect to the database" | Check `db.name`, `db.user` and `db.pass` in config.php. Use the **full** names with the `u123456789_` prefix, and `localhost` as the host. |
| install.php says "Database not ready" | Import `schema.sql` (step 2). |
| install.php says "Install token missing" | Add `install_token` under `admin` in config.php. |
| "Too many failed attempts" | Wait 15 minutes. If you've forgotten the password, see below. |
| "Session expired" when saving | The page was open too long or the browser blocked the cookie. Reload and save again. Your typing is lost, so copy long text first. |
| Image upload fails | Max 3MB, JPG/PNG/WebP only. If every upload fails, check that `public_html/uploads/` exists and is writable (permissions 755). |
| Forgot password | In phpMyAdmin, delete your row from `admin_users`, upload `database/install.php` into `hs-admin/` again, add an `install_token` to config.php, and repeat step 4. |
