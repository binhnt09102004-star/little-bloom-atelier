@echo off
chcp 65001 >nul
echo ========================================================
echo   LITTLE BLOOM - KHỞI CHẠY LINK WEB PUBLIC (CLOUDFLARE)
echo ========================================================
echo.
echo Đang mở server và đường truyền trực tiếp...
start "Little Bloom Server" /min node server.js
timeout /t 2 >nul
echo.
echo Đường link online của bạn:
cloudflared.exe tunnel --url http://127.0.0.1:3000
pause
