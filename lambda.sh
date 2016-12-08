#! /bin/bash
aws lambda create-function \
--region eu-west-1 \
--function-name CreateThumbnailExample \
--zip-file fileb:///Users/alexm/git/cloud_computing_project2/index.zip \
--role arn:aws:iam::828843326560:role/Lambda-role \
--handler index.handler \
--runtime nodejs4.3 \
--timeout 7 \
--memory-size 1024

#--profile adminuser \
