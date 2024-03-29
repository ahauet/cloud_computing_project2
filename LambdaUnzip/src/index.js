// dependencies
var async = require('async');
var AWS = require('aws-sdk');
var gm = require('gm')
var util = require('util');
var JSZip = require('jszip');

// constants
var MAX_WIDTH  = 100;
var MAX_HEIGHT = 100;

// get reference to S3 client
var s3 = new AWS.S3();

exports.handler = function(event, context, callback) {
    var srcBucket = event.Records[0].s3.bucket.name;
    console.log("Ready to unzip:\n", srcBucket);

    var srcKey    =
    decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

    s3.getObject({Bucket:srcBucket, Key:srcKey},
        function(err,data) {
            if(data.ContentType != 'application/zip') {
                console.log("Need a zip file");
                context.succeed();
                return;
            }

            var zip = new JSZip(data.Body);
            async.forEach(zip.files,
                function (zippedFile) {
                    console.log("filename:" + zippedFile.name);
                }
            );
        }
    );

};
