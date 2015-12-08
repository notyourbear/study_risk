'use strict';
module.exports = function(sequelize, DataTypes) {
  var Radio = sequelize.define('Radio', {
    question: DataTypes.STRING,
    answer: DataTypes.STRING,
    false1: DataTypes.STRING,
    false2: DataTypes.STRING,
    false3: DataTypes.STRING,
    false4: DataTypes.STRING,
    false5: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        this.belongsTo(models.User);
        this.belongsToMany(models.List, {through: 'ListRadio'});
        // associations can be defined here
      }
    }
  });
  return Radio;
};