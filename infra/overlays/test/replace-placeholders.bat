@echo off

setlocal enabledelayedexpansion

rem Change the working directory to the location of the batch script
cd /D %~dp0

rem Generate a unique id for test environment.
for /F "tokens=* USEBACKQ" %%F in (`powershell -Command "[guid]::NewGuid().ToString()"`) do (
  set "UUID=%%F"
)

rem Create target folder if it doesn't exist.
if not exist target mkdir target

rem Replace placeholder 'UUID' values for all YAML files.
for %%f in (*.yaml) do (
  set "inputFile=%%f"
  set "outputFile=target\%%f"

  setlocal enabledelayedexpansion
  for /f "delims=" %%a in (!inputFile!) do (
    SET "s=%%a"
    SET "s=!s:UUID=%UUID%!"
    SET "s=!s:SSL_SECRET_NAME=%SSL_SECRET_NAME%!"
    SET "s=!s:AUTH_SECRET_NAME=%AUTH_SECRET_NAME%!"
    echo !s! >>tempfile.yaml
  )

  rem Move ouput to target folder.
  move /Y tempfile.yaml "!outputFile!"
)
