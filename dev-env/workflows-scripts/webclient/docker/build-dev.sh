#!/usr/bin/env bash
set -e
. .env

docker-compose -f docker/docker-compose.webpack.yml build $@
