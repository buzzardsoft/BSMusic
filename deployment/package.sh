#!/bin/bash

if [ $# != 1 ] ; then
    echo "Usage: package.sh filename.zip"
    exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "$0" )" && pwd )"
cd "${SCRIPT_DIR}/.."

zip "${1}" Dockerfile package.json package-lock.json dist