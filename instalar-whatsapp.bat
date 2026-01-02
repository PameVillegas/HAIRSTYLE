@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════
echo   INSTALANDO WHATSAPP WEB
echo ═══════════════════════════════════════════════════════════
echo.
echo Este proceso puede tardar varios minutos...
echo Puppeteer necesita descargar Chromium (~150MB)
echo.
pause
echo.
cd server
echo Limpiando instalación anterior...
if exist node_modules\puppeteer rmdir /s /q node_modules\puppeteer
if exist node_modules\whatsapp-web.js rmdir /s /q node_modules\whatsapp-web.js
echo.
echo Instalando dependencias...
echo.
call npm install
echo.
echo ═══════════════════════════════════════════════════════════
echo   ✅ INSTALACIÓN COMPLETA
echo ═══════════════════════════════════════════════════════════
echo.
echo Ahora ejecuta: activar-whatsapp.bat
echo.
pause
