#!/usr/bin/env bash
docker run -i -t --rm \
  -v $(pwd):/app/project \
  -e AWS_ACCESS_KEY_ID \
  -e AWS_SECRET_ACCESS_KEY \
  garlictech2/workflows-library:${npm_package_config_dockerWorkflowVersion} scripts/deploy-lambdas.sh
