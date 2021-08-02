#!make
include .env
export $(shell sed 's/=.*//' .env)

DOCKER_COMPOSE_PROD = docker-compose -f docker/docker-compose.dist.yml
GENERATED_FONT_CSS_DIR=libs/angular/gtrack/src/lib/styles/fonts/generated
GENERATED_FONT_SITE_DIR=/assets/fonts/generated
GENERATED_FONT_DIR=libs/angular/gtrack/src/lib${GENERATED_FONT_SITE_DIR}
DEV_ENV_DIR=dev-env
LINT=eslint "**/*.{ts,json}" --ignore-path .eslintignore

prettier:
	prettier --config .prettierrc --ignore-path .prettierignore --write "./**/*{.ts,.js,.json,.css,.scss,.html,.pug}"

lint:
	${LINT}

lint-fix:
	${LINT} --fix

build-prod:
	lerna run build:prod --stream

build-prod-debug:
	lerna run build:prod:debug --stream

build-container:
	lerna run build:container --stream

start-dist:
	${DOCKER_COMPOSE_PROD} build
	${DOCKER_COMPOSE_PROD} up -d --remove-orphans

stop-dist:
	${DOCKER_COMPOSE_PROD} kill

deploy:
	lerna run deploy --stream

unittest:
	lerna run unittest --stream

test:
	lerna run test --stream

install-peers:
	yarn add -W --peer @cypress/webpack-preprocessor @testing-library/cypress cucumber cypress cypress-cucumber-preprocessor cypress-pipe test-data-bot

cypress-run-ci:
	docker-compose -f docker/docker-compose.dist.yml build
	docker-compose -f docker/docker-compose.dist.yml up -d
	yarn lerna run cypress:run:ci --scope website --scope admin

build-all: build-container build-prod
	yarn workspace app run build:android build:ios

deploy-all: deploy
	yarn workspace app run deploy:android deploy:ios

do-all: build-all test-all deploy-all

postinstall:
	node ./decorate-angular-cli.js
	yarn ngcc --properties es2015 browser module main --first-only --create-ivy-entry-points
	mkdir -p ${GENERATED_FONT_CSS_DIR} ${GENERATED_FONT_DIR} 
	yarn goog-webfont-dl -o ${GENERATED_FONT_CSS_DIR}/font-varelaround.css -p ${GENERATED_FONT_SITE_DIR}/VarelaRound -d ${GENERATED_FONT_DIR}/VarelaRound -a "Varela Round"

stop-dev:
	${DEV-ENV_DIR}/docker/stop-dev.sh

stop-universal:
	${DEV-ENV_DIR}/docker/stop-universal.sh

fix-bit-imports:
	git ls-files "*.ts" | xargs sed -i '' "s!'packages/lib/\([^/]*\)/\([^/]*\)/\([^/]*\)!'@bit/garlictech.\1.\2.\3!g"

prepare-svg-icons:
	git ls-files "packages/lib/universal/shared/map-symbols/**/*.svg" | xargs sed -i '' 's,height="..",,g'
	git ls-files "packages/lib/universal/shared/map-symbols/**/*.svg" | xargs sed -i '' 's,width="..",,g'
	git ls-files "packages/lib/universal/shared/map-symbols/**/*.svg" | xargs sed -i '' 's,height="....",,g'
	git ls-files "packages/lib/universal/shared/map-symbols/**/*.svg" | xargs sed -i '' 's,width="....",,g'
	git ls-files "packages/lib/universal/shared/map-symbols/**/*.svg" | xargs sed -i '' 's,fill:#......,fill:var(--icon-color),g'
	git grep -L viewBox -- "packages/lib/universal/shared/map-symbols/**/*.svg" | xargs sed -i '' 's:<svg:<svg viewBox="0 0 14 14":g'
	#git ls-files "packages/lib/universal/shared/map-symbols/**/*.svg" | xargs sed -i '' 's,fill="#......",,g'
