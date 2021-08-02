#!/usr/bin/env bash
set -e
. .env

TESTER_IMAGE=$PROJECT.e2e-tester

DOCKER_COMPOSE_TESTER="docker-compose -f docker/docker-compose.e2e.yml"
DOCKER_COMPOSE_WEBSERVER="docker-compose -f docker/docker-compose.webpack.yml"

if [[ $DEBUG ]]; then
  DOCKER_COMPOSE="${DOCKER_COMPOSE_TESTER} -f docker/docker-compose.debug.yml"
fi

TESTER_RUN="$DOCKER_COMPOSE_TESTER run --rm "
$DOCKER_COMPOSE_TESTER build

if [ $# -eq 0 ]; then
  $TESTER_RUN --service-ports -e "WEBSERVER_URL=http://localhost:8081" $TESTER_IMAGE
  $DOCKER_COMPOSE_TESTER stop
elif [ $1 == "bash" ]; then
  $TESTER_RUN --entrypoint=/bin/bash $TESTER_IMAGE
elif [ $1 == "full" ]; then
  $DOCKER_COMPOSE_WEBSERVER up -d
  $TESTER_RUN -e "WEBSERVER_URL=http://localhost:8081" $TESTER_IMAGE
  EXIT=$?
  $DOCKER_COMPOSE_WEBSERVER down
  exit $EXIT
elif [ $1 == "prod" ]; then
  npm run start:dist
  $TESTER_RUN -e "WEBSERVER_URL=http://localhost:9081" $TESTER_IMAGE
  EXIT=$?
  npm run stop:dist
  exit $EXIT
else
  $DOCKER_COMPOSE_TESTER $@
fi
