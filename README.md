# odin-todo-list

A todo list application built as part of The Odin Project curriculum.

## Installation

Initialize the project:

```bash
npm init -y --init-type=module
```

Install development dependencies:

```bash
npm install --save-dev webpack webpack-cli
npm install --save-dev html-webpack-plugin
npm install --save-dev style-loader css-loader
npm install --save-dev html-loader
npm install --save-dev webpack-dev-server
npm install --save-dev webpack-merge
npm install --save-dev mini-css-extract-plugin
```

## Development

Run the development server with hot reloading:

```bash
npm start
```

This will open the app in your browser at `http://localhost:8080`.

## Webpack Configuration Notes

### MiniCssExtractPlugin & FOUC Fix

This project uses `mini-css-extract-plugin` instead of `style-loader` in production to prevent Flash of Unstyled Content (FOUC). The plugin extracts CSS into separate `.css` files that load properly before JavaScript executes.

**Key configuration in `webpack.common.js`:**
- `MiniCssExtractPlugin.loader` replaces `style-loader` for CSS processing
- This ensures styles are available immediately when the page loads

## Building for Production

Create a production build in the `dist` folder:

```bash
npm run build
```

## Deployment to GitHub Pages

Since the built files are in the `dist` folder (ignored by git), we use a special deployment process to push only the `dist` contents to a `gh-pages` branch.

### First Time Setup (only once)

Create the gh-pages branch:

```bash
git branch gh-pages
```

### Deploying (every time you want to update the live site)

Follow these steps carefully:

1. **Make sure all your work is committed**
   ```bash
   git status
   # If there are uncommitted changes, commit them first
   ```

2. **Switch to gh-pages branch and merge main**
   ```bash
   git checkout gh-pages && git merge main --no-edit
   ```

3. **Build the production bundle**
   ```bash
   npm run build
   ```

4. **Force add and commit the dist folder** (dist is in .gitignore)
   ```bash
   git add dist -f && git commit -m "Deployment commit"
   ```

5. **Push the dist folder to the gh-pages branch on GitHub**
   ```bash
   git subtree push --prefix dist origin gh-pages
   ```

6. **Switch back to your main branch**
   ```bash
   git checkout main
   ```

### Configure GitHub Pages Settings

After the first deployment:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Branch**, select `gh-pages` as the source branch
4. Click **Save**

Your site will be available at: `https://castawaypirate.github.io/odin-todo-list/`

### Redeploying After Changes

Whenever you make changes to your project and want to update the live site:

```bash
git checkout gh-pages && git merge main --no-edit
npm run build
git add dist -f && git commit -m "Deployment commit"
git subtree push --prefix dist origin gh-pages
git checkout main
```
