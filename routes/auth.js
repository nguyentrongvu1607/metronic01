var express = require('express');
var router = express.Router();
var UserModel = require('../db/user');

/* GET home page. */

module.exports = function(passport){
    var jwt  = require('jsonwebtoken');
    router.post('/login',function (req, res, next) {
        passport.authenticate('local', (err, user, info) => {
            console.log(err);
            if (err || !user) { 
                return res.status(400).json({
                    message: info ? info.message : 'Login failed',
                    user   : user
                }); 
            }
    
            req.login(user, (err) => {
                if (err) {
                    res.send(err);
                }
                // token-DocumentType:"bearer
                var token = jwt.sign(user,'secret', {expiresIn:"3600"});
                    // UserModel.findOneAndUpdate({username:user.username}, {$set:{Token:token}});
                 
                    // var bearerHeader = req.headers['authorization'];
                    // if(typeof bearerHeader!== 'undefined'){
                    //     var bearer = bearerHeader.split(' ');
                    //     var bearerToken = bearer[1];
                    //     req.token = bearerToken;
                    // }
               
                        
                return  res.json({user, token});
                
            });
        })
        (req, res);
    
    });
    // router.post('/login',passport.authenticate('local',{ 
    //     failureRedirect: '/login',
    //     successRedirect:'/profile',
    // }), function(req,res){
    //     res.send('hey')
    // });

    return router;
};
