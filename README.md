# Brains n Bots – Virtual Studio (One‑Click Deploy)

Apple‑inspired, browser‑based virtual studio for a solo podcast. Built with React + Tailwind + Framer Motion.

## One‑Click Deploy

> **First, upload this folder to a GitHub repo** (no local dev needed):  
> 1) Create a new repo on GitHub → **Add files → Upload files** → drag all files → Commit.  
> 2) Then click one of the buttons below and select your repo.

### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?project-name=brainsnbots-studio&repository-name=brainsnbots-studio&repository-url=https://github.com/04-snigdha/brainsnbots-studio)

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/04-snigdha/brainsnbots-studio)

Replace `REPLACE_WITH_YOUR_REPO_URL` with the HTTPS URL of your GitHub repository (e.g. `https://github.com/you/brainsnbots-studio`).

## OBS Setup
1. After deploying, copy your site URL (e.g. `https://brainsnbots-studio.vercel.app`).  
2. In **OBS** → **Sources** → **+** → **Browser** → paste the URL → set Width `1920`, Height `1080`.  
3. Use hotkeys inside the studio: `1–4` scenes, `H` hide UI, `F` fullscreen, `G` guides, `L` logo, `T` teleprompter, `[` `]` ticker speed.

## Dev (optional)
```bash
npm install
npm run dev
```
