#!/usr/bin/env bash

echo "Starting universal server + dependencies..."

DOCKER_COMPOSE="docker-compose -f docker/docker-compose.universal.yml -f docker/docker-compose.dependencies.yml"
$DOCKER_COMPOSE build

if [ $# -eq 0 ]; then
  ${DOCKER_COMPOSE} up --remove-orphans
elif [ $1 == "detached" ]; then
  echo "Detached"
  ${DOCKER_COMPOSE} up -d --remove-orphans
fi
