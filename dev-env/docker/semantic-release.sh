#!/usr/bin/env bash
if [ "$1" == "-f" ]; then
  export CI=true
  export TRAVIS=true
  export TRAVIS_BRANCH=master
fi

docker run \
  -v $(pwd):/app/project \
  -e CI \
  -e TRAVIS \
  -e TRAVIS_BRANCH \
  -e GH_TOKEN \
  -e GH_USER \
  garlictech2/workflows-base:${npm_package_config_dockerWorkflowVersion} npm run semantic-release
