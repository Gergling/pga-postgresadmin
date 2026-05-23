CJS modules need to go into noExternal. Check the google search for why.

# Troubleshooting

## Development

### "SyntaxError: Named export not found" in electron-vite

- **The Problem**: The app crashes on startup because a package (e.g., electron-updater) fails to import a named variable.
- **The Cause**: The Main process builds as an ES Module (formats: ['es']). Node.js cannot read named exports out of legacy CommonJS dependencies at runtime.
- **The Fix**: Force Vite to preprocess and inline the package into your bundle by adding it to the noExternal array. Vite will automatically convert the CommonJS syntax to ESM.

```ts
const noExternal = [ /* ... Add the package name here. */ ];
```
