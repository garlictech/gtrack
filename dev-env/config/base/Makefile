#!make

# This file is for inclusion from another makefile defining the environment and the COMPONENT, PROJECT_ROOT.
# See an example .env file in the gtrack project.
include ${PROJECT_ROOT}/.env
export $(shell sed 's/=.*//' ${PROJECT_ROOT}/.env)

.PHONY: build dist start unittest systemtest login bash docker-login docker-push test clean

clean:
	rm -rf ${PROJECT_ROOT}/artifacts/dist/${COMPONENT}

unittest:
	jest  -c ${COMPONENT_ROOT}/jest.config.js --passWithNoTests --testPathIgnorePatterns 'test\/integration' 

test:
	jest -c ${COMPONENT_ROOT}/jest.config.js --passWithNoTests --coverage

doc:
	${DOCKER_RUN_NODEPS} npm run typedoc

# Kill the development server but let the other services run.
kill:
	${DOCKER_COMPOSE} kill ${DEV_SERVICE_NAME}

# Kill the development server but let the other services run.
kill-all:
	${DOCKER_COMPOSE} kill

