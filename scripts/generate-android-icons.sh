#!/bin/bash

# Generate Android Adaptive Icon Assets
# This script creates all required icon sizes for Android from source images

set -e

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is required but not installed. Please install it:"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    exit 1
fi

# Define source files
ICON_SOURCE="final_icon.png"
# Optional: separate foreground/background for adaptive icons
FOREGROUND_SOURCE="assets/icon-foreground.png"
BACKGROUND_SOURCE="assets/icon-background.png"

# Define Android res directory
ANDROID_RES="android/app/src/main/res"

# Check if android directory exists
if [ ! -d "android" ]; then
    echo "Note: android/ directory not found. Run 'expo prebuild' first to generate native projects."
    echo "Creating icons in assets/android-icons/ for now..."
    ANDROID_RES="assets/android-icons"
fi

# Check if main icon source exists
if [ ! -f "$ICON_SOURCE" ]; then
    echo "Error: $ICON_SOURCE not found!"
    echo "Run 'npm run icons:process' first to generate final_icon.png from base_icon.png"
    exit 1
fi

# Check for adaptive icon sources (optional)
HAS_ADAPTIVE=false
if [ -f "$FOREGROUND_SOURCE" ] && [ -f "$BACKGROUND_SOURCE" ]; then
    HAS_ADAPTIVE=true
    echo "Found adaptive icon sources - will generate full adaptive icons"
else
    echo "Note: No separate foreground/background found."
    echo "Will generate legacy icons only. For adaptive icons, create:"
    echo "  - $FOREGROUND_SOURCE (icon on transparent background)"
    echo "  - $BACKGROUND_SOURCE (solid color or pattern background)"
fi

# Create directories if they don't exist
mkdir -p "$ANDROID_RES/mipmap-hdpi"
mkdir -p "$ANDROID_RES/mipmap-mdpi"
mkdir -p "$ANDROID_RES/mipmap-xhdpi"
mkdir -p "$ANDROID_RES/mipmap-xxhdpi"
mkdir -p "$ANDROID_RES/mipmap-xxxhdpi"
mkdir -p "$ANDROID_RES/drawable-hdpi"
mkdir -p "$ANDROID_RES/drawable-mdpi"
mkdir -p "$ANDROID_RES/drawable-xhdpi"
mkdir -p "$ANDROID_RES/drawable-xxhdpi"
mkdir -p "$ANDROID_RES/drawable-xxxhdpi"

echo "Generating Android icon assets..."

# Generate adaptive icons only if sources exist
if [ "$HAS_ADAPTIVE" = true ]; then
    # Generate foreground icons (with 108dp size for adaptive icons)
    echo "Creating foreground icons..."
    convert "$FOREGROUND_SOURCE" -resize 162x162 "$ANDROID_RES/mipmap-mdpi/ic_launcher_foreground.png"
    convert "$FOREGROUND_SOURCE" -resize 216x216 "$ANDROID_RES/mipmap-hdpi/ic_launcher_foreground.png"
    convert "$FOREGROUND_SOURCE" -resize 324x324 "$ANDROID_RES/mipmap-xhdpi/ic_launcher_foreground.png"
    convert "$FOREGROUND_SOURCE" -resize 432x432 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher_foreground.png"
    convert "$FOREGROUND_SOURCE" -resize 540x540 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher_foreground.png"

    # Generate background drawable
    echo "Creating background drawable..."
    convert "$BACKGROUND_SOURCE" -resize 162x162 "$ANDROID_RES/drawable-mdpi/ic_launcher_background.png"
    convert "$BACKGROUND_SOURCE" -resize 216x216 "$ANDROID_RES/drawable-hdpi/ic_launcher_background.png"
    convert "$BACKGROUND_SOURCE" -resize 324x324 "$ANDROID_RES/drawable-xhdpi/ic_launcher_background.png"
    convert "$BACKGROUND_SOURCE" -resize 432x432 "$ANDROID_RES/drawable-xxhdpi/ic_launcher_background.png"
    convert "$BACKGROUND_SOURCE" -resize 540x540 "$ANDROID_RES/drawable-xxxhdpi/ic_launcher_background.png"
fi

# Generate legacy icons (for older Android versions, or as main icons without adaptive)
echo "Creating legacy launcher icons..."
convert "$ICON_SOURCE" -resize 48x48 "$ANDROID_RES/mipmap-mdpi/ic_launcher.png"
convert "$ICON_SOURCE" -resize 72x72 "$ANDROID_RES/mipmap-hdpi/ic_launcher.png"
convert "$ICON_SOURCE" -resize 96x96 "$ANDROID_RES/mipmap-xhdpi/ic_launcher.png"
convert "$ICON_SOURCE" -resize 144x144 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher.png"
convert "$ICON_SOURCE" -resize 192x192 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher.png"

# Generate round icons (same as regular for now)
echo "Creating round launcher icons..."
convert "$ICON_SOURCE" -resize 48x48 "$ANDROID_RES/mipmap-mdpi/ic_launcher_round.png"
convert "$ICON_SOURCE" -resize 72x72 "$ANDROID_RES/mipmap-hdpi/ic_launcher_round.png"
convert "$ICON_SOURCE" -resize 96x96 "$ANDROID_RES/mipmap-xhdpi/ic_launcher_round.png"
convert "$ICON_SOURCE" -resize 144x144 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher_round.png"
convert "$ICON_SOURCE" -resize 192x192 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher_round.png"

echo "✓ Android icon generation complete!"
echo ""
echo "Next steps:"
echo "1. Check the generated icons in $ANDROID_RES"
echo "2. The adaptive icon XML configuration has been updated"
echo "3. Run 'npm run android' to see the new icons in action"