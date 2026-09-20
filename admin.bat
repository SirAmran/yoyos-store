@echo off
REM Local price admin for the Yoyos Devices store. Loopback only, closes with Ctrl+C.
cd /d "%~dp0"
echo Starting the price admin...
echo.
start "" cmd /c "timeout /t 2 >nul & start "" http://127.0.0.1:8796/"
node admin.mjs
echo.
echo Admin stopped.
pause
