// dependencies
var async = require('async');
var AWS = require('aws-sdk');
var gm = require('gm')
var util = require('util');
var fs = require("fs");
var JSZip = require('jszip');

// get reference to S3 client
var s3 = new AWS.S3();

exports.handler = function(event, context, callback) {
    var srcBucket = event.Records[0].s3.bucket.name;
    console.log("Ready to unzip:\n", srcBucket);

    var srcKey    =
    decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

    var zip = new JSZip();

    zip
    .generateNodeStream({type:'nodebuffer',streamFiles:true})
    .pipe(fs.createWriteStream('out.zip'))
    .on('finish', function () {
            console.log("out.zip written.");
            resolve();
    });

    s3.listObjects({Bucket:srcBucket},
        function(err,data) {
            if(err) {
                console.log(err);
            }
            var index;
            for (index = 0; index < data.length; ++index) {
                zip.file(data[index].key);
            }
        }, function(err) {
            s3.putObject({
                Bucket: srcBucket,
                Key: 'archive.zip',
                Body: content
            }, function(err, data) {
                if(err) {
                    context.fail(err, "upload zip");
                }
            });
        }
    );



}
