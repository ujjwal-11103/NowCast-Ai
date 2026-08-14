#!/bin/bash

set -e  # Exit on error

APP_NAME="vite-app"
APP_DIR="/var/www/$APP_NAME"
NGINX_CONF="/etc/nginx/sites-available/$APP_NAME"

echo "🚀 Starting Vite + Nginx setup..."

# -----------------------------
# 1. Update system
# -----------------------------
echo "📦 Updating system..."
sudo apt update -y

# -----------------------------
# 2. Install Node.js 18
# -----------------------------
if ! command -v node &> /dev/null; then
  echo "📦 Installing Node.js 18..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt install -y nodejs
else
  echo "✅ Node.js already installed"
fi

node -v
npm -v

# -----------------------------
# 3. Install Nginx
# -----------------------------
echo "🌐 Installing Nginx..."
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# -----------------------------
# 4. Build Vite project
# -----------------------------
if [ ! -f "package.json" ]; then
  echo "❌ package.json not found. Run this script from your Vite project root."
  exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building Vite project..."
npm run build

if [ ! -d "dist" ]; then
  echo "❌ dist/ folder not found. Build failed."
  exit 1
fi

# -----------------------------
# 5. Copy build to /var/www
# -----------------------------
echo "📁 Deploying build to $APP_DIR..."
sudo mkdir -p $APP_DIR
sudo rm -rf $APP_DIR/*
sudo cp -r dist/* $APP_DIR/

sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR

# -----------------------------
# 6. Configure Nginx (SPA-safe)
# -----------------------------
echo "📝 Configuring Nginx..."

sudo tee $NGINX_CONF > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    root $APP_DIR;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public";
    }
}
EOF

# Enable site
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# -----------------------------
# 7. Test & restart Nginx
# -----------------------------
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx

# -----------------------------
# DONE
# -----------------------------
echo "✅ Deployment complete!"
echo "🌍 Open your browser: 20.235.178.245:3000"
