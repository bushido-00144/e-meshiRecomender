/**
 * Created by bushido on 2017/07/24.
 */
var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET restaurants listing. */
router.get('/', function(req, res, next) {
  models.Restaurant.findAll().then(function(restaurants){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(restaurants));
  });
});

/*
 * Add restaurant
 */
router.post('/', function(req, res, next) {
  console.log(req.body);
  let params = req.body;
  console.log(params);
  let resname = params.Name;
  delete params.Name;
  let tags = [];
  for(let tag in params) {
    if(tag) {
      tags.push(tag)
    }
  }
  models.Restaurant.create({
    Name: resname,
    Tag: JSON.stringify(tags)
  }).then(function(){
    res.redirect('/');
  }).catch(function(err){
    console.log(err);
    res.send({Code: 500, Message: 'ERROR'});
  });
});

module.exports = router;
