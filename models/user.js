// 'use strict';
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  username: String,
  password: String
});

module.exports = mongoose.model("User", UserSchema);
// var bcrypt = require('bcrypt');

// module.exports = function(sequelize, DataTypes) {
//   var user = sequelize.define('user', {
//         email: {
//       type: DataTypes.STRING,
//       validate: {
//         isEmail:true
//       }
//     },
//     password: {
//       type: DataTypes.STRING,
//       validate: {
//         len:[5,99],
//         notEmpty: true
//       }
//     },
//     firstName: DataTypes.STRING,
//     lastName: DataTypes.STRING
//   }, {
//     classMethods: { //whatever you put here, you can call it later
//       associate: function(models) {
//         // associations can be defined here
//       },
//       authenticate: function(email,password,callback){
//         this.find({where:{email:email}}).then(function(user){
//           if(user){
//             bcrypt.compare(password,user.password,function(err,result){
//               if(err){
//                 callback(err);
//               }else{
//                 callback(null, result ? user : false);
//               }
//             });
//           }else{
//             callback(null, false);
//           }
//         }).catch(callback);
//       }
//     },
//     hooks: {
//       beforeCreate: function(user, options, callback) {
//         if (user.password) {
//           bcrypt.hash(user.password, 10, function(err, hash) {
//             if (err) {
//               return callback(err);
//             } else {
//             user.password = hash;
//             callback(null, user);
//             }
//           });
//         } else {
//           //TODO error reporting
//           callback(null, user);
//         }
//       }
//     }
//   });
//   return user;
// };