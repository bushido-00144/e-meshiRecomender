'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    Name: DataTypes.STRING,
    Password: DataTypes.STRING,
    Tag: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};