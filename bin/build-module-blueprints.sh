#!/bin/bash
SCRIPT_DIR=$(dirname "$(realpath "$0")")
source "$SCRIPT_DIR/../.env"

doDownloadSheet () {
  sFileName="$1"
  sURL="$2"
  curl -s -L --max-redirs 5 "$sURL" --output "$SCRIPT_DIR/$sFileName.csv"
  if [ ! -f "$SCRIPT_DIR/$sFileName.csv" ]
  then
    echo "FILE NOT DOWNLOADED"
    echo "url: $sURL"
    echo "file: $SCRIPT_DIR/$sFileName.csv"
    exit 3
  fi
}

doTransformDataTypes () {
  MODULE="$1"
  BP_SUB="$2"
  THIS_TYPE="$3"
  URL="$4"
  if [ -n "$URL" ]
  then
    BP_PATH="$SCRIPT_DIR/../src/modules/$MODULE/blueprints/$BP_SUB/$THIS_TYPE"
    echo "downloading/building $MODULE::$THIS_TYPE"
    mkdir -p "$BP_PATH"
    rm "$BP_PATH"/*.json
    doDownloadSheet "$MODULE-$THIS_TYPE" "$URL"
    node transform-data.js "$MODULE-$THIS_TYPE.csv" "$BP_PATH"
    rm "$MODULE-$THIS_TYPE.csv"
  else
    echo "module $MODULE : has no data for $THIS_TYPE"
  fi
}

doProcessModuleData () {
  MODULE="$1"
  echo "building module $MODULE blueprints"
  cd "$SCRIPT_DIR" || exit 1
  MODULE_UPPERCASE=$(echo "$MODULE" | tr "[:lower:]" "[:upper:]")
  URL_SHEET_PREFIX="URL_SHEET_$URL_SHEET_$MODULE_UPPERCASE"
  url_var_weapon_types=${URL_SHEET_PREFIX}_WEAPON_TYPES
  url_var_armor_types=${URL_SHEET_PREFIX}_ARMOR_TYPES
  url_var_ammo_types=${URL_SHEET_PREFIX}_AMMO_TYPES
  url_var_gear_types=${URL_SHEET_PREFIX}_GEAR_TYPES
  url_var_shield_types=${URL_SHEET_PREFIX}_SHIELD_TYPES
  url_var_weapons=${URL_SHEET_PREFIX}_WEAPONS
  url_var_armors=${URL_SHEET_PREFIX}_ARMORS
  url_var_ammunitions=${URL_SHEET_PREFIX}_AMMUNITIONS
  url_var_gear=${URL_SHEET_PREFIX}_GEAR
  url_var_shields=${URL_SHEET_PREFIX}_SHIELDS
  url_var_monsters=${URL_SHEET_PREFIX}_MONSTERS
  url_var_common_props=${URL_SHEET_PREFIX}_COMMON_PROPS
  doTransformDataTypes "$MODULE" types weapon-types "${!url_var_weapon_types}"
  doTransformDataTypes "$MODULE" types armor-types "${!url_var_armor_types}"
  doTransformDataTypes "$MODULE" types ammo-types "${!url_var_ammo_types}"
  doTransformDataTypes "$MODULE" types gear-types "${!url_var_gear_types}"
  doTransformDataTypes "$MODULE" types shield-types "${!url_var_shield_types}"
  doTransformDataTypes "$MODULE" items weapons "${!url_var_weapons}"
  doTransformDataTypes "$MODULE" items armors "${!url_var_armors}"
  doTransformDataTypes "$MODULE" items ammo "${!url_var_ammunitions}"
  doTransformDataTypes "$MODULE" items gear "${!url_var_gear}"
  doTransformDataTypes "$MODULE" items shields "${!url_var_shields}"
  doTransformDataTypes "$MODULE" creatures monsters "${!url_var_monsters}"
  doTransformDataTypes "$MODULE" creatures common-props "${!url_var_common_props}"
  echo "done with data transform, returning to previous directory"
  cd - || exit 1
}

processAllModules () {
  cd "$SCRIPT_DIR/../src/modules" || exit 1
  for sModuleName in *
  do
    if [ -d "$sModuleName" ]
    then
      doProcessModuleData "$sModuleName"
    fi
  done
  cd - || exit 1
}

processAllModules
