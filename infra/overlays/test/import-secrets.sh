if kubectl get namespace "$UNIQUE_NAMESPACE" > /dev/null 2>&1; then
  echo "Namespace '$UNIQUE_NAMESPACE' already exists."
  echo "Attempting to remove existing secrets..."
  kubectl delete secret ${AUTH_SECRET_NAME} --namespace ${UNIQUE_NAMESPACE}
  kubectl delete secret ${SSL_SECRET_NAME} --namespace ${UNIQUE_NAMESPACE}
  echo "Done!"
  
else
  echo "Namespace '$UNIQUE_NAMESPACE' does not exist, yet."
fi

cd target

echo "Attempting to move auth secret..."
kubectl get secret "${AUTH_SECRET_NAME}" --namespace default -oyaml | grep -v '^\s*namespace:\s' > auth-secret.yaml
echo "Attempting to move SSL secret..."
kubectl get secret "${SSL_SECRET_NAME}" --namespace default -oyaml | grep -v '^\s*namespace:\s' > ssl-secret.yaml
echo "Done!"