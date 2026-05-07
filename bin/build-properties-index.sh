#!/bin/bash

script_folder=$(dirname "$(realpath "$0")")
target_folder=$(realpath "${script_folder}/../src/properties/schemas")
prop_schemas_index_ts="${target_folder}/index.ts"
prop_const_ts=$(realpath "${script_folder}/../src/consts/property-types.json")

source "$script_folder/iterate-files.inc.sh"

cmdExtractPropertyConst() {
    local this_file="$1"
    local bFirst="$2"
    local property_name="$(grep -oP 'export const \K\S+' $this_file)"
    local this_basefile_nots="$(basename $this_file .ts)"
    echo "import { $property_name } from './$this_basefile_nots';"
}

cmdPropertySchemaDiscUnion() {
    local property_name="$(grep -oP 'export const \K\S+' $1)"
    echo "    $property_name,"
}

cmdPropertyConstIndex() {
    local this_file="$1"
    local bFirst="$2"
    local this_basefile_nots="$(basename $this_file .ts)"
    local property_const="PROPERTY_$(echo $this_basefile_nots | tr '[:lower:]' '[:upper:]' | tr '-' '_')"
    if [ $bFirst = "0" ]
    then
        echo ","
    fi
    echo -n '    "'$property_const'": "'$property_const'"'
}

generatePropertySchemaIndex() {
    # Import Zod
    echo "import z from 'zod';"
    # All property import
    iterateFiles ts "$target_folder" cmdExtractPropertyConst
    echo ""
    # Generating Index schema
    echo "export const PropertySchema = z.discriminatedUnion('type', ["
    # Add all property schema in this discriminated union
    iterateFiles ts "$target_folder" cmdPropertySchemaDiscUnion
    # Closing union
    echo "]);"
    echo ""
    # Exporting PropertySchema
    echo "export type Property = z.infer<typeof PropertySchema>;"
}

generatePropertyTypeIndex() {
    echo "{"
    iterateFiles ts "$target_folder" cmdPropertyConstIndex
    echo ""
    echo "}"
}

generatePropertyTypeIndex > $prop_const_ts
generatePropertySchemaIndex > $prop_schemas_index_ts
