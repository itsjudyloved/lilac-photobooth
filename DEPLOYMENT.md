# Deployment Guide for Photobooth Application

## Requirements
- PHP hosting (for .php files)
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
     ├── index.php
     ├── result.php
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

## Option 3: Netlify (Free - Requires Conversion)

**Note:** Netlify doesn't support PHP natively. You would need to:
1. Convert `.php` files to `.html` files
2. Use Netlify's redirects for routing
3. Deploy via GitHub integration

### Steps:
1. **Convert PHP to HTML:**
   - Rename `index.php` → `index.html`
   - Rename `result.php` → `result.html`
   - Update any PHP references in JavaScript

2. **Create `netlify.toml`:**
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

## Option 4: Vercel (Free - Requires Conversion)

Similar to Netlify, requires converting PHP to HTML or using serverless functions.

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

## Option 6: GitHub Pages (Not Recommended)

**GitHub Pages doesn't support PHP.** You would need to:
- Convert all `.php` files to `.html`
- Use client-side routing
- Deploy static files only

---

## Quick Conversion Guide (For Static Hosting)

If you want to use Netlify/Vercel/GitHub Pages:

1. **Rename files:**
   ```bash
   mv index.php index.html
   mv result.php result.html
   ```

2. **No code changes needed** - your PHP files are already just HTML!

3. **Deploy as static site**

---

## Recommended: 000webhost or InfinityFree

**Best for your needs:**
- ✅ Free
- ✅ PHP support
- ✅ Free SSL/HTTPS
- ✅ Easy file upload
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
- Ensure `index.php` is in root directory
- Check `.htaccess` if using Apache (may need to add)



