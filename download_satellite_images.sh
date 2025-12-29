#!/bin/bash

# Script to download satellite images from International Charter Space and Major Disasters
# Usage: ./download_satellite_images.sh

echo "🛰️ Downloading 2011 Namibia Flood Satellite Images"
echo "=================================================="

# Base URL for the disasters charter
BASE_URL="https://disasterscharter.org"

# Create output directory
OUTPUT_DIR="/workspaces/flood-awareness-gis-system/public/satellite-images/historical-floods-2011"
mkdir -p "$OUTPUT_DIR"

echo "📁 Output directory: $OUTPUT_DIR"
echo ""

# Note: Direct image download URLs need to be obtained from the website
# This script provides instructions for manual download

echo "📋 Manual Download Instructions:"
echo "================================"
echo ""
echo "1. Open browser: https://disasterscharter.org/library/products?disaster=flood&location=Namibia"
echo ""
echo "2. Download these specific products:"
echo "   - SPOT-5 Satellite Imagery (MEDIA-360-13)"
echo "   - Formosat Satellite Imagery (MEDIA-360-12)"
echo "   - WorldView Satellite Imagery (MEDIA-360-11)"
echo "   - SPOT-5 Satellite Imagery (MEDIA-360-10)"
echo "   - RADARSAT Radar Imagery (MEDIA-360-09)"
echo "   - TSX Satellite Imagery (MEDIA-360-08)"
echo "   - RADARSAT Satellite Imagery (MEDIA-360-07)"
echo "   - JAXA Radar Imagery (MEDIA-360-06)"
echo ""
echo "3. Save images with these filenames:"
echo "   - spot-5-flooding-northern-namibia-2011-04-05.jpg"
echo "   - formosat-flooding-northern-namibia-2011-04-12.jpg"
echo "   - worldview-flooding-northern-namibia-2011-04-15.jpg"
echo "   - radarsat-flooding-northern-namibia-2011-03-24.jpg"
echo "   - tsx-flooding-northern-namibia-2011-04-11.jpg"
echo "   - radarsat-satellite-imagery-2011-03-24.jpg"
echo "   - jaxa-flooding-northern-namibia-2011-04-05.jpg"
echo ""
echo "4. Place files in: public/satellite-images/historical-floods-2011/"
echo ""
echo "✅ After downloading, restart the development server to see the images in the dashboard."