# Deploy Your Photobooth to GitHub Pages

Your code is now on GitHub at: **https://github.com/judyloved/lilac-photobooth**

## Option 1: GitHub Pages (Free & Easy)

### Steps:

1. **Go to your repository on GitHub:**
   - Visit: https://github.com/judyloved/lilac-photobooth

2. **Enable GitHub Pages:**
   - Click on **Settings** (top menu)
   - Scroll down to **Pages** (left sidebar)
   - Under **Source**, select:
     - Branch: `main`
     - Folder: `/ (root)`
   - Click **Save**

3. **Wait for deployment:**
   - GitHub will build your site (takes 1-2 minutes)
   - You'll see a green checkmark when it's ready

4. **Access your site:**
   - Your site will be live at:
   - `https://judyloved.github.io/lilac-photobooth/`

### Important Notes for GitHub Pages:
- ✅ Free HTTPS included
- ✅ Free hosting
- ✅ Auto-updates when you push changes
- ⚠️ Camera access requires HTTPS (GitHub Pages provides this!)
- ⚠️ Make sure `index.html` is in the root directory (it is!)

---

## Option 2: Netlify (Recommended - Better Performance)

### Steps:

1. **Go to Netlify:**
   - Visit: https://www.netlify.com
   - Sign up/login (free account)

2. **Deploy from GitHub:**
   - Click **"Add new site"** → **"Import an existing project"**
   - Click **"Deploy with GitHub"**
   - Authorize Netlify to access your GitHub
   - Select repository: `lilac-photobooth`
   - Click **"Deploy site"**

3. **Configure (if needed):**
   - Build command: (leave empty - it's a static site)
   - Publish directory: `/` (root)
   - Click **"Deploy site"**

4. **Access your site:**
   - Netlify will give you a URL like: `https://random-name-123.netlify.app`
   - You can customize it in site settings

### Netlify Benefits:
- ✅ Free HTTPS
- ✅ Custom domain support
- ✅ Faster CDN
- ✅ Auto-deploy on every push
- ✅ Better performance

---

## Option 3: Vercel (Also Great)

### Steps:

1. **Go to Vercel:**
   - Visit: https://vercel.com
   - Sign up/login (free account)

2. **Import from GitHub:**
   - Click **"Add New Project"**
   - Import `lilac-photobooth` repository
   - Click **"Deploy"**

3. **Access your site:**
   - Vercel will give you a URL automatically
   - Auto-deploys on every push

---

## Testing Your Deployment

Once deployed, test these features:

1. ✅ **Camera access** - Should work on HTTPS
2. ✅ **Photo capture** - Take 3 photos
3. ✅ **Frame selection** - Choose different frames
4. ✅ **Download** - Download your photobooth strip

---

## Troubleshooting

### Camera not working?
- Make sure you're accessing via HTTPS (not HTTP)
- Check browser permissions for camera access
- Try a different browser

### Images not loading?
- Check browser console (F12) for errors
- Verify `assets/frames/` folder is uploaded
- Check file paths are correct

### 404 errors?
- Make sure `index.html` is in the root directory
- For GitHub Pages, ensure branch is set to `main`

---

## Quick Links

- **Your Repository:** https://github.com/judyloved/lilac-photobooth
- **GitHub Pages:** https://judyloved.github.io/lilac-photobooth (after enabling)
- **Netlify:** https://www.netlify.com
- **Vercel:** https://vercel.com

---

## Recommended: Start with GitHub Pages

It's the easiest option since your code is already on GitHub! Just enable Pages in Settings and you're done. 🚀

