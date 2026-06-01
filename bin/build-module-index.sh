#!/bin/bash

set -euo pipefail

script_folder=$(dirname "$(realpath "$0")")

if [ -z "${1:-}" ]; then
    echo "Usage: $0 <module-name>" >&2
    exit 1
fi

module_name="$1"
module_folder="$(realpath "${script_folder}/../modules/${module_name}")"

if [ ! -d "$module_folder" ]; then
    echo "Module folder not found: ${module_folder}" >&2
    exit 1
fi

index_file="${module_folder}/index.ts"

# Convert hyphenated filename to camelCase identifier (arm-leather → armLeather)
toCamelCase() {
    echo "$1" | sed -E 's/-([a-zA-Z0-9])/\u\1/g'
}

mapfile -t json_files < <(find "$module_folder" -name "*.json" | sort)

{
    for json_file in "${json_files[@]}"; do
        relative="${json_file#$module_folder/}"
        relative_nojson="${relative%.json}"
        key="$(basename "$json_file" .json)"
        identifier="$(toCamelCase "$key")"
        echo "import ${identifier} from './${relative_nojson}.json';"
    done

    echo ""
    echo "export default {"
    echo "    blueprints: {"

    for json_file in "${json_files[@]}"; do
        key="$(basename "$json_file" .json)"
        identifier="$(toCamelCase "$key")"
        echo "        '${key}': ${identifier},"
    done

    echo "    },"
    echo "};"
} > "$index_file"

echo "Generated ${index_file}"
