/**
 * Created by bushido on 2017/07/24.
 */
var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET reviews listing. */
router.get('/', function(req, res, next) {
    models.Review.findAll().then(function(reviews){
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(reviews));
    });
});

/*
 * Add review
 */
router.post('/', function(req, res, next) {
    models.Review.create(req.body).then(function(){
        res.redirect('/');
    }).catch(function(err){
        console.log(err);
        res.send({Code: 500, Message: 'ERROR'});
    });
});

module.exports = router;
