@echo off
REM UrbanEcho Deployment Script for Windows
echo 🚀 Starting UrbanEcho Deployment...

REM Step 1: Install dependencies
echo 📦 Installing dependencies...
npm install

REM Step 2: Build the frontend
echo 🔨 Building frontend...
npm run build

REM Step 3: Check if build was successful
if not exist "client\build" (
    echo ❌ Build failed! Please check the errors above.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

echo.
echo 🎯 Deployment Instructions:
echo.
echo 1. FRONTEND ^(Netlify^):
echo    - Go to https://netlify.com
echo    - Drag ^& drop the 'client/build' folder
echo    - OR connect your GitHub repository
echo    - Build command: npm run build
echo    - Publish directory: client/build
echo.
echo 2. BACKEND ^(Railway^):
echo    - Go to https://railway.app
echo    - Create new project from GitHub
echo    - Add these environment variables in Railway:
echo      * NODE_ENV=production
echo      * PORT=5001
echo      * MONGO_URI=mongodb+srv://urbanecho_user:likhi21@urbanecho.bzswilc.mongodb.net/urbanecho?retryWrites=true^&w=majority^&appName=UrbanEcho
echo      * JWT_SECRET=your_secure_secret_here
echo      * FRONTEND_URL=https://your-netlify-site.netlify.app
echo.
echo 3. UPDATE CONFIGURATIONS:
echo    - Replace 'your-netlify-site.netlify.app' with your actual Netlify URL
echo    - Replace 'your-railway-app.railway.app' with your actual Railway URL
echo    - Update CORS origins in server/index.js
echo    - Update MongoDB Atlas IP whitelist
echo.
echo ✅ Deployment preparation complete!
echo.
echo 📋 Next steps:
echo    1. Deploy frontend to Netlify
echo    2. Deploy backend to Railway
echo    3. Update environment variables
echo    4. Update configuration files with real URLs
echo    5. Test your deployed application
echo.
pause
