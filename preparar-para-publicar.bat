@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════
echo   PREPARAR PROYECTO PARA PUBLICAR EN INTERNET
echo ═══════════════════════════════════════════════════════════
echo.
echo Este script prepara tu proyecto para subirlo a GitHub/Render
echo.
pause
echo.
echo Verificando archivos necesarios...
echo.

if exist "render.yaml" (
    echo ✅ render.yaml encontrado
) else (
    echo ❌ render.yaml no encontrado
)

if exist ".gitignore" (
    echo ✅ .gitignore encontrado
) else (
    echo ❌ .gitignore no encontrado
)

if exist "README.md" (
    echo ✅ README.md encontrado
) else (
    echo ❌ README.md no encontrado
)

echo.
echo ═══════════════════════════════════════════════════════════
echo   PRÓXIMOS PASOS:
echo ═══════════════════════════════════════════════════════════
echo.
echo 1. Instala GitHub Desktop: https://desktop.github.com
echo 2. Abre GitHub Desktop y agrega este proyecto
echo 3. Publica el repositorio en GitHub
echo 4. Ve a Render.com y conecta tu repositorio
echo 5. ¡Tu app estará en línea!
echo.
echo 📄 Lee PUBLICAR-ONLINE.md para instrucciones detalladas
echo.
pause
