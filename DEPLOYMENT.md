# Deployment Guide for Photobooth Application

## Requirements
- Static hosting (HTML/CSS/JavaScript)
- HTTPS support (required for camera access)
- Modern web server

## Option 1: 000webhost (Free)

### Steps:
1. **Sign up** at [000webhost.com](https://www.000webhost.com)
2. **Create a new website**
3. **Upload files via File Manager:**
   - Login to your 000webhost dashboard
   - Go to File Manager
   - Upload all files maintaining the folder structure:
     ```
     /public_html/
     ├── index.html
     ├── result.html
     ├── script.js
     ├── style.css
     └── assets/
         └── frames/
             ├── Frame 1.png
             ├── Frame 2.png
             ├── Frame 3.png
             └── Frame 4.png
     ```
4. **Enable HTTPS:**
   - 000webhost provides free SSL certificate
   - Enable it in the dashboard under "SSL" section
5. **Access your site:**
   - Your site will be at: `https://yourname.000webhostapp.com`

---

## Option 2: InfinityFree (Free)

### Steps:
1. **Sign up** at [infinityfree.net](https://www.infinityfree.net)
2. **Create account and website**
3. **Upload via File Manager or FTP:**
   - Use the same folder structure as above
4. **Free SSL available** - enable in control panel
5. **Your site:** `https://yourname.rf.gd` or custom domain

---

## Option 3: Netlify (Free - Recommended)

**Note:** Netlify supports static sites perfectly. Files are already converted to HTML!

### Steps:
1. **Files are already HTML** - no conversion needed!

2. **Create `netlify.toml` (optional):**
   ```toml
   [[redirects]]
     from = "/"
     to = "/index.html"
     status = 200
   ```

3. **Deploy:**
   - Connect GitHub repo to Netlify
   - Auto-deploys on push
   - Free HTTPS included

---

## Option 4: Vercel (Free - Recommended)

Perfect for static sites! Files are already HTML, so no conversion needed.

---

## Option 5: Shared Hosting (Paid)

### Popular Options:
- **Hostinger** (~$2-3/month)
- **Bluehost** (~$3-4/month)
- **SiteGround** (~$4-6/month)

### Steps:
1. Purchase hosting plan
2. Get domain name (optional)
3. Upload files via FTP/cPanel File Manager
4. Enable SSL certificate (usually free with hosting)
5. Access via your domain

---

## Option 6: GitHub Pages (Free)

**GitHub Pages supports static HTML sites perfectly!**

### Steps:
1. Push your code to GitHub (already done!)
2. Go to repository Settings → Pages
3. Select branch `main` and folder `/ (root)`
4. Your site will be at: `https://yourusername.github.io/lilac-photobooth`

---

## Recommended: Netlify or Vercel

**Best for your needs:**
- ✅ Free
- ✅ Static HTML support (files already converted!)
- ✅ Free SSL/HTTPS
- ✅ Easy GitHub integration
- ✅ Auto-deploy on push
- ✅ No code changes needed

---

## After Deployment Checklist

- [ ] All files uploaded correctly
- [ ] Folder structure maintained (`assets/frames/`)
- [ ] HTTPS/SSL enabled
- [ ] Test camera access works
- [ ] Test photo capture
- [ ] Test frame selection
- [ ] Test download functionality

---

## Troubleshooting

### Camera not working?
- Ensure site is accessed via HTTPS (not HTTP)
- Check browser permissions for camera access
- Test in different browsers

### Images not loading?
- Check file paths are correct
- Ensure `assets/frames/` folder is uploaded
- Check file permissions on server

### 404 errors?
- Ensure `index.html` is in root directory
- Check `.htaccess` if using Apache (may need to add)
- For Netlify/Vercel, ensure `index.html` is the entry point



