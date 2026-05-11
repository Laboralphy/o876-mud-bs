#!/bin/bash

script_folder=$(dirname "$(realpath "$0")")
target_folder=$(realpath "${script_folder}/../src/properties/schemas")
program_folder=$(realpath "${script_folder}/../src/properties/programs")
prop_schemas_index_ts="${target_folder}/index.ts"
prop_program_index_ts="${program_folder}/index.ts"
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

cmdProgramImport() {
    local this_file="$1"
    local bFirst="$2"
    local class_name="$(grep -oP 'export class \K\S+' $this_file)"
    local this_basefile_nots="$(basename $this_file .ts)"
    echo "import { $class_name } from './$this_basefile_nots';"
}

cmdProgramClassRegister() {
    local this_file="$1"
    local bFirst="$2"
    local class_name="$(grep -oP 'export class \K\S+' $this_file)"
    local this_basefile_nots="$(basename $this_file .ts)"
    local prop_key="PROPERTY_$(echo "$class_name" | sed -E 's/^PropertyProgram//; s/([A-Z])/_\1/g; s/^_//' | tr '[:lower:]' '[:upper:]')"
    echo "    [CONSTS.$prop_key, new ${class_name}()],"
}

generatePropertyProgramIndex() {
    echo "import { CONSTS } from '../../consts';"
    echo "import { IProgram } from '../../interfaces/IProgram';"
    echo "import { Property } from '../schemas';"
    echo ""
    iterateFiles ts "$program_folder" cmdProgramImport
    echo ""
    echo "export const propertyPrograms = new Map<string, IProgram<Property>>(["
    iterateFiles ts "$program_folder" cmdProgramClassRegister
    echo "]);"
}

generatePropertyTypeIndex > $prop_const_ts
generatePropertySchemaIndex > $prop_schemas_index_ts
generatePropertyProgramIndex > $prop_program_index_ts
