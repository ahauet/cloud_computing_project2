var express = require('express');
var router = express.Router();

router.post('/upload?', function(req, res, next) {
  console.log("upload");
  res.render('index', { title: 'Express' });
});

module.exports = router;
