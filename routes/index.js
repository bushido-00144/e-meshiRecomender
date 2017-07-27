var express = require('express');
var router = express.Router();

var model = require('../models');

/* GET home page. */
router.get('/', function(req, res , next) {
  Promise.all([
    model.Restaurant.findAll(),
    model.Tag.findAll(),
    model.User.findAll()
  ]).then(function(results) {
    res.render('index', { tags: results[1], restaurants: results[0], users: results[2] });
  }).catch(function(err) {
    console.log(err);
    res.status(500);
  });
});

module.exports = router;
