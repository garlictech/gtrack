#!make
start:
	serverless offline start

deploy-geosearch:
	serverless deploy --config serverless-geosearch.yml --stage ${PROJECT_CONFIG}

deploy-graphql:
	serverless deploy --stage ${PROJECT_CONFIG}

deploy: deploy-graphql deploy-geosearch

schema-generate:
	graphql-codegen --config codegen.yml

setup-geo-mapping:
	serverless invoke --config serverless-geosearch.yml -f elasticsearchGeoMapping --stage ${PROJECT_CONFIG} -l

setup-stack:
	serverless invoke -f stack-init --stage ${PROJECT_CONFIG} -l
