var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
    models.User.findAll().then(function(users){
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(users));
    });
});

/*
 * Add user
 */
router.post('/', function(req, res, next) {
    console.log(req.body);
    models.User.create(req.body).then(function(){
      res.send({Code: 200, Message: 'OK'});
    }).catch(function(err){
      console.log(err);
      res.send({Code: 500, Message: 'ERROR'});
    });
});

module.exports = router;
