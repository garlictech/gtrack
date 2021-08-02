#!make

# This file is for inclusion from another makefile defining the environment and the COMPONENT, PROJECT_ROOT.
# See an example .env file in the gtrack project.
include ${PROJECT_ROOT}/dev-env/config/base/Makefile

DOCKER_IMAGE=${DOCKER_REGISTRY}/${PROJECT}-${DOCKER_IMAGE_SCOPE}
SYSTEMTEST_DOCKER_IMAGE=${DOCKER_SYSTEMTEST_REGISTRY}/${PROJECT}.systemtest
DEV_SERVICE_NAME=${PROJECT}.dev
DOCKER_COMPOSE_BASE = docker-compose -f ${PROJECT_ROOT}/docker/docker-compose.dependencies.yml
DOCKER_COMPOSE_BASE = docker-compose -f ${PROJECT_ROOT}/docker/docker-compose.dependencies.yml
SYSTEMTEST_SERVICE_NAME=${PROJECT}.systemtest.runner
DOCKER_COMPOSE = ${DOCKER_COMPOSE_BASE}
DOCKER_RUN = ${DOCKER_COMPOSE} run --service-ports --rm ${DEV_SERVICE_NAME}
DOCKER_RUN_NODEPS = ${DOCKER_COMPOSE} run --no-deps --rm ${DEV_SERVICE_NAME}
DOCKER_COMPOSE_PROD = docker-compose -f docker/docker-compose.prod.yml
DOCKER_COMPOSE_SYSTEMTEST = docker-compose -f docker/docker-compose.systemtest.base.yml -f docker/docker-compose.systemtest.${DOCKER_IMAGE_SCOPE}.yml
DOCKER_RUN_SYSTEMTEST = ${DOCKER_COMPOSE_SYSTEMTEST} run --service-ports --rm ${SYSTEMTEST_SERVICE_NAME}
DOCKER_COMPOSE_SERVER = ${DOCKER_COMPOSE} -f docker/docker-compose.server.yml
LOCAL_API_SERVER_DIST_BASE=artifacts/dist/src/lambda
WEBSERVER_PORT ?= 8081
NG_SERVE = ng serve --watch --source-map --host 0.0.0.0 --port ${WEBSERVER_PORT} --project "${COMPONENT}" --progress

CYPRESS_DOCKER_COMPOSE = export PROJECT_ROOT=${PROJECT_ROOT} && \
 docker-compose -f ${PROJECT_ROOT}/docker/docker-compose.cypress.yml

WEB_DIST_DOCKER_COMPOSE = export PROJECT_ROOT=${PROJECT_ROOT} && \
 docker-compose -f ${PROJECT_ROOT}/docker/docker-compose.dist.yml

.PHONY: build dist start unittest systemtest login bash docker-login docker-push test

start:
	${NG_SERVE}

start-dist:
	${WEB_DIST_DOCKER_COMPOSE} build
	${WEB_DIST_DOCKER_COMPOSE} up ${PROJECT}.${COMPONENT}-prod

start-poll:
	${NG_SERVE} --poll

start-aot:
	${NG_SERVE} --aot

start-universal-debug:
	node ${PROJECT_ROOT}/artifacts/dist/server.js

start-with-deps:
	${DOCKER_COMPOSE} up --remove-orphans -d
	${NG_SERVE}

# Stop the development server and the defined services.
stop:
	${DOCKER_COMPOSE} kill

build-prod: clean
	export NODE_OPTIONS="--max_old_space_size=8192" && ng build --configuration=${PROJECT_CONFIG} ${COMPONENT}

build-prod-debug: clean
	export NODE_OPTIONS="--max_old_space_size=8192" && ng build --configuration=default ${COMPONENT}

build-stats:
	ng build --stats-json --configuration=${PROJECT_CONFIG} ${COMPONENT}

analyze-bundle:
	webpack-bundle-analyzer ${PROJECT_ROOT}/artifacts/dist/${COMPONENT}/browser/stats.json

deploy:
	docker run --rm \
    -v ${PROJECT_ROOT}:/app/project \
    -e FIREBASE_TOKEN="${FIREBASE_TOKEN}" \
    -e PROJECT_CONFIG="${PROJECT_CONFIG}" \
    garlictech2/workflows-firebase scripts/firebase-deploy.sh ${FIREBASE-PROJECT} ${COMPONENT}

cypress-open:
	unset NODE_OPTIONS && cypress open -P ${COMPONENT_ROOT}

cypress-run-ci:
	${CYPRESS_DOCKER_COMPOSE} build
	${CYPRESS_DOCKER_COMPOSE} up --abort-on-container-exit --exit-code-from ${PROJECT}.${COMPONENT}.cypress ${PROJECT}.${COMPONENT}.cypress ${PROJECT}.${COMPONENT}-prod

cypress-run-l:
	unset NODE_OPTIONS && cypress run -P ${COMPONENT_ROOT}

cypress-run-dist:
	export CYPRESS_baseUrl=http://localhost:${DIST_PORT} && cypress run -P ${COMPONENT_ROOT}
