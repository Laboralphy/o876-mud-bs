#!/bin/bash

script_folder=$(dirname "$(realpath "$0")")
store_folder=$(realpath "${script_folder}/../src/store")
getter_folder="${store_folder}/getters"
define_getters_ts="${store_folder}/define-getters.ts"

source "$script_folder/iterate-files.inc.sh"

# echo an importation directive for a specific getter
cmdImportGetterFunction() {
    local this_file="$1"
    local functionName=$(basename "$this_file" .ts)
    echo "import { $functionName } from './getters/$functionName';"
}

# echo a type definition direction for a specific getter function
cmdBuildGetterReturnType() {
    local this_file="$1"
    local functionName=$(basename "$this_file" .ts)
    echo "    $functionName: typeof $functionName;"
}

# echo an export directive for a specific getter
cmdExportGetter() {
    local this_file="$1"
    local functionName=$(basename "$this_file" .ts)
    echo "    $functionName,"
}

loopImportGetterFunctions() {
    iterateFiles ts "$getter_folder" cmdImportGetterFunction
}

loopBuildGetterReturnFunctions() {
    echo "export type GetterReturnFunctions = {"
    iterateFiles ts "$getter_folder" cmdBuildGetterReturnType
    echo "};"
    echo ""
}

loopExportGetters() {
    echo "export const Getters = {"
    iterateFiles ts "$getter_folder" cmdExportGetter
    echo "};"
}

{
    echo "import { GetterOutput } from '@laboralphy/reactor';"
    loopImportGetterFunctions
    loopBuildGetterReturnFunctions
    echo "export type GetterReturnType = GetterOutput<GetterReturnFunctions>;"
    loopExportGetters
} > $define_getters_ts
