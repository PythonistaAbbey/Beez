# Deploy and share the prototype

The fastest route is Vercel, which runs Next.js natively, including the `/api/demo/*` mock endpoints. It takes about five minutes and needs no code changes.

## 1. Merge the pull request
Merge PR #1 into `main` on GitHub. Vercel builds the production site from the default branch.

## 2. Import into Vercel
1. Sign in at https://vercel.com with the GitHub account that owns the repo.
2. Choose **Add New → Project**, then pick the `Beez` repository. If it is not listed, choose **Adjust GitHub App Permissions** and grant access to it.
3. Keep the detected settings: Framework preset **Next.js**, build command `next build`, output default, root directory `./`. No environment variables are needed.
4. Choose **Deploy**. When it finishes, Vercel gives a URL like `https://beez-xxxx.vercel.app`.
5. Optional: under **Settings → Domains**, rename it to something clearer, for example `beez-concept.vercel.app`. Do not use a domain that looks like Beez's own.

To share without merging first, push the branch and use the **Preview** URL that Vercel creates for it. Preview URLs require a Vercel login by default; turn that off under **Settings → Deployment Protection** if the recipient should open it directly.

## 3. Check before sending
- Open `/en` and `/ar`, the Control Tower, Track (`DEMO-RX-1042`), Request a quote and Executive demo.
- Confirm the top banner reads "Independent concept prototype … Not an official Beez Logistics website".
- The site sends `X-Robots-Tag: noindex`, so search engines will not list it.

## 4. Send
Use the drafts in `docs/06-outreach-emails.md`. Fill in your own name, title and contact details; the drafts deliberately leave them blank. Link to `/en/executive` for a five-minute walkthrough and to `/en` for the full site.

## Alternatives
- **Netlify:** import the repo; the Next.js runtime is detected automatically.
- **Any Node host:** `npm ci && npm run build && npm start` (port 3000, Node 20 or later).

## GitHub Pages (built in)
`.github/workflows/pages.yml` builds the static preview and publishes it on every push to `main`.
1. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions** (one time).
2. Open **Actions → Deploy preview to GitHub Pages → Run workflow** (or push to `main`).
3. The site appears at `https://<owner>.github.io/<repo>/`, for example `https://pythonistaabbey.github.io/Beez/`.

GitHub Pages for a private repository needs a paid GitHub plan. On a free plan the repository must be public, which also makes the docs (proposal and email drafts) public.
