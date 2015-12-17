'use strict';
module.exports = function(sequelize, DataTypes) {
  var condition = sequelize.define('condition', {
    medical_id: DataTypes.STRING,
    name: DataTypes.STRING,
    prevalence: DataTypes.STRING,
    acuteness: DataTypes.STRING,
    severity: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.condition.belongsTo(models.user);
        // associations can be defined here
      }
    },

  });
  return condition;
};