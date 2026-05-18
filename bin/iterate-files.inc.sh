# Iterates thru all files of a given extension, and run a specific command
# $1 extension
# $2 folder where to iterate
# $3 command to run (this command will have file + firstflag parameters
# This command ignore index.* when iterating
iterateFiles() {
    local sExtension="$1"
    local sIteratingFolder="$2"
    local sCommand="$3"
    local bFirst=1
    local sThisFile=""
    local sThisFileBase=""
    for sThisFile in "$sIteratingFolder"/*."$sExtension"
    do
        sThisFileBase="$(basename $sThisFile)"
        if [ "$sThisFileBase" != "index.$sExtension" ]
        then
            $sCommand "$sThisFile" "$bFirst"
            bFirst=0
        fi
    done
}

# Like iterateFiles but recurses into sub-folders.
# Passes the base folder as a 3rd argument to the command so callbacks can
# compute relative paths with: ${file#$3/}
iterateFilesRecursive() {
    local sExtension="$1"
    local sIteratingFolder="$2"
    local sCommand="$3"
    local bFirst=1
    local sThisFile=""
    while IFS= read -r sThisFile; do
        $sCommand "$sThisFile" "$bFirst" "$sIteratingFolder"
        bFirst=0
    done < <(find "$sIteratingFolder" -name "*.$sExtension" -not -name "index.$sExtension" | sort)
}
