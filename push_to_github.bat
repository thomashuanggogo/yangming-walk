@echo off
chcp 65001 >nul
echo =========================================
echo  陽明里漫步指南 - GitHub 一鍵推送工具
echo =========================================
echo.
set /p REPO_URL="請輸入您的 GitHub 倉庫網址 (例如 https://github.com/username/yangming-walk.git): "

if "%REPO_URL%"=="" (
    echo 錯誤: 未輸入倉庫網址。
    pause
    exit /b
)

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
echo.
echo 正在推送到 GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo =========================================
    echo  推送成功！
    echo  請前往 GitHub 該倉庫的 Settings -^> Pages
    echo  Branch 選擇 main，資料夾選擇 /(root)，點擊 Save
    echo  等待約 1 分鐘即可取得公開網址分享給里民！
    echo =========================================
) else (
    echo.
    echo 推送失敗，請確認網址或 GitHub 登入權限。
)
echo.
pause
