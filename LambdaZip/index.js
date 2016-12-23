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
    var splitted = srcKey.split("/");
    var eventName = splitted[1];
    var zip = new JSZip();
    //Get reference for each available object
    s3.listObjects({Bucket:srcBucket, Prefix:'processed/'+eventName},
        function(err,data) {
            if(err) {
            } else {
                async.each(data.Contents, function(file, callback) {
                    var params = {
                        Bucket: srcBucket, // bucket name
                        Key: file.Key
                    };
                    //Get the object
                    s3.getObject(params, function(err, data) {
                        if(err) {
                            console.log("getObject" + err);
                        } else {
                            var filesplit = file.Key.split("/");
                            var name = filesplit[2];
                            //Add object to zip
                            zip.file('/'+name, data.Body);
                            callback();
                        }
                    });
                }, function(err) {
                  if(err){
                    console.error("unable to create Zip");
                    //Here we should call again the same lambda with the same event.
                  }
                  else{
                    var content = zip.generate({type: 'nodebuffer'});
                    //Finally upload the zip
                    s3.putObject({
                        Bucket: srcBucket,
                        Key: 'zip/'+eventName+'.zip',
                        Body: content
                    }, function(err, data) {
                        if (err) {
                            console.log(err);
                        // } else {
                        //     console.log(data);
                        }
                    });
                  }
                });
            }
        });
    }
