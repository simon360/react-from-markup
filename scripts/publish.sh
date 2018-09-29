#!/bin/bash

echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
./node_modules/.bin/lerna publish from-git --yes