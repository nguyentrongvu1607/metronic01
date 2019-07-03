var express = require('express');
var router = express.Router();
var LoginModel = require('../db/login');
var UserModel = require('../db/user');


// router.get('/create_user', (req,res) =>{
//   UserModel.create({username:"nguyenb@gmail.com",password:"123123"}).then(
//     res.send('ok created')
//   ).catch(function(err){
//       res.send(err)
//   })
   
  
// })
/* GET home page. */


var loggedin = function(req,res,next){
  
  if(req.cookies.token )
 {
   
   LoginModel.findOne({Token:req.cookies.token}).then((user)=>{
     if(!user)
     {
       res.redirect('/login1')
     }
    next();
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



router.get('/login1', function(req, res, next) {
  if(req.cookies.token )
  {
    
    LoginModel.findOne({Token:req.cookies.token}).then((user)=>{
      if(!user)
      {
        res.redirect('/login1')
      }
     res.redirect('/CV')
    })
  }
  else
  {
    res.render('login1');
  }

});


router.get('/CV', loggedin, function(req, res, next) {

  res.render('CV');
});

router.post('/create_login',(req,res)=>{
  LoginModel.create({makh:req.body.makh,Token:req.body.token}).then(data=>{
    res.json(data);
  })
})



// router.post('/user_name', (req,res)=>{
//   LoginModel.findOne({Token:req.body.token}).then(data=>{
//     UserModel.findOne({_id:data.makh}).then(user=>{
//       res.json(user)
//     })
//   })
// });

// router.get('/search', (req,res)=>{
//   UserModel.find({username:{$regex:'nguyen'}}).then(user=>{
//     res.render('index',{user:user});
//   })
// })


router.post('/sign_out',(req,res)=>{
  LoginModel.findOneAndDelete({Token:req.body.token}).then(data=>{
    res.json(data)
  })
})

module.exports = router;
