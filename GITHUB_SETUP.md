# GitHub Setup Instructions

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `photobooth` (or your preferred name)
3. Description: "A web-based photobooth application with camera capture and frame selection"
4. Choose **Public** or **Private**
5. **DO NOT** check "Add a README file" (you already have one)
6. **DO NOT** add .gitignore or license
7. Click **"Create repository"**

## Step 2: Connect and Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/photobooth.git

# Rename branch to main (if not already)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Alternative: Using GitHub CLI (if installed)

If you have GitHub CLI installed:

```bash
gh repo create photobooth --public --source=. --remote=origin --push
```

## Step 3: Verify

After pushing, visit your repository on GitHub:
- `https://github.com/YOUR_USERNAME/photobooth`

## Deployment Options

Once on GitHub, you can deploy using:

1. **Netlify** (recommended for static sites):
   - Connect your GitHub repo
   - Auto-deploys on push
   - Free HTTPS included

2. **Vercel**:
   - Connect GitHub repo
   - Auto-deploys
   - Free tier available

3. **000webhost / InfinityFree**:
   - Upload files manually or use FTP
   - See DEPLOYMENT.md for details

## Note

If you need to update your git user info globally:
```bash
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
```

