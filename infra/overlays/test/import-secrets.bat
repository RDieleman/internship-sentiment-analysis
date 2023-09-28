@echo off
powershell -Command "kubectl get secret %SSL_SECRET_NAME% --namespace default -oyaml | Select-String -NotMatch '^\s*namespace:\s' | ForEach-Object { $_.Line } | Out-File -FilePath target/ssl-secret.yaml"
powershell -Command "kubectl get secret %AUTH_SECRET_NAME% --namespace default -oyaml | Select-String -NotMatch '^\s*namespace:\s' | ForEach-Object { $_.Line } | Out-File -FilePath target/auth-secret.yaml"