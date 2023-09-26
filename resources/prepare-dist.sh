#!/bin/sh -e

# This script prepares an npm directory with files safe to publish to npm or the
# npm git branch:
#
#     "immutable": "git://github.com/immutable-js/immutable-js.git#npm"
#

# Create empty npm directory
rm -rf npm
mkdir -p npm

# Copy over necessary files
cp -r dist/immutable.es.js npm/immutable.js
cp -r dist/immutable.d.ts npm/
cp README.md npm/
cp LICENSE npm/

# Ensure a vanilla package.json before deploying so other tools do not interpret
# The built output as requiring any further transformation.
node -e "var package = require('./package.json'); \
  package = Object.fromEntries(Object.entries(package).filter(([key]) => package.publishKeys.includes(key))); \
  package.type = \"module\"; \
  require('fs').writeFileSync('./npm/package.json', JSON.stringify(package, null, 2));"
