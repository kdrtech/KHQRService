#!/bin/bash

# Check if the .env file exists and load environment variables
# Check if the dist directory and file exist
if [ ! -f dist/APIKhqrSDK.min.js ]; then
  echo "Error: dist/APIKhqrSDK.min.js not found!"
  exit 1
fi
# Debug: Show the content of dist/APIKhqrSDK.min.js before replacing

# Define the old and new URLs for apiUrl and api
#API_URL="" # The base API URL (e.g., "https://api-bakong.nbc.gov.kh")
API_ENDPOINT="https://khqrapi.morecambodia.com/khqr/"  # The endpoint URL (e.g., "http://localhost:3050/khqr/")

terser apikhqr.js --output dist/APIKhqrSDK.min.js --compress --mangle

echo "APIKhqrSDK.min.js has been terser."

# Replace the apiUrl and api in the JavaScript file using sed
#sed -i '' "s|\"apiUrl\": \"[^\"]*\"|\"apiUrl\": \"$API_URL\"|g" dist/APIKhqrSDK.min.js
# Replace the "api" URL in the JavaScript file using sed
# Replace the "api" URL in the JavaScript file using sed
sed -i '' "s|\"api\": \"[^\"]*\"|\"api\": \"$API_ENDPOINT\"|g" dist/APIKhqrSDK.min.js
sed -i '' 's|http://localhost:3050/khqr/|https://khqrapi.morecambodia.com/khqr/|g' dist/APIKhqrSDK.min.js

# Debug: Show the content of dist/APIKhqrSDK.min.js after replacement




# Obfuscate the JavaScript file
javascript-obfuscator dist/APIKhqrSDK.min.js --output prod/APIKhqrSDK.js --compact true --control-flow-flattening true

echo "APIKhqrSDK.js has been modified and obfuscated."
