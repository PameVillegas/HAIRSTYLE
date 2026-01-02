@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════
echo   ACTIVAR WHATSAPP WEB - SISTEMA DE TURNOS
echo ═══════════════════════════════════════════════════════════
echo.
echo IMPORTANTE: 
echo - Asegúrate de haber ejecutado instalar-whatsapp.bat primero
echo - Este proceso puede tardar 1-2 minutos la primera vez
echo - Aparecerá un código QR para escanear con WhatsApp
echo.
pause
echo.
echo ═══════════════════════════════════════════════════════════
echo   Iniciando servidor...
echo ═══════════════════════════════════════════════════════════
echo.
cd server
call npm run dev
