#! /bin/bash
aws lambda create-function \
--region eu-west-1 \
--function-name CreateLambdaUnzip \
--zip-file fileb:///Users/Alexandre/progs/LambdaUnzip/CreateLambdaUnzip.zip \
--role arn:aws:iam::884247649811:role/lambda-s3-execution-role \
--handler index.handler \
--runtime nodejs4.3 \
--timeout 7 \
--memory-size 1024
