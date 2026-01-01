#!/bin/bash

# Optimize banner images for better performance
# This script reduces file sizes while maintaining visual quality

echo "🎨 Optimizing banner images..."

# Create optimized directory
mkdir -p assets/optimized

# Check for required tools
if ! command -v pngquant &> /dev/null; then
    echo "pngquant not found. Installing..."
    brew install pngquant
fi

# Function to optimize PNG images
optimize_png() {
    local input=$1
    local output=$2
    local width=$3
    
    echo "Optimizing $input..."
    
    # First resize if needed (max width for retina displays)
    if [ -n "$width" ]; then
        # Resize and convert to more efficient format
        magick "$input" -resize "${width}x>" -strip -quality 90 PNG24:"$output.tmp"
    else
        cp "$input" "$output.tmp"
    fi
    
    # Then compress with pngquant
    pngquant --quality=65-90 --speed 1 --force --output "$output" "$output.tmp"
    rm -f "$output.tmp"
    
    # Get file sizes for comparison
    original_size=$(ls -lh "$input" | awk '{print $5}')
    new_size=$(ls -lh "$output" | awk '{print $5}')
    
    echo "  Original: $original_size → Optimized: $new_size"
}

# Optimize banner images (max width 1200px for retina displays)
for banner in assets/ih-*-banner.png assets/ih-banner.png; do
    if [ -f "$banner" ]; then
        filename=$(basename "$banner")
        optimize_png "$banner" "assets/optimized/$filename" 1200
    fi
done

# Copy smaller images without modification
echo "Copying smaller images..."
cp assets/ih-tab-logo*.png assets/optimized/
cp assets/ih-logo-*.png assets/optimized/
cp assets/illuminate_hope-*.png assets/optimized/ 2>/dev/null || true

echo "✅ Image optimization complete!"
echo ""
echo "To use optimized images:"
echo "1. Review the optimized images in assets/optimized/"
echo "2. If satisfied, run: mv assets/optimized/* assets/"
echo "3. Commit the changes"
echo ""
echo "Note: You may need to clear Metro cache after replacing images:"
echo "npx expo start --clear"