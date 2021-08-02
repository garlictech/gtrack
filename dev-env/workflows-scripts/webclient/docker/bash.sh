#!/usr/bin/env bash
. .env

export DOCKER_CMD=bash
docker-compose -f docker/docker-compose.webpack.yml run ${PROJECT}.webpack-server /bin/bash
