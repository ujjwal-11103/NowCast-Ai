# Deployment Guide for Azure VM (Local Build Strategy)

Because the Azure VM has an older version of Node.js (v18.x) that is incompatible with the current Vite build requirements (v20+), the recommended deployment strategy is to **build locally and upload the artifacts**.

## 1. Build Locally
Run the build command on your local machine:
```bash
npm run build
```
This will generate a `dist` folder.

## 2. Prepare the Package
Zip the `dist` folder to make it easier to transfer:
```powershell
# Windows PowerShell
Compress-Archive -Path dist -DestinationPath dist.zip -Force
```

## 3. Upload to VM
Use `scp` to upload the zip file to the VM.
```bash
scp -i "path/to/your/key.pem" dist.zip azureuser@20.235.178.245:/home/azureuser/
```

## 4. Finalize on Server
SSH into the VM and deploy the files:
```bash
# Connect to VM
ssh -i "path/to/your/key.pem" azureuser@20.235.178.245

# Navigate to project
cd ~/NowCast-Ai

# Backup existing build and extract new one
mv dist dist_backup_$(date +%F)
unzip ~/dist.zip -d .

# (Optional) Reload Nginx if configuration changed
sudo systemctl reload nginx
```

## Nginx Configuration Recommendation
Your Nginx should point to `/home/azureuser/NowCast-Ai/dist`. A template for the configuration is available at `./nginx.conf` in the project root, which includes all necessary proxy routes for your AI services.

