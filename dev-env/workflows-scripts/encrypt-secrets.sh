#! /usr/bin/env bash
. .env
tar -zcvf secrets.tgz secrets/
travis encrypt-file secrets.tgz -r garlictech/gtrack
