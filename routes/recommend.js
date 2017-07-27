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
    recipient.Comprehensive = {};
    recipient.Taste = {};
    recipient.Service = {};
    for(let restaurant of datas.Restaurant) {
      let rest = _.filter(datas.RecipientReview, {RestaurantID: restaurant.id})[0];
      if(rest) {
        recipient.Comprehensive[restaurant.Name] = rest.Comprehensive;
        recipient.Taste[restaurant.Name] = rest.Taste;
        recipient.Service[restaurant.Name] = rest.Service;
      }
    }
    let others = {};
    others.Comprehensive = {};
    others.Taste = {};
    others.Service = {};
    for(let other of datas.Others) {
      others.Comprehensive[other.Name] = {};
      others.Taste[other.Name] = {};
      others.Service[other.Name] = {};
      for(let restaurant of datas.Restaurant) {
        let rest = _.filter(datas.OtherReview, {RestaurantID: restaurant.id})[0];
        if(rest) {
          others.Comprehensive[other.Name][restaurant.Name] = rest.Comprehensive;
          others.Taste[other.Name][restaurant.Name] = rest.Taste;
          others.Service[other.Name][restaurant.Name] = rest.Service;
        }
      }
    }
    return {
      recipient: recipient,
      others: others
    };
  }).then((datas) => {
    let recommendedItems = {};
    recommendedItems.Comprehensive = _.sortBy(CollaborativeFiltering.recommend(datas.recipient.Comprehensive, datas.others.Comprehensive), ['score']);
    recommendedItems.Taste = _.sortBy(CollaborativeFiltering.recommend(datas.recipient.Taste, datas.others.Taste), ['score']);
    recommendedItems.Service = _.sortBy(CollaborativeFiltering.recommend(datas.recipient.Service, datas.others.Service), ['score']);
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
    res.json(_.sortBy(recommendedItems, ['score']));
  }).catch((err) => {
    console.log(err);
    res.status(500);
  });
});

module.exports = router;
