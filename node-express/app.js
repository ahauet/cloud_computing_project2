var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var path = require('path');
var TinyURL = require('tinyurl');

var index = require('./routes/index');

var ddb = require('./ddb.js');

var s3 = require('./s3');
var s3Config = {
  // S3_ACCESS_KEY: AKIAJL5N6MKBEKM3BLNA
  // S3_SECRET_KEY: 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
  // S3_BUCKET: lingi2145-upload

  // accessKey : "AKIAJL5N6MKBEKM3BLNA",
  // secretKey : "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",
  // bucket : "lingi2145-upload",
  accessKey : process.env.S3_ACCESS_KEY,
  secretKey : process.env.S3_SECRET_KEY,
  bucket : process.env.S3_BUCKET,
  region : "eu-west-1"
};

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/s3_credentials', function(request, response){
  if(request.query.filename){
    var filename = request.query.id+"lingi2145"+crypto.randomBytes(16).toString('hex') + path.extname(request.query.filename);
    response.json(s3.s3Credentials(s3Config, {filename: filename, contentType:request.query.content_type, id : request.query.id}));
  } else{
    response.status(400).send('filename is required');
  }
});

app.get('/ddb_add', function(request, response){
  if(request.query.id) {
    ddb.addEntry({filename:request.query.filename, id: request.query.id, pictureId:request.query.link });
    response.json({seems:"legit"});
  } else{
    response.status(400).send("filename is required");
  }
});

app.get('/createEvent', function(request, response){
  var newEvent = crypto.randomBytes(16).toString('hex');
  ddb.addEvent({name:request.query.name, eventId:newEvent});
// Get short url
 var fullUrl = request.protocol + '://' + request.get('host') +"/event?id=";
TinyURL.shorten(fullUrl+newEvent+"&eventname="+request.query.name, function(res) {
  response.json({"url":res});
});
});

app.get('/event', function(request, response){
    console.log(request.query.id);
    console.log(request.query.eventname);
    response.render('upload', {id:request.query.id,
                              "eventName" : request.query.eventname
                            });
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname+'/public'));

app.use('/', index);

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
