#!/bin/bash

# Fix iOS icons to have full background (no transparency)
# This ensures the icon appears round when iOS applies corner rounding

# Background color - matches the base_icon.png background (cream/beige)
BG_COLOR="#F5F0E1"

# Try to find the iOS icon directory
ICON_DIR="ios/wingspanscoreapp/Images.xcassets/AppIcon.appiconset"

if [ ! -d "$ICON_DIR" ]; then
    FOUND_DIR=$(find ios -name "AppIcon.appiconset" -type d 2>/dev/null | head -1)
    if [ -n "$FOUND_DIR" ]; then
        ICON_DIR="$FOUND_DIR"
    else
        # Fall back to assets location
        ICON_DIR="assets/ios-icons"
    fi
fi

if [ ! -d "$ICON_DIR" ]; then
    echo "Error: Could not find iOS icon directory"
    echo "Run 'npm run icons:ios' first to generate icons"
    exit 1
fi

echo "Using icon directory: $ICON_DIR"

echo "Fixing iOS app icons to remove transparency..."

# Array of all iOS icon sizes
declare -a SIZES=(
    "20:1:AppIcon-20@1x.png"
    "40:1:AppIcon-20@2x.png"
    "40:1:AppIcon-20@2x~ipad.png"
    "60:1:AppIcon-20@3x.png"
    "29:1:AppIcon-29@1x.png"
    "58:1:AppIcon-29@2x.png"
    "58:1:AppIcon-29@2x~ipad.png"
    "87:1:AppIcon-29@3x.png"
    "40:1:AppIcon-40@1x.png"
    "80:1:AppIcon-40@2x.png"
    "80:1:AppIcon-40@2x~ipad.png"
    "120:1:AppIcon-40@3x.png"
    "120:1:AppIcon-60@2x.png"
    "180:1:AppIcon-60@3x.png"
    "76:1:AppIcon-76@1x.png"
    "152:1:AppIcon-76@2x.png"
    "167:1:AppIcon-83.5@2x.png"
    "1024:1:AppIcon-1024@1x.png"
)

# Process each icon size
for SIZE_INFO in "${SIZES[@]}"; do
    IFS=':' read -r SIZE SCALE FILENAME <<< "$SIZE_INFO"
    OUTPUT_PATH="$ICON_DIR/$FILENAME"
    
    echo "Creating $FILENAME (${SIZE}x${SIZE})..."
    
    # Create a solid background
    convert -size ${SIZE}x${SIZE} xc:"$BG_COLOR" /tmp/solid_bg.png

    # Composite the current icon over the solid background
    # This removes any transparency by flattening onto the background
    convert /tmp/solid_bg.png "$OUTPUT_PATH" -gravity center -composite -alpha off "$OUTPUT_PATH"
done

# Clean up
rm -f /tmp/solid_bg.png

echo "✅ All iOS icons updated with solid background!"
echo "The icons will now appear round when iOS applies its corner rounding."