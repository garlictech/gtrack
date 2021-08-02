#!/usr/bin/env bash
set -e
. .env

DOCKER_COMPOSE="docker-compose -f docker/docker-compose.webpack.yml"

if [[ $DEBUG ]]; then
  DOCKER_COMPOSE="${DOCKER_COMPOSE} -f docker/docker-compose.debug.yml"
fi

export DOCKER_CMD="$@"
${DOCKER_COMPOSE} run ${PROJECT}.webpack-server $DOCKER_CMD
