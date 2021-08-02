#! /usr/bin/env bash
. .env
set -e

DOCKER_RUN_CMD="docker-compose -f docker/docker-compose.yml -f docker/docker-compose.dependencies.yml run --no-deps -T ${PROJECT}.dev"
# /app/package_project.json is the package.json in this project, copied into the container.
echo "Updating package.json..."
${DOCKER_RUN_CMD} scripts/cat-package-json.sh > package.json
echo "Updating tslint.json..."
${DOCKER_RUN_CMD} cat tslint.json > tslint.json
echo "Updating tsconfig.json..."
${DOCKER_RUN_CMD} cat tsconfig.json > tsconfig.json
