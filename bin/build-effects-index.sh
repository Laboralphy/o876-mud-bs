#!/bin/bash

script_folder=$(dirname "$(realpath "$0")")
target_folder=$(realpath "${script_folder}/../src/effects/schemas")
eff_schemas_index_ts="${target_folder}/index.ts"
eff_const_ts=$(realpath "${script_folder}/../src/consts/effect-types.json")

source "$script_folder/iterate-files.inc.sh"

cmdExtractEffectConst() {
    local this_file="$1"
    local bFirst="$2"
    local effect_name="$(grep -oP 'export const \K\S+' $this_file)"
    local this_basefile_nots="$(basename $this_file .ts)"
    echo "import { $effect_name } from './$this_basefile_nots';"
}

cmdEffectSchemaDiscUnion() {
    local effect_name="$(grep -oP 'export const \K\S+' $1)"
    echo "    $effect_name,"
}

cmdEffectConstIndex() {
    local this_file="$1"
    local bFirst="$2"
    local this_basefile_nots="$(basename $this_file .ts)"
    local effect_const="EFFECT_$(echo $this_basefile_nots | tr '[:lower:]' '[:upper:]' | tr '-' '_')"
    if [ $bFirst = "0" ]
    then
        echo ","
    fi
    echo -n '    "'$effect_const'": "'$effect_const'"'
}

generateEffectSchemaIndex() {
    # Import Zod
    echo "import z from 'zod';"
    # All effect import
    iterateFiles ts "$target_folder" cmdExtractEffectConst
    echo ""
    # Generating Index schema
    echo "export const EffectSchema = z.discriminatedUnion('type', ["
    # Add all effect schema in this discriminated union
    iterateFiles ts "$target_folder" cmdEffectSchemaDiscUnion
    # Closing union
    echo "]);"
    echo ""
    # Exporting EffectSchema
    echo "export type Effect = z.infer<typeof EffectSchema>;"
}

generateEffectTypeIndex() {
    echo "{"
    iterateFiles ts "$target_folder" cmdEffectConstIndex
    echo ""
    echo "}"
}

program_folder=$(realpath "${script_folder}/../src/effects/programs")
eff_program_index_ts="${program_folder}/index.ts"

cmdEffectProgramImport() {
    local this_file="$1"
    local bFirst="$2"
    local class_name="$(grep -oP 'export class \K\S+' $this_file)"
    local this_basefile_nots="$(basename $this_file .ts)"
    echo "import { $class_name } from './$this_basefile_nots';"
}

cmdEffectProgramClassRegister() {
    local this_file="$1"
    local bFirst="$2"
    local class_name="$(grep -oP 'export class \K\S+' $this_file)"
    local eff_key="EFFECT_$(echo "$class_name" | sed -E 's/^EffectProgram//; s/([A-Z])/_\1/g; s/^_//' | tr '[:lower:]' '[:upper:]')"
    echo "    [CONSTS.$eff_key, new ${class_name}()],"
}

generateEffectProgramIndex() {
    echo "import { CONSTS } from '../../consts';"
    echo "import { IProgram } from '../../interfaces/IProgram';"
    echo "import { Effect } from '../schemas';"
    echo ""
    iterateFiles ts "$program_folder" cmdEffectProgramImport
    echo ""
    echo "export const effectPrograms = new Map<string, IProgram<Effect>>(["
    iterateFiles ts "$program_folder" cmdEffectProgramClassRegister
    echo "]);"
}

generateEffectTypeIndex > $eff_const_ts
generateEffectSchemaIndex > $eff_schemas_index_ts
generateEffectProgramIndex > $eff_program_index_ts
