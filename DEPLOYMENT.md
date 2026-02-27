# Deployment Guide for Azure VM

Follow these steps to deploy the latest changes to the Azure VM.

## 1. Connect to the VM
SSH into your Azure Virtual Machine.
```bash
ssh <username>@20.235.178.245
# Replace <username> with your actual username
```

## 2. Navigate to Project Directory
Change to the directory where the application is hosted.
```bash
cd /path/to/NowcastAI
# Replace with the actual path, e.g., /var/www/nowcast or ~/NowcastAI
```

## 3. Pull Latest Changes
**Note:** The latest changes were pushed to the `main` branch.
```bash
git fetch origin
git checkout main
git pull origin main
```

## 4. Install Dependencies
Ensure all new dependencies are installed.
```bash
npm install
```

## 5. Build the Application
Create the production build.
```bash
npm run build
```

## 6. Restart/Update Server
Depending on how you are serving the application, restart the service.

### Option A: Using PM2 (Common for simple deployments)
```bash
pm2 restart all
# OR if serving the dist folder directly
pm2 delete nowcast-app
pm2 serve dist 3000 --name "nowcast-app" --spa
```

### Option B: Using Nginx (Static Site)
If you are using Nginx to serve the `dist` folder, usually no restart is needed if the build overwrites the files. However, you might want to reload configuration if changed.
```bash
sudo systemctl reload nginx
```
