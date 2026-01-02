@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════
echo   APLICANDO DISEÑO PERSONALIZADO - HAIRSTYLEABII
echo ═══════════════════════════════════════════════════════════
echo.
echo Paso 1: Creando carpeta public...
if not exist "client\public" mkdir "client\public"
echo ✅ Carpeta creada
echo.
echo Paso 2: Copiando logo...
if exist "logo.jpg" (
    copy logo.jpg client\public\logo.jpg >nul
    echo ✅ Logo copiado
) else (
    echo ⚠️  No se encontró logo.jpg en la carpeta principal
    echo    Coloca tu logo.jpg en: %CD%
)
echo.
echo ═══════════════════════════════════════════════════════════
echo   ✅ DISEÑO APLICADO
echo ═══════════════════════════════════════════════════════════
echo.
echo Cambios realizados:
echo - Fondo rosa degradado
echo - Logo en la parte superior
echo - Título: HairStyleAbii
echo - Botones y bordes en tonos rosa
echo.
echo Para ver los cambios:
echo 1. Si el servidor está corriendo, recarga la página (F5)
echo 2. Si no está corriendo, ejecuta: iniciar.bat
echo.
pause
