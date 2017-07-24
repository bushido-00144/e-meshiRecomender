'use strict';
module.exports = function(sequelize, DataTypes) {
  var Restaurant = sequelize.define('Restaurant', {
    Name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Restaurant;
};