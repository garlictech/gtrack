#!/usr/bin/env bash
set -e
. .env

docker-compose -f docker/docker-compose.webpack.yml -f docker/docker-compose.dependencies.yml pull $@
docker-compose -f docker/docker-compose.webpack.yml -f docker/docker-compose.dependencies.yml build --no-cache $@
