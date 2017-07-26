/**
 * Created by bushido on 2017/07/24.
 */
'use strict';
let _ = require('lodash');
let express = require('express');
let router = express.Router();
let models = require('../models');
let CollaborativeFiltering = require('../lib/collaborativefiltering');
let ContentBaseFiltering = require('../lib/contentbasefiltering');

router.get('/collaborative', (req, res, next) => {
  let userID = req.query.userid;
  if(!userID) res.status(400);

  Promise.all([
    models.User.findOne({where: {id: userID}}),
    models.User.findAll({where: {id: {not: userID}}}),
    models.Review.findAll({where: {Reviewer: userID}}),
    models.Review.findAll({where: {Reviewer: {not: userID}}}),
    models.Restaurant.findAll()
  ]).then((results) => {
    return {
      Recipient: results[0],
      Others: results[1],
      RecipientReview: results[2],
      OtherReview: results[3],
      Restaurant: results[4]
    };
  }).then((datas) => {
    let recipient = {};
    for(let restaurant of datas.Restaurant) {
      let rest = _.filter(datas.RecipientReview, {RestaurantID: restaurant.id})[0];
      if(rest) {
        recipient[restaurant.Name] = rest.Comprehensive;
      }
    }
    let others = {};
    for(let other of datas.Others) {
      others[other.Name] = {};
      for(let restaurant of datas.Restaurant) {
        let rest = _.filter(datas.OtherReview, {RestaurantID: restaurant.id})[0];
        if(rest) {
          others[other.Name][restaurant.Name] = rest.Comprehensive;
        }
      }
    }
    return {
      recipient: recipient,
      others: others
    };
  }).then((datas) => {
    let recommendedItems = CollaborativeFiltering.recommend(datas.recipient, datas.others);
    res.json(recommendedItems);
  }).catch((err) => {
    console.log(err);
    res.status(500);
  });
});

router.get('/content', (req, res, next) => {
  let userID = req.query.userid;
  if(!userID) res.status(400);

  Promise.all([
    models.User.findOne({where: {id: userID}}),
    models.Restaurant.findAll()
  ]).then((results) => {
    return {
      Recipient: results[0],
      Restaurant: results[1]
    };
  }).then((datas) => {
    let recommendedItems = ContentBaseFiltering.recommend(datas.Recipient, datas.Restaurant);
    res.json(recommendedItems);
  }).catch((err) => {
    console.log(err);
    res.status(500);
  });
});

module.exports = router;
