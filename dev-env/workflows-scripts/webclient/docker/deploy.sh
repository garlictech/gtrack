#!/usr/bin/env bash
set -e
. .env

docker run -i -t --rm \
  -v $(pwd):/app/project \
  -e FIREBASE_TOKEN="$FIREBASE_TOKEN" \
  garlictech2/workflows-firebase:${npm_package_config_dockerWorkflowVersion} scripts/firebase-deploy.sh $PROJECT_CONFIG
