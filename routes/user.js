var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var {Model, Schema} = mongoose;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET user profile. */
router.get('/profile',function(req, res, next) {
    res.send(req.user);
});
// function reqToken(){
//   var bearerHeader = req.headers['authorization'];
//   if(typeof bearerHeader!== 'undefined'){
//       var bearer = bearerHeader.split(' ');
//       var bearerToken = bearer[1];
//       req.token = bearerToken;
//       next()
//   }
//   else
//   {
//     res.sendStatus(403);
//   }
// }

module.exports = router;