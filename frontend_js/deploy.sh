#!/bin/bash

# Configuration
BUCKET_NAME="kangjiesu.com"
REGION="ca-central-1"
BUILD_DIR="dist"  # Vite uses 'dist' by default

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Starting deployment process..."

# Build the application
echo "Building the application..."
npm run build

# Check if build was successful
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}Build failed or build directory not found${NC}"
    exit 1
fi

# Deploy to S3
echo "Deploying to S3..."
aws s3 sync $BUILD_DIR s3://$BUCKET_NAME --delete

# Check if sync was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Deployment successful!${NC}"
    echo "Your website is available at: http://${BUCKET_NAME}.s3-website.${REGION}.amazonaws.com"
else
    echo -e "${RED}Deployment failed${NC}"
    exit 1
fi