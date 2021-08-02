#!/usr/bin/env bash
echo "Starting dist server + dependencies..."

DOCKER_COMPOSE="docker-compose -f docker/docker-compose.dist.yml -f docker/docker-compose.dependencies.yml"
$DOCKER_COMPOSE build
${DOCKER_COMPOSE} up -d --remove-orphans
