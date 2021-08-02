#!/usr/bin/env bash
set -e
. .env

echo "Cypress image pulled"
docker build -f ./Dockerfile.cypress .
echo "Cypress image built"
DOCKER_CMD_BASE='docker-compose -f docker/docker-compose.cypress.yml -f docker/docker-compose.dist.yml -f docker/docker-compose.dependencies.yml'
${DOCKER_CMD_BASE} build

${DOCKER_CMD_BASE} up \
  --abort-on-container-exit \
  --exit-code-from $PROJECT.cypress

EXIT=$?
npm run stop:dist
exit $EXIT
