@echo off
echo Iniciando servidor backend...
start "Backend Server" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo Iniciando aplicación frontend...
echo.
echo La página se abrirá en: http://localhost:5173
echo.
cd client
call npm run dev
