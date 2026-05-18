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
    local base_folder="$3"
    local property_name="$(grep -oP 'export const \K\S+' $this_file)"
    local relative="${this_file#$base_folder/}"
    local relative_nots="${relative%.ts}"
    echo "import { $property_name } from './$relative_nots';"
}

cmdPropertyDefinitionDiscUnion() {
    local property_name="$(grep -oP 'export const \K\S+' $1)"
    echo "    $property_name,"
}

cmdPropertyPairedSchema() {
    local this_file="$1"
    local property_name="$(grep -oP 'export const \K\S+' $this_file)"
    local consts_key="$(grep -oP "type: z\.literal\(CONSTS\.\K[^)']+" $this_file)"
    echo "const _Wrapped${property_name} = BasePropertySchema.extend({ type: z.literal(CONSTS.${consts_key}), data: ${property_name} });"
}

cmdPropertyWrappedDiscUnion() {
    local property_name="$(grep -oP 'export const \K\S+' $1)"
    echo "    _Wrapped${property_name},"
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
    echo "import z from 'zod';"
    echo "import { CONSTS } from '../../consts';"
    echo "import { BasePropertySchema } from '../../schemas/BaseProperty';"
    iterateFilesRecursive ts "$target_folder" cmdExtractPropertyConst
    echo ""
    echo "export const PropertyDefinitionSchema = z.discriminatedUnion('type', ["
    iterateFilesRecursive ts "$target_folder" cmdPropertyDefinitionDiscUnion
    echo "]);"
    echo ""
    echo "export type PropertyDefinition = z.infer<typeof PropertyDefinitionSchema>;"
    echo ""
    iterateFilesRecursive ts "$target_folder" cmdPropertyPairedSchema
    echo ""
    echo "export const PropertySchema = z.discriminatedUnion('type', ["
    iterateFilesRecursive ts "$target_folder" cmdPropertyWrappedDiscUnion
    echo "]);"
    echo ""
    echo "export type Property = z.infer<typeof PropertySchema>;"
}

generatePropertyTypeIndex() {
    echo "{"
    iterateFilesRecursive ts "$target_folder" cmdPropertyConstIndex
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
    echo "import { PropertyType } from '../../schemas/enums/PropertyType';"
    echo ""
    iterateFiles ts "$program_folder" cmdProgramImport
    echo ""
    echo "export const propertyPrograms = new Map<PropertyType, IProgram<Property>>(["
    iterateFiles ts "$program_folder" cmdProgramClassRegister
    echo "]);"
}

generatePropertyTypeIndex > $prop_const_ts
generatePropertySchemaIndex > $prop_schemas_index_ts
generatePropertyProgramIndex > $prop_program_index_ts
