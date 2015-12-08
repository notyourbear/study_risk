var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);
var minPassLength = 4;

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: [6, 30],
      }
    },
    passwordDigest: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    }
  },
  {
    instanceMethods: {
      checkPassword: function(password){
        return bcrypt.compareSync(password, this.passwordDigest);
      }
    },
    classMethods: {
        encryptPassword: function(password){
          var hash = bcrypt.hashSync(password, salt);
          return hash;
        },
        createSecure: function(email, password){
          if(password.length < minPassLength) {
            throw new Error("The Password is too short. It needs to be at least " + minPassLength + " characters long.");
          }
          return this.create({
            email: email,
            passwordDigest: this.encryptPassword(password)
          });
        },
        authenticate: function(email, password){
          //find user in DB
          return this.find({
            where: {
              email: email
            }
          }).then(function(user){
            if(user === null){
              throw new Error('User does not exist.');
            } else if (user.checkPassword(password)){
              return user;
            }
          });
        },
        associate: function(models) {
          // associations can be defined here
          this.hasMany(models.List);
          this.hasMany(models.Radio);
      }
    }
  });
  return User;
};