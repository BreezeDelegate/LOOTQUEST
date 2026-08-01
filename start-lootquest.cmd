@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo LootQuest requires Node.js 20 or newer.
  echo Install it from https://nodejs.org and run this file again.
  pause
  exit /b 1
)

node scripts\start.mjs
if errorlevel 1 pause
