#!/bin/bash
# if [ -z $0 ];then
# fi

currentVersion=$(node scripts/current-unar-version.js -major)
echo $currentVersion
# read -p "release major version ? (y/n)" -n 1
# majorVersion=$REPLY
# read -p "are you sure release version $majorVersion ? (y/n)"
# if [ "$REPLY" == "y" || "$REPLY" == "Y"]
#     then
#     echo "release"
# fi
