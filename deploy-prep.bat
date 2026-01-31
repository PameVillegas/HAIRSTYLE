@echo off
echo ========================================
echo   Preparando HairStyleAbii para Deploy
echo ========================================
echo.

echo 1. Instalando dependencias del cliente...
cd client
call npm install
echo.

echo 2. Construyendo aplicacion cliente...
call npm run build
echo.

echo 3. Instalando dependencias del servidor...
cd ../server
call npm install
echo.

echo 4. Verificando archivos...
if exist "../client/dist" (
    echo ✅ Build del cliente completado
) else (
    echo ❌ Error en build del cliente
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ Preparacion completada!
echo ========================================
echo.
echo Proximos pasos:
echo 1. Sube el codigo a GitHub
echo 2. Ve a render.com o railway.app
echo 3. Conecta tu repositorio
echo 4. Configura las variables de entorno
echo 5. ¡Despliega!
echo.
echo Tu app estara disponible en:
echo https://hairstyle-abi.onrender.com
echo.
pause