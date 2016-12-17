// DynamoDB stuffs
var AWS = require('aws-sdk');
//AWS.config.region = "eu-west-1";
AWS.config.region = process.env.AWS_REGION;
 var ddb = new AWS.DynamoDB();
// var ddbTable =  "lingi2145-table";
// var eventTable = "lingi2145-events";

var ddbTable =  process.env.DDB_TABLE;
var eventTable = process.env.DDB_EVENT;


/*
* data of type {filename: name,
*               link: link}
*/
function addEntry(data) {
  var item = {
    'eventId': {'S': data.id},
    'filename': {'S': data.filename},
    'pictureId': {'S': data.pictureId}
  };
  ddb.putItem({
    'TableName': ddbTable,
    'Item': item,
    'Expected': {'pictureId':{ 'Exists': false}}
  }, function(err, data) {
    if(err){
      console.log("DYNAMODB ERROR : "+err);
    }
  });

}

function addEvent(data){
  var item = {
    'eventName' : {'S': data.name},
    'eventId': {'S': data.eventId}
  };
  ddb.putItem({
    'TableName': eventTable,
    'Item' : item,
    'Expected' : {'eventId':{'Exists': false}}
  }, function (err, data) {
    if(err){
      console.log("Error creation event upload : "+err);
    }
  }
  );
}

function getAllEvents(appInstance){
  var params = {
    TableName: eventTable,
    ProjectionExpression: "eventId, eventName"
  };
  ddb.scan(params, function(err,data){
    if(err){
      console.log("Unable to scan the table. Error = "+err);
    } else {
      console.log("succeeded");
      console.log(data.Items);
      for (var i = 0; i < data.Items.length; i++) {
        var item = data.Items[i];
        console.log("ok event "+ item.eventId.S);
        appInstance.get('/'+item.eventId.S,function (req,res) {
          res.render('event',{name: item.name.S});
        });
      }
    }
  });

}

module.exports = {
  getAllEvents: getAllEvents,
  addEvent: addEvent,
  addEntry: addEntry
}
