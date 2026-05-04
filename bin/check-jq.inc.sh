# Checks if jq is available
if ! command -v jq &> /dev/null; then
    echo "Error: jq is not installed."
    exit 1
fi
