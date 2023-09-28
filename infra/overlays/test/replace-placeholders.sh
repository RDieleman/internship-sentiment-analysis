# Create target folder if it doesn't exist.
mkdir -p target

# Replace placeholder 'UUID' values for all YAML files.
for f in *.yaml; do
  inputFile="$f"
  outputFile="target/$f"

  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line//UNIQUE_NAMESPACE/$UNIQUE_NAMESPACE}"
    line="${line//SSL_SECRET_NAME/$SSL_SECRET_NAME}"
    line="${line//AUTH_SECRET_NAME/$AUTH_SECRET_NAME}"
    echo "$line"
  done < "$inputFile" > "$outputFile"

  echo "Moved file!"
done
