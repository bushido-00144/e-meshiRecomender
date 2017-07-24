'use strict';
module.exports = function(sequelize, DataTypes) {
  var Review = sequelize.define('Review', {
    RestaurantID: DataTypes.INTEGER,
    Reviewer: DataTypes.INTEGER,
    Comprehensive: DataTypes.INTEGER,
    Taste: DataTypes.INTEGER,
    Service: DataTypes.INTEGER,
    Text: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Review;
};