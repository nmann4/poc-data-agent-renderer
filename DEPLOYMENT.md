# Deployment Guide

## 🚀 Deploying to GitHub Pages

Your project is already configured for GitHub Pages deployment! Here's what's set up:

### Already Configured ✅

1. **Vite Config** - Base path set to `/poc-data-agent-renderer/`
2. **GitHub Actions Workflow** - Automatic deployment on push to main
3. **Yarn Support** - Workflow uses yarn with frozen lockfile

### Steps to Deploy

#### 1. Commit and Push Your Changes

```bash
git add .
git commit -m "Add WebAssembly visual demos"
git push origin main
```

#### 2. Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/nmann4/poc-data-agent-renderer`
2. Click on **Settings**
3. Scroll down to **Pages** in the left sidebar
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
5. That's it! The workflow will run automatically

#### 3. Monitor Deployment

1. Go to the **Actions** tab in your repository
2. You'll see the "Deploy to GitHub Pages" workflow running
3. Once complete (usually 2-3 minutes), your site will be live at:
   ```
   https://nmann4.github.io/poc-data-agent-renderer/
   ```

### Automatic Deployments

Every time you push to the `main` branch, the site will automatically rebuild and redeploy. You can also manually trigger a deployment from the Actions tab.

## 🔧 Testing Locally Before Deploy

```bash
# Build for production
yarn build

# Preview the production build
yarn preview
```

The preview server will show you exactly what will be deployed to GitHub Pages.

## 📦 What Gets Deployed

- Optimized production build from `dist/` folder
- All compiled TypeScript → JavaScript
- Bundled and minified assets
- The JavaScript fallback implementations (WASM optional)

## 🐛 Troubleshooting

### Build Fails in GitHub Actions

**Check:**
- All dependencies are listed in `package.json`
- `yarn.lock` is committed to the repository
- TypeScript has no errors locally: `yarn build`

### Site Loads but Assets 404

**Fix:**
- Verify `base` in `vite.config.ts` matches your repo name
- Should be: `base: mode === 'production' ? '/poc-data-agent-renderer/' : '/'`

### Deployment Succeeds but Site Doesn't Update

**Try:**
- Clear browser cache (hard refresh: Cmd+Shift+R)
- Check Actions tab for the latest workflow run
- GitHub Pages can take 1-2 minutes to update after successful deployment

## 🎉 Next Steps

Once deployed, share your site:
```
https://nmann4.github.io/poc-data-agent-renderer/
```

The demos will run entirely in the browser - no backend needed!
