#!/bin/bash

# Simple testing script, that generates all kinds of projects and checks that
# generated projects build and pass tests.

set -e

CWD=$(pwd)
SCRIPT_FOLDER=$(dirname "${BASH_SOURCE[0]}")
TEST_FOLDER=$CWD/sample-app
CACHE_FOLDER=$CWD/cache
OUT_FOLDER=$CWD/dist
TEST_APP_NAME="Sample App"

if [ -n "$1" ]; then
    TEST_CASES=$SCRIPT_FOLDER/tests/$1.json
elif [ -n "$TEST_ADDON" ]; then
    TEST_CASES=$SCRIPT_FOLDER/tests/addon/*.json
else
    TEST_CASES=$SCRIPT_FOLDER/tests/app/**/*.json
fi

function cleanup() {
    cd $CWD
    rm -rf $TEST_FOLDER
    rm -rf $CACHE_FOLDER
}

# Cleanup test folder in case of error
trap cleanup ERR

mkdir -p $CACHE_FOLDER

for file in $TEST_CASES
do

    mkdir -p $TEST_FOLDER
    cd $TEST_FOLDER

    if [ -d $CACHE_FOLDER/node_modules ]; then
        mv $CACHE_FOLDER/node_modules .
    fi

    echo
    echo -------------------------------------------------------------------------------
    echo Testing generator with $file
    echo -------------------------------------------------------------------------------
    echo

    if [ -n "$TEST_ADDON" ]; then

        # generators/addon test
        ngx new --addon --no-analytics --automate "$CWD/$file" "$TEST_APP_NAME" --no-insights
        npm run test

    else

        # generators/app test
        ngx new --no-analytics --automate "$CWD/$file" "$TEST_APP_NAME" --no-insights
        npm run test:ci

        # force specific puppeteer/webdriver version to match up
        if [ "$NGX_PACKAGE_MANAGER" == "yarn" ]; then
            yarn add npm i puppeteer@2.0.0
            yarn run webdriver-manager update --versions.chrome 79.0.3945.36 --gecko=false
        else
            npm i puppeteer@2.0.0
            npx webdriver-manager update --versions.chrome 79.0.3945.36 --gecko=false
        fi

        # force usage of local chrome binary, in headless mode
        PROTRACTOR_CHROME_BIN=$(node -p "require('puppeteer').executablePath()") \
        PROTRACTOR_CHROME_ARGS='["lang=en-US","--headless","--disable-gpu","--window-size=1024,768"]' \
        npm run e2e --if-present -- --webdriver-update=false

        npm run build -- --no-progress

        if [ -n "$TEST_ANDROID" ]; then

            # fix for Android SDK31 being corrupted
            ln "$ANDROID_HOME/sdk/build-tools/31.0.0/d8" "$ANDROID_HOME/sdk/build-tools/31.0.0/dx"
            ln "$ANDROID_HOME/sdk/build-tools/31.0.0/lib/d8.jar" "$ANDROID_HOME/sdk/build-tools/31.0.0/lib/dx.jar"

            # cordova/android build
            npm run cordova:prepare -- --fast --no-progress
            npm run cordova:build android -- --fast --no-progress

            # copy apk
            mkdir -p $OUT_FOLDER
            APK_FILE=$(echo $1 | sed -e 's/[^A-Za-z0-9._-]/-/g')
            cp dist/*.apk $OUT_FOLDER/$APK_FILE.apk

        fi

    fi

    if [ -z "$1" ]; then
        mv node_modules $CACHE_FOLDER
    fi

    cd $CWD
    rm -rf $TEST_FOLDER

done
