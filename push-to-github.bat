@echo off
chcp 65001 >nul
set PATH=D:\Git\cmd;%PATH%
echo ========================================================
echo   LITTLE BLOOM - ĐẨY DỰ ÁN LÊN GITHUB ĐỂ DEPLOY RENDER
echo ========================================================
echo.
echo Bước 1: Hãy vào https://github.com/new tạo 1 repository mới (Public hoặc Private).
echo Bước 2: Dán đường dẫn repository của bạn vào đây (ví dụ: https://github.com/username/little-bloom.git)
echo.
set /p REPO_URL="Nhập GitHub Repo URL: "
if "%REPO_URL%"=="" (
    echo Chưa nhập URL! Vui lòng thử lại.
    pause
    exit /b
)

git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git branch -M main
echo.
echo Đang tải code lên GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo THÀNH CÔNG! Code đã được đưa lên GitHub.
    echo Bây giờ bạn chỉ cần vào https://dashboard.render.com
    echo  - Bấm "New +" -> chọn "Static Site" (Khuyên dùng để chạy 24/7 không bị ngủ đông)
    echo  - Chọn repository GitHub vừa tạo
    echo  - Bấm "Create Static Site" là xong!
    echo ========================================================
) else (
    echo.
    echo Có lỗi xảy ra khi push. Hãy kiểm tra xem bạn đã đăng nhập GitHub trên máy chưa.
)
pause
