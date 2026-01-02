@echo off
echo Actualizando npm...
call npm install -g npm@11.7.0

echo.
echo Instalando dependencias del servidor...
cd server
call npm install --legacy-peer-deps
cd ..

echo.
echo Instalando dependencias del cliente...
cd client
call npm install --legacy-peer-deps
cd ..

echo.
echo Instalando dependencias principales...
call npm install --legacy-peer-deps

echo.
echo ¡Listo! Ahora ejecuta: iniciar.bat
pause
