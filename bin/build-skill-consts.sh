#!/bin/bash

script_folder=$(dirname "$(realpath "$0")")

source "$script_folder/check-jq.inc.sh"

input="${script_folder}/../src/data/skills.json"
output="${script_folder}/../src/consts/skills.json"

jq 'keys | map({key: ., value: .}) | from_entries' "$input" > "$output"

