# Deployment Instructions for Jorden

## Quick Deploy to Vercel (Recommended)

This app is production-ready and will deploy in ~2 minutes.

### Option 1: Vercel Dashboard (No CLI needed)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New" → "Project"
3. Import `Cosinal/brutus-playground`
4. Vercel will auto-detect Next.js settings:
   - Framework: Next.js
   - Build Command: `npm run build` (auto)
   - Output Directory: `.next` (auto)
   - Install Command: `npm install` (auto)
5. Click "Deploy"

**Done!** Vercel will give you a live URL immediately (e.g., `brutus-playground.vercel.app`).

The URL is your personal website. Update the README with the actual URL once deployed.

### Option 2: Vercel CLI

If you want to deploy from command line:

```bash
cd /workspace
npx vercel --prod
# Follow prompts to link to your Vercel account
```

---

## Alternative: Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Pages → "Create a project"
3. Connect to GitHub: `Cosinal/brutus-playground`
4. Build settings:
   - Framework: Next.js
   - Build command: `npm run build`
   - Output: `.next`
5. Deploy

---

## Alternative: GitHub Pages (Static Export)

Next.js supports static export but requires config changes. Not recommended unless you need it.

---

## Notes

- **No secrets needed**: App works without API keys
- **No environment variables**: All data is baked into the repo
- **Preview deploys**: Every push to the branch gets a preview URL
- **Custom domain**: Optional, can be added in Vercel/Cloudflare settings

---

**Live URL will be**: `https://brutus-playground.vercel.app` (or similar)

Update the README once deployed with the actual production URL.
