@echo off
chcp 65001 >nul
echo ====================================================
echo 正在啟動陽明里漫步本機遊戲伺服器...
echo ====================================================
echo.
echo 伺服器網址: http://localhost:3000
echo 若欲結束伺服器，請直接關閉此視窗或按下 Ctrl + C。
echo.
start "" http://localhost:3000
node serve.js
pause
