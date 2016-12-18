var crypto = require('crypto');

function s3Credentials(config,params) {
  return {
    endpoint_url: "https://"+config.bucket+".s3.amazonaws.com",
    params: s3Params(config,params)
  }
}

function s3Params(config, params){
  var credentials = amzCredential(config);
  var policy = s3UploadPolicy(config,params,credentials);
  var policyBase64 = new Buffer(JSON.stringify(policy)).toString('base64');
  return{
    key: params.filename,
    acl: 'public-read',
    success_action_status: '201',
    policy: policyBase64,
    "content-type":params.contentType,
    'x-amz-algorithm': 'AWS4-HMAC-SHA256',
    'x-amz-credential': credentials,
    'x-amz-date': dateString() + 'T000000Z',
    'x-amz-signature': s3UploadSignature(config, policyBase64, credentials)
  }
}

function dateString() {
  var date = new Date().toISOString();
  return date.substr(0,4)+date.substr(5,2)+date.substr(8,2);;
}

function amzCredential(config) {
  return [config.accessKey, dateString(), config.region, 's3/aws4_request'].join('/');
}

function s3UploadPolicy(config, params, credentials) {
  return {
    expiration: new Date((new Date).getTime() + (5*60*1000)).toISOString(),
    conditions:[
      { bucket : config.bucket},
      {key : params.filename},
      {acl : 'public-read'},
      { success_action_status: "201"},
      ['starts-with', '$Content-Type', ''],
      ['content-length-range', 0, 10000000],
      { 'x-amz-algorithm': 'AWS4-HMAC-SHA256'},
      { 'x-amz-credential': credentials},
      {'x-amz-date': dateString() + 'T000000Z'}
    ]
  };
}

function hmac(key, string) {
  var hmac = require('crypto').createHmac('sha256', key);
  hmac.end(string);
  return hmac.read();
}

function s3UploadSignature(config, policyBase64, credentials) {
  var dateKey = hmac('AWS4'+config.secretKey, dateString());
  var dateRegionKey = hmac(dateKey, config.region);
  var dateRegionServiceKey = hmac(dateRegionKey, 's3');
  var signingKey = hmac(dateRegionServiceKey, 'aws4_request');
  return hmac(signingKey, policyBase64).toString('hex');
}

module.exports = {
  mac: hmac,
  s3Credentials: s3Credentials
}
