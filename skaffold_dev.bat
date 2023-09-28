@echo off

REM Start the minikube tunnel in the background
start /B minikube tunnel >nul 2>&1

REM Run Skaffold with the "dev" profile
skaffold dev -p dev

REM Kill the minikube tunnel when Skaffold finishes
taskkill /IM minikube.exe /F
