// dependencies
var async = require('async');
var AWS = require('aws-sdk');
var util = require('util');
var JSZip = require('jszip');

// get reference to S3 client
var s3 = new AWS.S3();

exports.handler = function(event, context, callback) {
    var srcBucket = event.Records[0].s3.bucket.name;

    var srcKey    =
    decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

    s3.getObject({Bucket:srcBucket, Key:srcKey}, function(err,data) {
            if(data.ContentType != 'application/zip') {
                console.log("Need a zip file");
                context.succeed();
                return;
            }

            var zip = new JSZip(data.Body);
            async.forEach(zip.files,
                function (file) {
                  if((file.name.substr(file.name.length-4)==".png" || file.name.substr(file.name.length-4)==".jpg" || file.name.substr(file.name.length-5)==".jpeg") && !file.name.includes('._') ){
                      s3.putObject({
                          Bucket: srcBucket,
                          Key: srcKey.substr(0,srcKey.length-4)+'/'+file.name.substr(file.name.indexOf('/')+1),
                          Body: new Buffer(file.asBinary(), "binary"),
                          CacheControl: 'no-cache',
                          Expires: 0
                      }, function(err, data) {
                          if(err) {
                              context.fail(err, "unzip error");
                          }
                          s3.deleteObject({
                            Bucket: srcBucket,
                            Key: srcKey
                          }, function (err, data) {
                            if (err) {
                              console.log("Error while supressing old zip");
                            }
                          });
                      });
                  }
                }
            );
        }
    );

};
