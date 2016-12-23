#! /bin/bash
aws cloudformation create-stack \
--stack-name lingi2145stack \
--template-body file://Project2CF.json \
--parameters ParameterKey=BucketNameParameter,ParameterValue=lingi2145-webappbucket,ParameterKey=CNAMEPrefixParameter,ParameterValue=lingi2145-webapp \
