var localStrategy = require('passport-local').Strategy;
var User = require('./db/user');


module.exports = function(passport){
    
    // var passport    = require('passport');
    var passportJWT = require("passport-jwt");
    var JWTStrategy   = passportJWT.Strategy;
    var ExtractJWT = passportJWT.ExtractJwt;

    passport.serializeUser(function(user,done){
        done(null,user)
    });

    passport.deserializeUser(function(user,done){
        done(null,user)
    });

    passport.use( new localStrategy(function(username, password, done){
        User.findOne({username:username,password:password}, function(err,doc){
            if(err){done(err)}
            else
            {
                if(doc)
                    {
                                
                        done(null, {
                            username:doc.username,
                            password:doc.password,
                            _id:doc._id
                            
                        })
                        
                    }
                else
                    {
                        done(null, false)
                    }
                              
            }
        })
    }));
    


    var opts = {}
        
    opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = 'secret';
passport.use(new JWTStrategy(opts, function (jwt_payload, cb) {
        //find the user in db if needed
        // {id:jwt_payload.sub}
        console.log(jwt_payload)
     return User.findById(jwt_payload.data._id).then((err,user) => {

            if(err)
            {
                return cb(err, false);
            }
               
            if(user)
            {
                return cb(null, user);
            }

            else
            {
                return cb(null, false)
            }

            })
    }
));

}