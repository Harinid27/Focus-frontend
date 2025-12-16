# Focus Tracker Chrome Extension

This extension monitors your active browser tab and alerts you when you switch to unproductive websites while a focus session is running.

## Installation Steps

### For Development:

1. **Open Chrome and go to** `chrome://extensions/`

2. **Enable Developer Mode** (toggle switch in top right)

3. **Click "Load unpacked"**

4. **Select this folder**: `focus-tracker/public/chrome-extension`

5. **The extension will load** - you should see it in the list

### Common Installation Issues:

**Error: "Manifest file is missing or unreadable"**
- Make sure you have `manifest.json` file
- Check that it's valid JSON (no trailing commas)
- Make sure the file path is correct

**Error: "service_worker is invalid"**
- Ensure `background.js` exists in the same folder
- Check for any JavaScript syntax errors

**Missing files error?**
- Create these three files:
  1. `manifest.json`
  2. `background.js`
  3. `content.js`

## How to Use:

1. **Start a focus session** at `localhost:5173`
2. **Switch to YouTube, Instagram, or other blocked sites**
3. **A warning appears** showing which site you visited
4. **Distraction is recorded** in your session

## Supported Unproductive Sites

- **Social Media**: Instagram, Facebook, Twitter/X, TikTok, Snapchat, Reddit
- **Video**: YouTube, Twitch, Netflix
- **Music**: Spotify, SoundCloud
- **Gaming**: Steam, Epic Games, Discord
- **Entertainment**: 9GAG, Imgur

## How It Works:

1. **Background script** monitors when you switch tabs
2. **Checks if the new tab** is an unproductive website
3. **Sends a message** to your Focus Tracker app
4. **Warning modal appears** with the site name
5. **Distraction recorded** with timestamp

## Troubleshooting:

**Extension not showing warnings?**
- Check if extension is enabled (blue toggle)
- Open DevTools (F12) → Application → Service Workers → check for errors
- Make sure you're on `localhost:5173`
- Try reloading the extension (reload button on extensions page)

**Check Extension Errors:**
1. Go to `chrome://extensions/`
2. Find "Focus Tracker" extension
3. Click "Errors" to see what's wrong
4. Fix any JavaScript errors in the files

**Still not working?**
- Delete the extension and reload it
- Make sure all three files (manifest.json, background.js, content.js) are in the folder
- Check that manifest.json is valid JSON

## Files Included:

- `manifest.json` - Extension configuration
- `background.js` - Monitors tab activity
- `content.js` - Communicates with your app
- `README.md` - This file

