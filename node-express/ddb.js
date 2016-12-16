// DynamoDB stuffs
var AWS = require('aws-sdk');
// AWS.config.region = "eu-west-1";
AWS.config.region = process.env.AWS_REGION;
var ddb = new AWS.DynamoDB();
// var ddbTable =  "lingi2145-table";
var ddbTable =  process.env.STARTUP_SIGNUP_TABLE;


/*
* data of type {filename: name,
*               link: link}
*/
function addEntry(data) {
  var item = {
    'link': {'S': data.link},
    'filename': {'S': data.filename}
  };
  ddb.putItem({
    'TableName': ddbTable,
    'Item': item,
    'Expected': {'link':{ 'Exists': false}}
  }, function(err, data) {
    if(err){
      console.log("DYNAMODB ERROR : "+err);
    }
  });

}

module.exports = {
  addEntry: addEntry
}
