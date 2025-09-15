@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 檢查是否有專案配置檔案
if not exist "project_config.txt" (
    echo ================================
    echo 專案初始化設定
    echo ================================
    echo.
    echo 這是第一次使用，需要設定專案資訊
    echo.
    
    set /p project_name=請輸入專案名稱: 
    set /p github_repo=請輸入GitHub Repository: 
    set /p github_pages=請輸入GitHub Pages網址: 
    echo.
    echo 常見的網頁檔案類型：html,js,css,json,txt,md
    set /p file_types=請輸入要管理的檔案類型 (用逗號分隔): 
    
    REM 如果沒有輸入檔案類型，使用預設值
    if "%file_types%"=="" set file_types=html,js,css,json,txt,md
    
    echo 專案名稱=%project_name% > project_config.txt
    echo GitHub Repository=%github_repo% >> project_config.txt
    echo GitHub Pages=%github_pages% >> project_config.txt
    echo 檔案類型=%file_types% >> project_config.txt
    
    echo.
    echo 專案設定已儲存到 project_config.txt
    echo 檔案類型設定為：%file_types%
    echo.
    pause
)

REM 讀取專案配置
for /f "tokens=1,2 delims==" %%a in (project_config.txt) do (
    if "%%a"=="專案名稱" set project_name=%%b
    if "%%a"=="GitHub Repository" set github_repo=%%b
    if "%%a"=="GitHub Pages" set github_pages=%%b
    if "%%a"=="檔案類型" set file_types=%%b
)

:start
echo ================================
echo %project_name% - 版本管理工具
echo ================================
echo.
echo 調試資訊：
echo 專案名稱：%project_name%
echo 檔案類型：%file_types%
echo.

echo 請選擇操作：
echo 1. 部署指定版本 (上架)
echo 2. 下架所有檔案
echo 3. 建立版本備份
echo 4. 查看可用版本
echo 5. 重新設定專案
echo 6. 測試檔案複製
echo 7. 退出
echo.

set /p choice=請輸入選項 (1-7): 

if "%choice%"=="1" goto deploy_version
if "%choice%"=="2" goto cleanup_github
if "%choice%"=="3" goto create_backup
if "%choice%"=="4" goto show_versions
if "%choice%"=="5" goto reconfigure
if "%choice%"=="6" goto test_copy
if "%choice%"=="7" goto exit
echo 無效選項
pause
goto start

:deploy_version
echo.
echo 可用的本地版本：
dir /b | findstr "^v" 2>nul
echo.

if errorlevel 1 (
    echo 沒有找到版本資料夾！
    echo.
    echo 建議操作：
    echo 1. 使用 "3. 建立版本備份" 建立版本
    echo.
    pause
    goto start
)

echo.
set /p version=請輸入要部署的版本號: 

if "%version%"=="" (
    echo 版本號不能為空！
    pause
    goto start
)

if not exist "%version%" (
    echo 版本資料夾不存在：%version%
    echo 可用的版本：
    dir /b | findstr "^v"
    pause
    goto start
)

echo.
echo 正在部署版本：%version%
echo.

echo 步驟1: 備份當前檔案...
if not exist "backup_current" mkdir backup_current
set "file_types_space=%file_types:,= %"
for %%f in (%file_types_space%) do copy *.%%f "backup_current\" 2>nul
echo 當前檔案已備份

echo.
echo 步驟2: 下架GitHub舊檔案...
git rm -r --cached .
echo GitHub舊檔案已下架

echo.
echo 步驟3: 複製版本檔案...
set "file_types_space=%file_types:,= %"
for %%f in (%file_types_space%) do copy "%version%\*.%%f" . 2>nul
echo 版本檔案已複製

echo.
echo 步驟4: 添加新檔案到Git...
set "file_types_space=%file_types:,= %"
for %%f in (%file_types_space%) do git add *.%%f
echo 新檔案已添加到Git

echo.
echo 步驟5: 提交變更...
set commit_msg=部署版本 %version% - %date% %time%
git commit -m "%commit_msg%"
echo 變更已提交

echo.
echo 步驟6: 上架到GitHub...
git push origin main
echo 版本 %version% 已上架到GitHub

echo.
echo ================================
echo 部署完成！
echo ================================
echo.
echo 部署資訊：
echo   專案：%project_name%
echo   版本：%version%
echo   時間：%date% %time%
echo   GitHub：https://github.com/%github_repo%
echo   網站：%github_pages%
echo.

set /p restore=是否恢復到部署前的狀態？(y/n): 
if /i "%restore%"=="y" (
    echo.
    echo 正在恢復檔案...
    set "file_types_space=%file_types:,= %"
    for %%f in (%file_types_space%) do copy "backup_current\*.%%f" . 2>nul
    echo 檔案已恢復到部署前狀態
    echo.
    echo 提示：GitHub上仍然是 %version% 版本
    echo     只有本地檔案恢復了
)

echo.
echo 感謝使用版本管理工具！
echo.
pause
goto start

:cleanup_github
echo.
echo ================================
echo 下架所有檔案
echo ================================
echo.

echo 警告：這將刪除GitHub上的所有檔案！
echo.
echo 下架後的效果：
echo - GitHub Repository 會變成空白
echo - 網站會無法顯示
echo - 所有檔案都會被移除
echo.

set /p confirm=確定要下架所有檔案嗎？(y/n): 

if /i not "%confirm%"=="y" (
    echo 操作已取消
    pause
    goto start
)

echo.
echo 步驟1: 備份當前檔案...
if not exist "backup_before_cleanup" mkdir backup_before_cleanup
set "file_types_space=%file_types:,= %"
for %%f in (%file_types_space%) do copy *.%%f "backup_before_cleanup\" 2>nul
echo 檔案已備份到 backup_before_cleanup 資料夾

echo.
echo 步驟2: 下架GitHub檔案...
git rm -r --cached .
echo GitHub檔案已從暫存區移除

echo.
echo 步驟3: 提交下架變更...
git commit -m "下架所有檔案 - %date% %time%"
echo 下架變更已提交

echo.
echo 步驟4: 推送到GitHub...
git push origin main
echo 下架完成，已推送到GitHub

echo.
echo ================================
echo 下架完成！
echo ================================
echo.
echo 下架資訊：
echo   專案：%project_name%
echo   時間：%date% %time%
echo   GitHub：https://github.com/%github_repo% (現在是空白)
echo   網站：%github_pages% (無法顯示)
echo.
echo 備份位置：backup_before_cleanup 資料夾
echo.
echo 提示：可以選擇 "1. 部署指定版本" 重新上架版本
echo.
pause
goto start

:create_backup
echo.
echo ================================
echo %project_name% - 版本備份
echo ================================
echo.

set /p version=請輸入版本號: 

if "%version%"=="" (
    echo 版本號不能為空！
    pause
    goto start
)

echo 正在建立 %version% 資料夾...
if not exist "%version%" mkdir "%version%"
if exist "%version%" (
    echo 資料夾建立成功：%version%
) else (
    echo 錯誤：無法建立資料夾 %version%
    pause
    goto start
)

echo 正在複製檔案...
echo 檔案類型：%file_types%
echo 當前目錄檔案：
dir /b *.html *.js *.css *.json *.txt *.md 2>nul
echo.

set copy_count=0
REM 將逗號分隔的檔案類型轉換為空格分隔
set "file_types_space=%file_types:,= %"
for %%f in (%file_types_space%) do (
    echo 正在複製 *.%%f 檔案...
    for %%i in (*.%%f) do (
        if exist "%%i" (
            echo   找到檔案：%%i
            copy "%%i" "%version%\" >nul
            if !errorlevel! equ 0 (
                echo   已複製：%%i
                set /a copy_count+=1
            ) else (
                echo   複製失敗：%%i
            )
        ) else (
            echo   沒有找到 *.%%f 檔案
        )
    )
)

echo.
if %copy_count% gtr 0 (
    echo 複製完成！共複製了 %copy_count% 個檔案
) else (
    echo 警告：沒有複製任何檔案！
    echo 請檢查檔案類型設定是否正確
)
echo 版本資料夾：%version%
echo.

set /p deploy_now=是否立即部署此版本？(y/n): 
if /i "%deploy_now%"=="y" (
    echo.
    echo 正在部署版本 %version%...
    goto deploy_version
)

echo.
echo 提示：可以選擇 "1. 部署指定版本" 來部署此版本
echo.
pause
goto start

:show_versions
echo.
echo ================================
echo 版本資訊
echo ================================
echo.

echo 本地版本：
dir /b | findstr "^v" 2>nul
if errorlevel 1 (
    echo 沒有找到版本資料夾
) else (
    echo 找到以上版本
)
echo.

echo GitHub狀態：
git status 2>nul
if errorlevel 1 (
    echo Git未初始化
) else (
    echo Git已初始化
)
echo.

echo 最近提交記錄：
git log --oneline -5 2>nul
echo.

echo 專案設定：
echo   專案名稱：%project_name%
echo   GitHub Repository：%github_repo%
echo   GitHub Pages：%github_pages%
echo   檔案類型：%file_types%
echo.

pause
goto start

:reconfigure
echo.
echo ================================
echo 重新設定專案
echo ================================
echo.

echo 當前設定：
echo   專案名稱：%project_name%
echo   GitHub Repository：%github_repo%
echo   GitHub Pages：%github_pages%
echo   檔案類型：%file_types%
echo.

set /p new_project_name=請輸入新的專案名稱 (直接按Enter保持不變): 
if not "%new_project_name%"=="" set project_name=%new_project_name%

set /p new_github_repo=請輸入新的GitHub Repository (直接按Enter保持不變): 
if not "%new_github_repo%"=="" set github_repo=%new_github_repo%

set /p new_github_pages=請輸入新的GitHub Pages網址 (直接按Enter保持不變): 
if not "%new_github_pages%"=="" set github_pages=%new_github_pages%

set /p new_file_types=請輸入新的檔案類型 (直接按Enter保持不變): 
if not "%new_file_types%"=="" set file_types=%new_file_types%

echo 專案名稱=%project_name% > project_config.txt
echo GitHub Repository=%github_repo% >> project_config.txt
echo GitHub Pages=%github_pages% >> project_config.txt
echo 檔案類型=%file_types% >> project_config.txt

echo.
echo 專案設定已更新
echo.
pause
goto start

:test_copy
echo.
echo ================================
echo 測試檔案複製功能
echo ================================
echo.

echo 當前目錄檔案：
dir /b *.html *.js *.css *.json *.txt *.md 2>nul
echo.

echo 檔案類型設定：%file_types%
set "file_types_space=%file_types:,= %"
echo 轉換後：%file_types_space%
echo.

echo 測試複製到 test_backup 資料夾...
if not exist "test_backup" mkdir "test_backup"

set copy_count=0
for %%f in (%file_types_space%) do (
    echo 正在測試複製 *.%%f 檔案...
    for %%i in (*.%%f) do (
        if exist "%%i" (
            echo   找到檔案：%%i
            copy "%%i" "test_backup\" >nul
            if !errorlevel! equ 0 (
                echo   複製成功：%%i
                set /a copy_count+=1
            ) else (
                echo   複製失敗：%%i
            )
        ) else (
            echo   沒有找到 *.%%f 檔案
        )
    )
)

echo.
if %copy_count% gtr 0 (
    echo 測試完成！成功複製了 %copy_count% 個檔案到 test_backup 資料夾
    echo 請檢查 test_backup 資料夾確認檔案是否正確複製
) else (
    echo 測試失敗！沒有複製任何檔案
    echo 請檢查檔案類型設定和檔案是否存在
)

echo.
pause
goto start

:exit
echo 感謝使用版本管理工具！
pause
exit
