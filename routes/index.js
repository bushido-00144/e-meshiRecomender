var express = require('express');
var router = express.Router();

var model = require('../models');

/* GET home page. */
router.get('/', function(req, res , next) {
  model.Tag.findAll().then(function(tags) {
    res.render('index', { tags: tags });
  }).catch(function(err) {
    console.log(err);
    res.status(500);
  })
});

module.exports = router;
