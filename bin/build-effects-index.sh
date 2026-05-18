#!/bin/bash

script_folder=$(dirname "$(realpath "$0")")
target_folder=$(realpath "${script_folder}/../src/effects/schemas")
eff_schemas_index_ts="${target_folder}/index.ts"
eff_const_ts=$(realpath "${script_folder}/../src/consts/effect-types.json")

source "$script_folder/iterate-files.inc.sh"

cmdExtractEffectConst() {
    local this_file="$1"
    local bFirst="$2"
    local base_folder="$3"
    local effect_name="$(grep -oP 'export const \K\S+' $this_file)"
    local relative="${this_file#$base_folder/}"
    local relative_nots="${relative%.ts}"
    echo "import { $effect_name } from './$relative_nots';"
}

cmdEffectDefinitionDiscUnion() {
    local effect_name="$(grep -oP 'export const \K\S+' $1)"
    echo "    $effect_name,"
}

cmdEffectPairedSchema() {
    local this_file="$1"
    local effect_name="$(grep -oP 'export const \K\S+' $this_file)"
    local consts_key="$(grep -oP "type: z\.literal\(CONSTS\.\K[^)']+" $this_file)"
    echo "const _Wrapped${effect_name} = BaseEffectSchema.extend({ type: z.literal(CONSTS.${consts_key}), data: ${effect_name} });"
}

cmdEffectWrappedDiscUnion() {
    local effect_name="$(grep -oP 'export const \K\S+' $1)"
    echo "    _Wrapped${effect_name},"
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
    echo "import z from 'zod';"
    echo "import { CONSTS } from '../../consts';"
    echo "import { BaseEffectSchema } from '../../schemas/BaseEffect';"
    iterateFilesRecursive ts "$target_folder" cmdExtractEffectConst
    echo ""
    echo "export const EffectDefinitionSchema = z.discriminatedUnion('type', ["
    iterateFilesRecursive ts "$target_folder" cmdEffectDefinitionDiscUnion
    echo "]);"
    echo ""
    echo "export type EffectDefinition = z.infer<typeof EffectDefinitionSchema>;"
    echo ""
    iterateFilesRecursive ts "$target_folder" cmdEffectPairedSchema
    echo ""
    echo "export const EffectSchema = z.discriminatedUnion('type', ["
    iterateFilesRecursive ts "$target_folder" cmdEffectWrappedDiscUnion
    echo "]);"
    echo ""
    echo "export type Effect = z.infer<typeof EffectSchema>;"
}

generateEffectTypeIndex() {
    echo "{"
    iterateFilesRecursive ts "$target_folder" cmdEffectConstIndex
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
    echo "import { EffectType } from '../../schemas/enums/EffectType';"
    echo ""
    iterateFiles ts "$program_folder" cmdEffectProgramImport
    echo ""
    echo "export const effectPrograms = new Map<EffectType, IProgram<Effect>>(["
    iterateFiles ts "$program_folder" cmdEffectProgramClassRegister
    echo "]);"
}

generateEffectTypeIndex > $eff_const_ts
generateEffectSchemaIndex > $eff_schemas_index_ts
generateEffectProgramIndex > $eff_program_index_ts
