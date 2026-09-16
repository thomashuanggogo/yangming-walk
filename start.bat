@echo off
chcp 65001 >nul
echo 正在啟動陽明里 2D 遊戲本機伺服器...
echo 請保持此視窗開啟，並在瀏覽器造訪: http://localhost:3000
echo.
start http://localhost:3000
node serve.js
pause
