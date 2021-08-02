#!bash

# Deleting tables:
#
# - execute this script, it will require exiting the schema files manually!
# - clear the elastic search indexes on postman (DeleteAllPlaces mutation)
# - recreate an empty elastic search index: cd packages/backend && make setup-geo-mapping
#

delete_table () {
  table_name="gtrack-$PROJECT_CONFIG-$1"
  echo "DELETING TABLE $table_name"

  aws dynamodb describe-table --table-name $table_name | jq '.Table | del(.TableId, .TableArn, .ItemCount, .TableSizeBytes, .CreationDateTime, .TableStatus, .LatestStreamArn, .LatestStreamLabel, .ProvisionedThroughput.NumberOfDecreasesToday, .ProvisionedThroughput.LastIncreaseDateTime)' > __schema.json
  aws dynamodb delete-table --table-name $table_name
  sleep 10
  aws dynamodb create-table --cli-input-json file://__schema.json
  rm -f __schema.json
}

delete_table hikes
delete_table pois
delete_table images

