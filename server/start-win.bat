@echo off
setlocal

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: node command was not found.
  echo Please install Node.js for Windows first.
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm command was not found.
  echo Please reinstall Node.js and make sure npm is in PATH.
  exit /b 1
)

if not exist ".env" (
  copy ".env.example" ".env" >nul
  echo Created server\.env from server\.env.example.
  echo Please edit DB_PASSWORD in server\.env if your MySQL root user has a password.
  echo.
)

if not exist "node_modules" (
  echo Installing server dependencies...
  call npm install
  if errorlevel 1 (
    echo ERROR: npm install failed.
    exit /b 1
  )
)

echo Starting Express API: http://localhost:3000/api
call npm run start
endlocal
