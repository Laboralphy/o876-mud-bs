#!/bin/bash

script_folder=$(dirname "$(realpath "$0")")

$script_folder/build-consts-index.sh
$script_folder/build-properties-index.sh
$script_folder/build-enum-schemas.sh
