#!/bin/bash


script_folder=$(dirname "$(realpath "$0")")
target_folder=$(realpath "${script_folder}/../src/consts")
index_json="${target_folder}/index.json"

source "$script_folder/check-jq.inc.sh"
source "$script_folder/iterate-files.inc.sh"

cmdConcatJsonToIndex() {
    jq -s '.[0] * .[1]' "$index_json" "$1" > tmp.json && mv tmp.json "$index_json"
}

generateIndexJson() {
    echo '{}' > "$index_json"
    iterateFiles json "$target_folder" cmdConcatJsonToIndex
}

generateIndexJson
