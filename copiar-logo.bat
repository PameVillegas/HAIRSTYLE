@echo off
if not exist "client\public" mkdir "client\public"
copy logo.jpg client\public\logo.jpg
echo Logo copiado exitosamente!
pause
