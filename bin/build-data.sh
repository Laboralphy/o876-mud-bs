#!/bin/bash

script_folder=$(dirname "$(realpath "$0")")

echo "generating property schema index, and property type index."
$script_folder/build-properties-index.sh

echo "generating effect schema index, and effect type index."
$script_folder/build-effects-index.sh

echo "generating constant index."
$script_folder/build-consts-index.sh

echo "generating enum schema from constants."
$script_folder/build-enum-schemas.sh

echo "generating getter index."
$script_folder/build-getters-index.sh

echo "done."
