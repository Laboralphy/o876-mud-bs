#!/bin/bash

script_folder=$(dirname "$(realpath "$0")")
target_folder=$(realpath "${script_folder}/../src/consts")
index_json="${target_folder}/index.json"

echo "generating constant index"

# Crete empty index json
echo '{}' > "$index_json"

# Check if jq is available
if ! command -v jq &> /dev/null; then
    echo "Error: jq is not installed."
    exit 1
fi

# Iterate each .json file
for this_file in "$target_folder"/*.json; do
    # Ignore index.json
    if [ '$(basename "$this_file")' != '$index_json' ]; then
        # Merge file content in index.json
        jq -s '.[0] * .[1]' "$index_json" "$this_file" > tmp.json && mv tmp.json "$index_json"
    fi
done
echo "generated: $index_json"
