#!/usr/bin/env bash
set -e
. .env

TESTER_IMAGE=$PROJECT.e2e-universal-tester

DOCKER_COMPOSE_TESTER="docker-compose -f docker/docker-compose.e2e-universal.yml"
DOCKER_COMPOSE_WEBSERVER="docker-compose -f docker/docker-compose.universal.yml -f docker/docker-compose.dependencies.yml"

TESTER_RUN="$DOCKER_COMPOSE_TESTER run --rm "
$DOCKER_COMPOSE_TESTER build

if [ $# -eq 0 ]; then
  npm run start:universal detached
  $TESTER_RUN -e "WEBSERVER_URL=http://localhost:4000" $TESTER_IMAGE
  EXIT=$?
  npm run stop:universal
  exit $EXIT
elif [ $1 == "bash" ]; then
  $TESTER_RUN --entrypoint=/bin/bash $TESTER_IMAGE
else
  $DOCKER_COMPOSE_TESTER $@
fi
