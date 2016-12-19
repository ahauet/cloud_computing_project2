#! /bin/bash
aws lambda create-function \
--region eu-west-1 \
--function-name CreateLambdaZip \
--zip-file fileb:///Users/Alexandre/progs/LambdaZip/LambdaZip.zip \
--role arn:aws:iam::884247649811:role/S3All \
--handler index.handler \
--runtime nodejs4.3 \
--timeout 7 \
--memory-size 1024
