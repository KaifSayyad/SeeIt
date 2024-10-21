#!/bin/bash

# Prompt the user for the version number
read -p "Enter the version number of frontend you want: " version

# Clone the repository
git clone https://github.com/KaifSayyad/SeeIt-build-files.git

# Move into the cloned repository
cd SeeIt-build-files

# Checkout the specific version
git checkout "dist-$version"

# Move the dist folder to the desired location using relative paths
mv "dist-$version" ./../nginx

# Cleanup - remove the cloned repository
cd ..
rm -rf SeeIt-build-files

echo "dist-$version folder has been pulled and moved to ./nginx"
