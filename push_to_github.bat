@echo off
setlocal
echo ========================================================
echo  🌿 Bhuvi Mehandi - Push to GitHub Helper
echo ========================================================
echo.
set PATH=C:\Users\admin\.git-bin\cmd;%PATH%
set /p REPO_URL="Enter your GitHub repository URL (e.g. https://github.com/username/repo.git): "
if "%REPO_URL%"=="" (
    echo [ERROR] No URL provided. Exiting.
    pause
    exit /b 1
)

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
echo.
echo Pushing code to GitHub...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo  SUCCESS: Code uploaded to GitHub successfully!
    echo  Next: Open https://vercel.com and import your repo to deploy!
    echo ========================================================
) else (
    echo.
    echo ERROR: Push failed. Please check your GitHub credentials / URL.
)
pause
