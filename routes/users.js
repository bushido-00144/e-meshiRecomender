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
    let params = req.body;
    let username = params.Username;
    delete params.Username;
    let tags = [];
    for(let tag in params) {
        if(tag) {
            tags.push(tag)
        }
    }
    models.User.create({
        Name: username,
        Tag: JSON.stringify(tags)
    }).then(function(){
      res.redirect('/');
    }).catch(function(err){
      console.log(err);
      res.send({Code: 500, Message: 'ERROR'});
    });
});

module.exports = router;
