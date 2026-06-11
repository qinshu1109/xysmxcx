@echo off
setlocal

cd /d "%~dp0"

where mysql >nul 2>nul
if errorlevel 1 (
  echo ERROR: mysql command was not found.
  echo Please install MySQL for Windows and add mysql.exe to PATH.
  exit /b 1
)

set "MYSQL_USER=root"
if not "%~1"=="" set "MYSQL_USER=%~1"

echo Importing database with user: %MYSQL_USER%
echo You may be asked for the MySQL password twice.
echo.

mysql --default-character-set=utf8mb4 -u%MYSQL_USER% -p < "%~dp0init.sql"
if errorlevel 1 (
  echo ERROR: init.sql import failed.
  exit /b 1
)

mysql --default-character-set=utf8mb4 -u%MYSQL_USER% -p < "%~dp0seed.sql"
if errorlevel 1 (
  echo ERROR: seed.sql import failed.
  exit /b 1
)

echo.
echo Database import completed.
echo Database name: campus_cat_station
endlocal
