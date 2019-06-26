var express = require('express');
var router = express.Router();
var LoginModel = require('../db/login');
var UserModel = require('../db/user');


router.get('/create_user', (req,res) =>{
  UserModel.create({username:"nguyena@gmail.com",password:"123123"}).then().catch(function(err){
      res.send(err)
  })
   
  
})
/* GET home page. */

var loggedin = function(req,res,next){
  
   if(req.cookies.token)
  {
    
    LoginModel.findOne({Token:req.cookies.token}).then((user)=>{
      if(!user)
      {
        res.redirect('/login1')
      }
      res.render('CV');
    })
  }
  else
  {
    res.redirect('/login1');
  }
}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/login', function(req, res, next) {
  // lay token cu ra

  // truy van lai user


  res.render('login', { title: 'Express' });
});

router.get('/login1', function(req, res, next) {
  // lay token cu ra

  // truy van lai user


  res.render('login1', { title: 'Express' });
});

// router.get('/signup', function(req, res, next) {
//   res.render('signup', { title: 'Express' });
// });

// router.get('/trangchu', loggedin, function(req, res, next) {
//   res.render('trangchu');
// });

router.get('/CV', loggedin, function(req, res, next) {
  res.render('CV');
});

router.post('/create_login',(req,res)=>{
  LoginModel.create({makh:req.body.makh,Token:req.body.token}).then(data=>{
    res.json(data);
  })
})


router.get('/logout', function(req,res){
  req.logout()
  res.send('/')
})

router.post('/user_name', (req,res)=>{
  LoginModel.findOne({Token:req.body.token}).then(data=>{
    UserModel.findOne({_id:data.makh}).then(user=>{
      res.json(user)
    })
  })
});



router.post('/sign_out',(req,res)=>{
  LoginModel.findOneAndDelete({Token:req.body.token}).then(data=>{
    res.json(data)
  })
})

module.exports = router;
