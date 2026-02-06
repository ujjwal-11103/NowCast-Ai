#!/bin/bash

# NowCast-Ai Deployment Script for Azure VM
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 Starting NowCast-Ai Deployment..."
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/NowCast-Ai"
BRANCH="frontend"
APP_NAME="nowcast-ai"

# Step 1: Navigate to project directory
echo -e "${YELLOW}📂 Navigating to project directory...${NC}"
cd "$PROJECT_DIR" || { echo -e "${RED}❌ Failed to navigate to $PROJECT_DIR${NC}"; exit 1; }

# Step 2: Stash any local changes
echo -e "${YELLOW}💾 Stashing local changes...${NC}"
git stash

# Step 3: Pull latest changes
echo -e "${YELLOW}⬇️  Pulling latest changes from $BRANCH branch...${NC}"
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

# Step 4: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Step 5: Build the application
echo -e "${YELLOW}🔨 Building the application...${NC}"
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed! dist folder not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"

# Step 6: Deploy based on available service
if command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}🔄 Restarting PM2 process...${NC}"
    
    # Check if app is already running
    if pm2 list | grep -q "$APP_NAME"; then
        pm2 restart "$APP_NAME"
    else
        # Start new PM2 process
        pm2 serve dist 3000 --name "$APP_NAME" --spa
    fi
    
    pm2 save
    echo -e "${GREEN}✅ PM2 process restarted!${NC}"
    
elif systemctl is-active --quiet nginx; then
    echo -e "${YELLOW}🔄 Reloading Nginx...${NC}"
    sudo systemctl reload nginx
    echo -e "${GREEN}✅ Nginx reloaded!${NC}"
    
else
    echo -e "${YELLOW}⚠️  No PM2 or Nginx found. Please manually serve the dist folder.${NC}"
fi

# Step 7: Verify deployment
echo -e "${YELLOW}🔍 Verifying deployment...${NC}"

if command -v pm2 &> /dev/null; then
    pm2 status
fi

# Test if the app is responding
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Application is responding!${NC}"
else
    echo -e "${YELLOW}⚠️  Application might not be responding on port 3000${NC}"
fi

echo ""
echo -e "${GREEN}=================================="
echo -e "🎉 Deployment completed successfully!"
echo -e "==================================${NC}"
echo ""
echo "📊 Next steps:"
echo "  - Visit http://20.235.178.245 to view the application"
echo "  - Check logs with: pm2 logs $APP_NAME"
echo "  - Monitor with: pm2 monit"
echo ""
