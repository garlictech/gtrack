#!/usr/bin/env bash
docker-compose -f docker/docker-compose.webpack.yml -f docker/docker-compose.dependencies.yml kill
