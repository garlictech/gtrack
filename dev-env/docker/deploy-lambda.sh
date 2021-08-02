#!/usr/bin/env bash
set -e
. .env

DOCKER_COMPOSE="docker-compose -f docker/docker-compose.lambda.yml"

export DOCKER_CMD="/app/scripts/deploy-lambdas.sh $@"

${DOCKER_COMPOSE} run --rm ${PROJECT}.deploy-lambda $DOCKER_CMD
