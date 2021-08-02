#!/usr/bin/env bash
set -e
. .env

export DOCKER_CMD="scripts/cat-package-json.sh"
DOCKER_RUN_CMD="docker-compose -f docker/docker-compose.webpack.yml run -T ${PROJECT}.webpack-server"
# /app/package_project.json is the package.json in this project, copied into the container.
echo "Updating package.json..."
${DOCKER_RUN_CMD} > package.json

for file in "tslint.json" "tsconfig.json" "jest.config.js" "jest.config.unittest.js" "jest.config.all.js" ".prettierrc" ".editorconfig"; do
  echo "Updating $file..."
  export DOCKER_CMD="cat $file"
  ${DOCKER_RUN_CMD} > $file
done

yarn
