#!/bin/bash
set -e

npm run build

mv ./build/bundle/main.js ./build/bundle/app.js

cd ./build/bundle
zip -r ../bundle.zip .
