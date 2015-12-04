'use strict';
module.exports = function(sequelize, DataTypes) {
  var List = sequelize.define('List', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    private: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        this.belongsTo(models.User);
        // associations can be defined here
      }
    }
  });
  return List;
};