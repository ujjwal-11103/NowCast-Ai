# NowCast-Ai Deployment Guide for Azure VM

This guide provides comprehensive instructions for deploying the NowCast-Ai application to an Azure Virtual Machine.

## Prerequisites

Before deploying, ensure you have:
- Azure VM with Ubuntu/Debian (recommended) or CentOS/RHEL
- SSH access to the VM (IP: 20.235.178.245)
- Node.js 18+ and npm installed on the VM
- Git installed on the VM
- Nginx or Apache web server (for production)
- PM2 (optional, for process management)

---

## Deployment Steps

### 1. Connect to Azure VM

```bash
ssh <username>@20.235.178.245
# Replace <username> with your actual Azure VM username
# You may need to use SSH key authentication
```

### 2. First-Time Setup (Skip if already done)

If this is your first deployment, set up the environment:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+ (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 globally (for process management)
sudo npm install -g pm2

# Install Nginx (for serving the app)
sudo apt install -y nginx

# Clone the repository (first time only)
cd /var/www
sudo git clone https://github.com/ujjwal-11103/NowCast-Ai.git
sudo chown -R $USER:$USER NowCast-Ai
cd NowCast-Ai
```

### 3. Navigate to Project Directory

```bash
cd /var/www/NowCast-Ai
# Or wherever your project is located
```

### 4. Pull Latest Changes

```bash
# Fetch and pull latest changes from frontend branch
git fetch origin
git checkout frontend
git pull origin frontend

# If you need to stash local changes first:
# git stash
# git pull origin frontend
# git stash pop
```

### 5. Install Dependencies

```bash
# Install all npm dependencies
npm install

# This may take a few minutes
```

### 6. Build the Application

```bash
# Create production build
npm run build

# The build output will be in the 'dist' folder
# This process may take 2-5 minutes depending on VM resources
```

### 7. Deploy the Application

Choose one of the following deployment methods:

#### **Option A: Using PM2 with Vite Preview (Quick Deploy)**

```bash
# Stop any existing PM2 processes
pm2 stop all
pm2 delete all

# Serve the built application using Vite preview
pm2 start npm --name "nowcast-ai" -- run preview -- --port 3000 --host

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup
# Follow the instructions provided by the command above
```

#### **Option B: Using PM2 to Serve Static Files (Recommended)**

```bash
# Stop any existing PM2 processes
pm2 stop nowcast-ai 2>/dev/null || true
pm2 delete nowcast-ai 2>/dev/null || true

# Serve the dist folder as a SPA (Single Page Application)
pm2 serve dist 3000 --name "nowcast-ai" --spa

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot (if not already done)
pm2 startup
```

#### **Option C: Using Nginx (Production Recommended)**

1. **Configure Nginx:**

```bash
# Create Nginx configuration file
sudo nano /etc/nginx/sites-available/nowcast-ai
```

2. **Add the following configuration:**

```nginx
server {
    listen 80;
    server_name 20.235.178.245;  # Replace with your domain if you have one

    root /var/www/NowCast-Ai/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy configuration (if needed)
    location /api {
        proxy_pass https://nowcast.intellimark.ai;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Additional proxy routes as needed
    location /alfred {
        proxy_pass http://13.71.126.202:8085;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /neptune {
        proxy_pass http://13.71.126.202:8082;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. **Enable the site and restart Nginx:**

```bash
# Create symbolic link to enable the site
sudo ln -sf /etc/nginx/sites-available/nowcast-ai /etc/nginx/sites-enabled/

# Remove default site if it exists
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Ensure Nginx starts on boot
sudo systemctl enable nginx
```

### 8. Configure Firewall (If Needed)

```bash
# Allow HTTP traffic
sudo ufw allow 80/tcp

# Allow HTTPS traffic (if using SSL)
sudo ufw allow 443/tcp

# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

### 9. Verify Deployment

```bash
# Check PM2 status (if using PM2)
pm2 status
pm2 logs nowcast-ai --lines 50

# Check Nginx status (if using Nginx)
sudo systemctl status nginx

# Test the application
curl http://localhost:3000
# Or visit http://20.235.178.245 in your browser
```

---

## Quick Update Script

For subsequent deployments, you can use this quick script:

```bash
#!/bin/bash
cd /var/www/NowCast-Ai
git pull origin frontend
npm install
npm run build

# If using PM2:
pm2 restart nowcast-ai

# If using Nginx:
# sudo systemctl reload nginx

echo "Deployment completed!"
```

Save this as `deploy.sh` and run with `bash deploy.sh`

---

## Troubleshooting

### Build Fails
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use
```bash
# Find process using port 3000
sudo lsof -i :3000
# Kill the process
sudo kill -9 <PID>
```

### PM2 Not Starting
```bash
# Check PM2 logs
pm2 logs nowcast-ai --err

# Restart PM2
pm2 restart nowcast-ai
```

### Nginx 502 Bad Gateway
```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Ensure the application is running
pm2 status
```

### Out of Memory During Build
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

## SSL/HTTPS Setup (Optional)

To enable HTTPS with Let's Encrypt:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is set up automatically
```

---

## Monitoring

```bash
# View PM2 logs
pm2 logs nowcast-ai

# Monitor PM2 processes
pm2 monit

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

---

## Rollback

If deployment fails, rollback to previous version:

```bash
cd /var/www/NowCast-Ai
git log --oneline -10  # Find previous commit hash
git checkout <previous-commit-hash>
npm install
npm run build
pm2 restart nowcast-ai
```

---

## Support

For issues or questions:
- Check application logs: `pm2 logs nowcast-ai`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Review build output for errors
