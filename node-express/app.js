var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var hike = require('./routes/hike');
// DynamoDB stuffs
var AWS = require('aws-sdk');
AWS.config.region = process.env.REGION
var ddb = new AWS.DynamoDB();
var ddbTable =  process.env.STARTUP_SIGNUP_TABLE;


var app = express();
app.get('/hikes', hike.index);
app.post('/add_hike', hike.add_hike);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.get('/fail', function(req,res){

  var item={
    'email':{'S':"Hardcoded mail"},
    'name':{'S':"Hardcoded name"}
  };

  ddb.putItem({
    'TableName': ddbTable,
    'Item': item,
    'Expected': {email:{ Exists: false}}
  }, function(err,data){
      if(err){
        var returnStatus = 500;
        if(err.code === 'ConditionalCheckFailedException'){
          returnStatus = 409;
        }

        res.status(returnStatus).end();
        console.log("DynamoDB ERROR : "+err);
      }
      else {
        console.log("seems legit");
      }
  });
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
