# public/api

PHP endpoints (contact / booking forms) go here. Next.js copies everything in
`public/` into `out/`, so these end up at `https://hsappliances.co.uk/api/*.php`.

- Keep secrets (SMTP password etc.) in `config.php` — it's git-ignored. Better still,
  place it outside public_html and `require` it by absolute path.
