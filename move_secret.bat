@echo off
set /p origin_namespace="Enter the orginin namespace: "
set /p target_namespace="Enter the target namespace: "
set /p secret_name="Enter the secret name: "

echo Moving secret %secret_name% from %origin_namespace% namespace to %target_namespace% namespace...
powershell -Command "kubectl get secret %secret_name% --namespace %origin_namespace% -oyaml | Select-String -NotMatch '^\s*namespace:\s' | ForEach-Object { $_.Line } | kubectl apply --namespace %target_namespace% -f -"

echo Secret %secret_name% has been moved to the %target_namespace% namespace.
