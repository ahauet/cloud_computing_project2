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

var s3 = require('./s3');
var s3Config = {
  accessKey : process.env.S3_ACCESS_KEY,
  secretKey : process.env.S3_SECRET_KEY,
  bucket : process.env.S3_BUCKET,
  region : process.env.AWS_REGION
};
//THIS KEY SHOULD BE RANDOMIZED ONLY ONCE AT THE BEGINNING OF THE PROD VERSION !
var security_KEY = "1234567890";

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//The server respond with the S3 credentials to allow browser to upload to S3.
app.get('/s3_credentials', function(request, response){
  if(request.query.filename){
    var filename = crypto.randomBytes(16).toString('hex') + path.extname(request.query.filename);
    response.json(s3.s3Credentials(s3Config, {filename: filename, contentType:request.query.content_type, id : request.query.id}));
  } else{
    response.status(400).send('filename is required');
  }
});


//The server respond with the TinyURL of the corresponding event.
app.get('/createEvent', function(request, response){
  var newEvent = crypto.randomBytes(16).toString('hex');
  var sec1 = s3.mac(security_KEY, newEvent);
  var sec2 = s3.mac(sec1, request.query.name);
// Get short url
 var fullUrl = request.protocol + '://' + request.get('host') +"/event?id=";
  TinyURL.shorten(fullUrl+newEvent+"&eventname="+request.query.name+"&security="+sec2.toString('hex'), function(res) {
    response.json({"url":res});
  });
});


app.get('/event', function(request, response){
    var sec1 = s3.mac(security_KEY, request.query.id);
    var sec2 = s3.mac(sec1, request.query.eventname).toString('hex');
    //We must verify that the url is valid with the security field.
    if (sec2 === request.query.security) {
        response.render('upload', {id:request.query.id,
                                  "eventName" : request.query.eventname,
                                  "cdn":process.env.CDN
                                });
    } else{
      response.status(403).send("Not authorized event");
    }
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
