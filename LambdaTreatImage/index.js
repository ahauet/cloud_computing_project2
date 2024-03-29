//From http://docs.aws.amazon.com/lambda/latest/dg/with-s3-example-deployment-pkg.html

// dependencies
var async = require('async');
var AWS = require('aws-sdk');
var GGM = require('gm');
var util = require('util');

var gm = GGM.subClass({ imageMagick: true });
// constants
var MAX_WIDTH  = 1000;
var MAX_HEIGHT = 1000;

// get reference to S3 client
var s3 = new AWS.S3();

exports.handler = function(event, context, callback) {
    // Read options from the event.
    var srcBucket = event.Records[0].s3.bucket.name;
    // Object key may have spaces or unicode non-ASCII characters.
    var srcKey    =
    decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

    var splitted = srcKey.split("/");
    var eventID = splitted[1];
    var ind = splitted.length-1;
    var fileName = splitted[ind];

    // Infer the image type.
    var typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
        callback("Could not determine the image type.");
        return;
    }
    var imageType = typeMatch[1];
    if(imageType == "jpg"){ imageType = "jpeg";}
    if (imageType != "jpg" && imageType != "png" && imageType!="jpeg" && imageType !="JPG") {
        callback('Unsupported image type: ${imageType}');
        return;
    }

    // Download the image from S3, transform, and upload to a different S3 bucket.
    async.waterfall([
        function download(next) {
            // Download the image from S3 into a buffer.
            s3.getObject({
                    Bucket: srcBucket,
                    Key: srcKey
                },
                next);
            },
        function transform(response, next) {
            gm(response.Body).size(function(err, size) {
                // Infer the scaling factor to avoid stretching the image unnaturally.
                var scalingFactor = Math.min(
                    MAX_WIDTH / size.width,
                    MAX_HEIGHT / size.height
                );

                var width ;
                var height ;
                if(size.width < MAX_WIDTH && size.height < MAX_HEIGHT ){
                  width = size.width;
                  heith = size.height;
                }else{
                  width  = scalingFactor * size.width;
                  height = scalingFactor * size.height;
                }

                // Transform the image buffer in memory.
                this.resize(width, height)
                    .toBuffer(imageType, function(err, buffer) {
                        if (err) {
                          console.log(err);
                            next(err);
                        } else {
                            next(null, response.ContentType, buffer);
                        }
                    });
            });
        },
        function upload(contentType, data, next) {
            // Stream the transformed image to a different S3 bucket.
            s3.putObject({
                    Bucket: srcBucket,
                    Key: 'processed/'+eventID+'/'+fileName,
                    Body: data,
                    ContentType: contentType
                },
                function (err, data) {
                  s3.deleteObject({
                    Bucket: srcBucket,
                    Key: srcKey
                  }, next);
                });
            }
        ], function (err) {
            if (err) {
                console.error(
                    'Unable to resize ' + srcBucket + '/' + srcKey
                );
            } else {
                console.log(
                    'Successfully resized ' + srcBucket + '/' + srcKey
                );
            }

            callback(null, eventID+'/'+fileName);
        }
    );
};
