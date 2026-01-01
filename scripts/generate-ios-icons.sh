#!/bin/bash

# Generate iOS App Icon Assets
# This script creates all required icon sizes for iOS from the source icon

set -e

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is required but not installed. Please install it:"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    exit 1
fi

# Define source file
ICON_SOURCE="final_icon.png"

# Define iOS AppIcon directory (adjust project name as needed after expo prebuild)
IOS_APPICON="ios/wingspanscoreapp/Images.xcassets/AppIcon.appiconset"

# Try to find the actual iOS app directory if default doesn't exist
if [ ! -d "ios" ]; then
    echo "Note: ios/ directory not found. Run 'expo prebuild' first to generate native projects."
    echo "Creating icons in assets/ios-icons/ for now..."
    IOS_APPICON="assets/ios-icons"
elif [ ! -d "$IOS_APPICON" ]; then
    # Find the actual .xcassets directory
    FOUND_APPICON=$(find ios -name "AppIcon.appiconset" -type d 2>/dev/null | head -1)
    if [ -n "$FOUND_APPICON" ]; then
        IOS_APPICON="$FOUND_APPICON"
        echo "Found AppIcon directory: $IOS_APPICON"
    else
        echo "Creating icons in assets/ios-icons/ (move to ios project after prebuild)"
        IOS_APPICON="assets/ios-icons"
    fi
fi

# Check if source file exists
if [ ! -f "$ICON_SOURCE" ]; then
    echo "Error: $ICON_SOURCE not found!"
    exit 1
fi

# Create directory if it doesn't exist
mkdir -p "$IOS_APPICON"

echo "Generating iOS app icon assets..."

# Generate all required iOS icon sizes
# iPhone icons
convert "$ICON_SOURCE" -resize 40x40 "$IOS_APPICON/AppIcon-20@2x.png"
convert "$ICON_SOURCE" -resize 60x60 "$IOS_APPICON/AppIcon-20@3x.png"
convert "$ICON_SOURCE" -resize 58x58 "$IOS_APPICON/AppIcon-29@2x.png"
convert "$ICON_SOURCE" -resize 87x87 "$IOS_APPICON/AppIcon-29@3x.png"
convert "$ICON_SOURCE" -resize 80x80 "$IOS_APPICON/AppIcon-40@2x.png"
convert "$ICON_SOURCE" -resize 120x120 "$IOS_APPICON/AppIcon-40@3x.png"
convert "$ICON_SOURCE" -resize 120x120 "$IOS_APPICON/AppIcon-60@2x.png"
convert "$ICON_SOURCE" -resize 180x180 "$IOS_APPICON/AppIcon-60@3x.png"

# iPad icons
convert "$ICON_SOURCE" -resize 20x20 "$IOS_APPICON/AppIcon-20@1x.png"
convert "$ICON_SOURCE" -resize 40x40 "$IOS_APPICON/AppIcon-20@2x~ipad.png"
convert "$ICON_SOURCE" -resize 29x29 "$IOS_APPICON/AppIcon-29@1x.png"
convert "$ICON_SOURCE" -resize 58x58 "$IOS_APPICON/AppIcon-29@2x~ipad.png"
convert "$ICON_SOURCE" -resize 40x40 "$IOS_APPICON/AppIcon-40@1x.png"
convert "$ICON_SOURCE" -resize 80x80 "$IOS_APPICON/AppIcon-40@2x~ipad.png"
convert "$ICON_SOURCE" -resize 76x76 "$IOS_APPICON/AppIcon-76@1x.png"
convert "$ICON_SOURCE" -resize 152x152 "$IOS_APPICON/AppIcon-76@2x.png"
convert "$ICON_SOURCE" -resize 167x167 "$IOS_APPICON/AppIcon-83.5@2x.png"

# App Store icon
convert "$ICON_SOURCE" -resize 1024x1024 "$IOS_APPICON/AppIcon-1024@1x.png"

# Clean up old file name if it exists
if [ -f "$IOS_APPICON/App-Icon-1024x1024@1x.png" ]; then
    rm "$IOS_APPICON/App-Icon-1024x1024@1x.png"
fi

# Create Contents.json file with all icon definitions
cat > "$IOS_APPICON/Contents.json" << 'EOF'
{
  "images": [
    {
      "filename": "AppIcon-20@2x.png",
      "idiom": "iphone",
      "scale": "2x",
      "size": "20x20"
    },
    {
      "filename": "AppIcon-20@3x.png",
      "idiom": "iphone",
      "scale": "3x",
      "size": "20x20"
    },
    {
      "filename": "AppIcon-29@2x.png",
      "idiom": "iphone",
      "scale": "2x",
      "size": "29x29"
    },
    {
      "filename": "AppIcon-29@3x.png",
      "idiom": "iphone",
      "scale": "3x",
      "size": "29x29"
    },
    {
      "filename": "AppIcon-40@2x.png",
      "idiom": "iphone",
      "scale": "2x",
      "size": "40x40"
    },
    {
      "filename": "AppIcon-40@3x.png",
      "idiom": "iphone",
      "scale": "3x",
      "size": "40x40"
    },
    {
      "filename": "AppIcon-60@2x.png",
      "idiom": "iphone",
      "scale": "2x",
      "size": "60x60"
    },
    {
      "filename": "AppIcon-60@3x.png",
      "idiom": "iphone",
      "scale": "3x",
      "size": "60x60"
    },
    {
      "filename": "AppIcon-20@1x.png",
      "idiom": "ipad",
      "scale": "1x",
      "size": "20x20"
    },
    {
      "filename": "AppIcon-20@2x~ipad.png",
      "idiom": "ipad",
      "scale": "2x",
      "size": "20x20"
    },
    {
      "filename": "AppIcon-29@1x.png",
      "idiom": "ipad",
      "scale": "1x",
      "size": "29x29"
    },
    {
      "filename": "AppIcon-29@2x~ipad.png",
      "idiom": "ipad",
      "scale": "2x",
      "size": "29x29"
    },
    {
      "filename": "AppIcon-40@1x.png",
      "idiom": "ipad",
      "scale": "1x",
      "size": "40x40"
    },
    {
      "filename": "AppIcon-40@2x~ipad.png",
      "idiom": "ipad",
      "scale": "2x",
      "size": "40x40"
    },
    {
      "filename": "AppIcon-76@1x.png",
      "idiom": "ipad",
      "scale": "1x",
      "size": "76x76"
    },
    {
      "filename": "AppIcon-76@2x.png",
      "idiom": "ipad",
      "scale": "2x",
      "size": "76x76"
    },
    {
      "filename": "AppIcon-83.5@2x.png",
      "idiom": "ipad",
      "scale": "2x",
      "size": "83.5x83.5"
    },
    {
      "filename": "AppIcon-1024@1x.png",
      "idiom": "ios-marketing",
      "scale": "1x",
      "size": "1024x1024"
    }
  ],
  "info": {
    "author": "xcode",
    "version": 1
  }
}
EOF

echo "✓ iOS icon generation complete!"
echo ""
echo "The app icon has been properly configured for all iOS devices."
echo "Run 'npm run ios' to see the new icon in action."