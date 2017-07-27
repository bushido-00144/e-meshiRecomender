var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET tags listing. */
router.get('/', function(req, res, next) {
  models.Tag.findAll().then(function(tags){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(tags));
  });
});

/*
 * Add tag
 */
router.post('/', function(req, res, next) {
  console.log(req.body);
  models.Tag.create({
    Tag: req.body.newTag
  }).then(function(tag){
    res.json({
      id: tag.id,
      tagname: tag.Tag
    });
  }).catch(function(err){
    console.log(err);
    res.send({Code: 500, Message: 'ERROR'});
  });
});

module.exports = router;
