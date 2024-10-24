#!/bin/bash

# Prompt the user for the version number
read -p "Enter the version number: " version

# Build the client
npm install
npm run build
cd ..

# Create a new folder with the version number
folder_name="dist-$version"
mkdir "$folder_name"

# Copy the contents of the "dist" folder to the new folder
cp -r ./frontend/dist/* "$folder_name"

# Push the new folder to the target repository
git clone https://github.com/KaifSayyad/SeeIt-build-files.git
cd SeeIt-build-files || exit
cp -r ../"$folder_name" .
git add "$folder_name"
git commit -m "Add $folder_name"
git push origin main

# Cleanup: Delete the folder from the current repository
cd ..
rm -rf "$folder_name"
rm -rf SeeIt-build-files
git add .
git commit -m "Delete $folder_name"
git push origin main

# Remove the cloned repository
rm -rf SeeIt-build-files