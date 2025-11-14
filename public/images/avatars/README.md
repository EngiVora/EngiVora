# Avatar Images

This directory contains 4 avatar images that users can choose from:

1. **avatar-1.svg** - Male with Glasses (Young man with brown hair, glasses, and dark blue hoodie)
2. **avatar-2.svg** - Female with Ponytail (Young woman with blonde ponytail, glasses, and dark purple top)
3. **avatar-3.svg** - Female with Bob (Woman with reddish-orange bob hair, yellow earrings, and dark green top)
4. **avatar-4.svg** - Male with Backpack (Young man with dark brown hair, orange jacket, and blue backpack)

## Current Status

✅ All 4 avatar images are now available as SVG files.

## File Structure

```
public/
  images/
    avatars/
      avatar-1.svg
      avatar-2.svg
      avatar-3.svg
      avatar-4.svg
```

## Replacing with Custom Images

If you want to replace these SVG avatars with your own PNG/JPG images:

1. Add your custom images to this directory with the exact filenames: `avatar-1.png`, `avatar-2.png`, `avatar-3.png`, `avatar-4.png`
2. Update the `avatar-selector.tsx` component to use `.png` extension instead of `.svg`
3. Recommended image format: PNG with transparent background
4. Recommended size: 512x512 pixels or larger (square aspect ratio)

## Usage

Users can select an avatar by:
1. Going to their Profile page
2. Clicking on their profile picture or the "Choose Avatar" button
3. Selecting one of the 4 available avatars
4. The selected avatar will be saved to their profile and displayed throughout the application

## Fallback

If an avatar image is missing or fails to load, the system will display a fallback with the user's initials in a gradient background.

