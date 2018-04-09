#!/bin/bash
# if [ -z $0 ];then
# fi
currentVersion=$(npm view unar version)
echo "Current Unar Version is:"$currentVersion

read -p "Releasing version, choose from [major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]" -n 1
version=$REPLY
case  $version in
    major) npm version major
    ;;
    minor) npm version minor
    ;;
    patch) npm version patch
    ;;
    premajor) npm version premajor
    ;;
    preminor) npm version preminor
    ;;
    prepatch) npm version prepatch
    ;;
    prerelease) npm version prerelease
    ;;
    from-git) npm version from-git
    ;;
    *) echo 'You need select a option from chioces'
    ;;
nextVersion=$(npm view unar version)
echo 'Unar Version has changed to:'$nextVersion

read -p "are you sure release version $majorVersion ? (y/n)"
if [ "$REPLY" == "y" || "$REPLY" == "Y"]
    then
    echo "release"
fi
