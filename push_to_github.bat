@echo off
chcp 65001 >nul
echo =========================================
echo  陽明里漫步指南 - GitHub 一鍵推送工具
echo =========================================
echo.
set REPO_URL=https://github.com/thomashuanggogo/yangming-walk.git
echo 目標倉庫：%REPO_URL%
echo.
echo 正在設定遠端倉庫並推送至 main 分支...

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo =========================================
    echo  [成功] 程式碼已成功推送至 GitHub！
    echo.
    echo  請回到剛才開啟的 GitHub Pages 設定頁面：
    echo  1. 按 F5 重新整理網頁
    echo  2. Branch 此時將可選擇「main」
    echo  3. 資料夾維持「/(root)」，點擊「Save」
    echo  4. 等候 1 分鐘即可取得公開遊玩連結！
    echo =========================================
) else (
    echo.
    echo [提示] 若跳出 GitHub 登入確認視窗，請點選「Sign in with your browser」授權。
)
echo.
pause
