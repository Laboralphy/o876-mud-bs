#!/bin/bash

set -euo pipefail

script_folder=$(dirname "$(realpath "$0")")

if [ -z "${1:-}" ]; then
    echo "Usage: $0 <module-name>" >&2
    exit 1
fi

module_name="$1"
module_folder="$(realpath "${script_folder}/../src/modules/${module_name}")"

if [ ! -d "$module_folder" ]; then
    echo "Module folder not found: ${module_folder}" >&2
    exit 1
fi

index_file="${module_folder}/index.ts"

# Convert hyphenated filename to camelCase identifier (arm-leather → armLeather)
toCamelCase() {
    echo "$1" | sed -E 's/-([a-zA-Z0-9])/\u\1/g'
}

blueprints_folder="${module_folder}/blueprints"
thinkers_folder="${module_folder}/thinkers"
actions_folder="${module_folder}/actions"

json_files=()
if [ -d "$blueprints_folder" ]; then
    mapfile -t json_files < <(find "$blueprints_folder" -name "*.json" | sort)
fi

thinker_files=()
if [ -d "$thinkers_folder" ]; then
    mapfile -t thinker_files < <(find "$thinkers_folder" -maxdepth 1 -name "*.ts" | sort)
fi

action_files=()
if [ -d "$actions_folder" ]; then
    mapfile -t action_files < <(find "$actions_folder" -maxdepth 1 -name "*.ts" | sort)
fi

{
    for json_file in "${json_files[@]}"; do
        relative="${json_file#$module_folder/}"
        identifier="$(toCamelCase "$(basename "$json_file" .json)")"
        echo "import ${identifier} from './${relative%.json}.json';"
    done

    for ts_file in "${thinker_files[@]}"; do
        relative="${ts_file#$module_folder/}"
        identifier="$(toCamelCase "$(basename "$ts_file" .ts)")"
        echo "import ${identifier} from './${relative%.ts}';"
    done

    for ts_file in "${action_files[@]}"; do
        relative="${ts_file#$module_folder/}"
        identifier="$(toCamelCase "$(basename "$ts_file" .ts)")"
        echo "import ${identifier} from './${relative%.ts}';"
    done

    echo ""
    echo "export default {"
    echo "    blueprints: {"
    for json_file in "${json_files[@]}"; do
        key="$(basename "$json_file" .json)"
        echo "        '${key}': $(toCamelCase "$key"),"
    done
    echo "    },"

    if [ ${#thinker_files[@]} -gt 0 ]; then
        echo "    thinkers: {"
        for ts_file in "${thinker_files[@]}"; do
            key="$(basename "$ts_file" .ts)"
            echo "        '${key}': $(toCamelCase "$key"),"
        done
        echo "    },"
    fi

    if [ ${#action_files[@]} -gt 0 ]; then
        echo "    actions: {"
        for ts_file in "${action_files[@]}"; do
            key="$(basename "$ts_file" .ts)"
            echo "        '${key}': $(toCamelCase "$key"),"
        done
        echo "    },"
    fi

    echo "};"
} > "$index_file"

echo "Generated ${index_file}"
