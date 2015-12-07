'use strict';
module.exports = function(sequelize, DataTypes) {
  var link = sequelize.define('link', {
    url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    count: DataTypes.INTEGER,

  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return link;
};