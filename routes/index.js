var express = require('express');
var router = express.Router();
var LoginModel = require('../db/login');
var UserModel = require('../db/user');
var ConverModel = require('../db/conversation');
var Conver_ContentModel = require('../db/conversation_content');
var moment = require('moment');


// router.get('/create_conver', (req,res)=>{
//     ConverModel.create({user1:"a",user2:"b"}).then(data=>{res.json(data)})
// })

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var loggedin = function(req, res, next) {

    if (req.cookies.token) {

        LoginModel.findOne({ Token: req.cookies.token }).then((user) => {
            if (!user) {
                res.redirect('/login1')
            }
            next();
        })
    } else {
        res.redirect('/login1');
    }
}



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



router.get('/profile', loggedin, function(req, res, next) {
    UserModel.find({}).then(data => {
        res.render('profile', { data: data });
    });
});

router.post('/profile', function(req, res) {
    LoginModel.findOne({ Token: req.body.token }).then(data => {
        res.json(data);
    })
});



router.post('/edit_user', (req, res) => {
    UserModel.findOneAndUpdate({ _id: req.body._id }, {
        $set: {
            Ho: req.body.Ho,
            TenKH: req.body.TenKH,
            Tuoi: req.body.Tuoi,
            TenCongTy: req.body.TenCongTy,
            Sdt: req.body.Sdt,
            Email: req.body.Email,
            DiaChi: req.body.DiaChi,
            NgheNghiep: req.body.NgheNghiep
        }
    }).then(data => { res.json(data) })
})



router.get('/register', function(req, res, next) {
    res.render('register');
});

router.post('/register', function(req, res) {
    UserModel.findOne({ username: req.body.username }).then(username => {
        if (username != null) {
            res.json({ success: 0, data: 'Tên bị trùng' })
        } else {
            UserModel.create({
                username: req.body.username,
                password: req.body.password,
                Ho: req.body.ho,
                TenKH: req.body.ten,
                Tuoi: req.body.tuoi,
                NgheNghiep: req.body.nghenghiep,
                TenCongTy: req.body.tencongty,
                Sdt: req.body.sdt,
                Email: req.body.email,
                DiaChi: req.body.diachi
            }).then(user => {
                res.json({ success: 1, data: user })
            });
        }
    });
});
// nói viễn coi lại
router.get('/CV', loggedin, function(req, res, next) {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        UserModel.find({ NgheNghiep: regex }, function(err, user) {
            if (err) {
                res.json({ success: 0, data: err });
                return
            }
            res.render('showprofile', { data: user, user: req.user })
        });
    } else {
        UserModel.find({}, function(err, user) {
            if (err) {
                res.json({ success: 0, data: err });
                return
            }
            res.render('cv', { data: user, user: req.user })
        });
    }

});

router.post('/create_login', (req, res) => {
    LoginModel.create({ makh: req.body.makh, Token: req.body.token }).then(data => {
        res.json(data);
    })
})


router.post('/user_name', (req, res) => {
    LoginModel.findOne({ Token: req.body.token }).then(data => {
        UserModel.findOne({ _id: data.makh }).then(user => {
            res.json(user)
        })
    })
});

router.post('/sign_out', (req, res) => {
    LoginModel.findOneAndDelete({ Token: req.body.token }).then(data => {
        res.json(data)
    })
})


router.get('/showprofile',loggedin, function(req, res, next) {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        UserModel.find({ NgheNghiep: regex }, function(err, user) {
            
            if (err) {
                res.json({ success: 0, data: err });
                return
            }
            res.render('showprofile', {data:user});
 
            
        })
    } else {
        UserModel.find({}, function(err, user) {
            if (err) {
                res.json({ success: 0, data: err });
                return
            }
            res.render('showprofile',  {data:user})
        });
    }
});



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// create room chat

router.post('/create_room_chat',(req,res)=>{
    LoginModel.findOne({Token:req.body.token}).then(login=>{
        UserModel.findOne({_id:login.makh}).then(user=>{
            ConverModel.findOne({$or:[{user1:user.username,user2:req.body.user2},{user1:req.body.user2,user2:user.username}]}).then(data=>{
                if(!data)
                {
                    ConverModel.create({user1:user.username,user2:req.body.user2}).then(data=>{
                        // create room chat
                        res.json(data)
                    })
                }
                else
                {
                    // had a room chat
                     res.json(data)
                }
             
           
            })
           
        })
    })
});

// condition to create a room chat

router.post('/condition_create_room',(req,res)=>{
    LoginModel.findOne({Token:req.body.token}).populate('makh').then(user1=>{
        res.json(user1)
    })
})

// get list content
router.post('/get_content',(req,res)=>{
    // Conver_ContentModel.find({maconver:req.body.maconver}).populate('makh').then(list_content=>{ 
    //             res.json(list_content);
    // })
    Conver_ContentModel.find({maconver:req.body.maconver}).populate('makh').then(list_content=>{
        for(var i = list_content.length -1; i>=0 ; i-- )
        {
            if(moment(list_content[i]).fromNow() > moment(list_content[i-1]).fromNow)
            {
                temp =list_content[i] ;
                list_content[i] =list_content[i-1];
                list_content[i-1] = temp;

            }
        }
            res.json(list_content);
     
    })
})

router.post('/your_content',(req,res)=>{
    LoginModel.findOne({Token:req.body.token}).populate('makh').then(login=>{
       res.json(login)
        });
        
})



// about socket

// find name for socket
router.post('/find_socket_name',(req,res)=>{
    LoginModel.findOne({Token:req.body.token}).populate('makh').then(login=>{
        res.json(login)
    })
})

// create room chat socket
router.post('/create_room_chat_socket',(req,res)=>{
    LoginModel.findOne({Token:req.body.token}).then(login=>{
        UserModel.findOne({_id:login.makh}).then(user=>{
            ConverModel.findOne({$or:[{user1:user.username,user2:req.body.user2},{user1:req.body.user2,user2:user.username}]}).then(data=>{
                if(!data)
                {
                    ConverModel.create({user1:user.username,user2:req.body.user2}).then(data=>{
                        // create room chat
                        res.json(data)
                    })
                }
                else
                {
                    // had a room chat
                     res.json(data)
                }
             
           
            })
           
        })
    })
});

   // create content socket
   router.post('/create_content_socket', (req,res)=>{ 
    LoginModel.findOne({Token:req.body.token}).populate('makh').then(user=>{
        Conver_ContentModel.create({makh:user.makh._id,Time:req.body.now,maconver:req.body.maconver,
                                    Content:req.body.content,Status:req.body.status}).then(content=>{
            res.json(content)
        })
     
    })
});

// get list content socket
router.post('/get_content_socket',(req,res)=>{
    Conver_ContentModel.find({maconver:req.body.maconver}).populate('makh').then(list_content=>{
        for(var i = list_content.length -1; i>=0 ; i-- )
        {
            if(moment(list_content[i]).fromNow() > moment(list_content[i-1]).fromNow)
            {
                temp =list_content[i] ;
                list_content[i] =list_content[i-1];
                list_content[i-1] = temp;

            }
        }
            res.json(list_content);
     
    })
})

router.post('/your_content_socket',(req,res)=>{
    LoginModel.findOne({Token:req.body.token}).populate('makh').then(login=>{
       res.json(login)
        });
        
})

router.post('/find_user_chat',(req,res)=>{
    LoginModel.findOne({Token:req.body.token}).populate('makh').then(login=>{
        res.json(login);
    })
})

router.post('/check_status_of_me', (req,res)=>{
    Conver_ContentModel.updateOne({_id:req.body.content_id}, {$set:{Status:"Done"}}).then(check=>{
        res.json(check)
    })
})

// count message

router.post('/count_message',(req,res)=>{
    
    LoginModel.findOne({Token:req.body.token}).populate('makh').then(login=>{   
       
        ConverModel.find({$or:[{user1: login.makh.username}, {user2:login.makh.username}]}).then(list_conver=>{
            res.json({list_conver:list_conver,login:login})
    
        })
    })
})

router.post('/find_your_mes',(req,res)=>{
    Conver_ContentModel.find({maconver:req.body.maconver,Status:"not"}).then(list_content=>{
        res.json(list_content);
    })
})


router.post('/update_status_seen',(req,res)=>{
    UserModel.findOne({username:req.body.username}).then(user=>{
        Conver_ContentModel.find({maconver:req.body.maconver,Status:"not", makh:user._id}).then(list_content=>{
            list_content.forEach(content => {
                Conver_ContentModel.findOneAndUpdate({_id:content._id},{$set:{Status:"seen"}}).then(seen=>{
                })
            });
            res.json({number:list_content.length})
        })
    })
    
})

router.post('/test',(req,res)=>{

   LoginModel.aggregate([{$match: {Token:req.body.token}}, {$count:"number"}]).then(user=>{
    res.json(user);
   })
        
    
})

// router.post('/count_message',(req,res)=>{
//     var totalMessage = 0;
//     LoginModel.findOne({Token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5ndXllbmFAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxMjMxMjMiLCJfaWQiOiI1ZDFlYjc1ODczMjE0YzM1MGNjNjY1MWIiLCJpYXQiOjE1NjMyNDI2NDYsImV4cCI6MTU2MzI0MjY0OX0.BMs2PNe_J_E1pvXx-FP9SXHdOEjgtFfLqEvHFQ5-xpA"})
//     .populate('makh').then(login=>{   
        
//         ConverModel.find({$or:[{user1: login.makh.username}, {user2:login.makh.username}]}).then(list_conver=>{
            
//             list_conver.forEach(list_conver=>{
//                     Conver_ContentModel.find({maconver:list_conver._id, Status:req.body.status}).then(list_content=>{
//                         list_content.forEach(content=>{
//                             if(content.makh!= login.makh._id)
//                             {
//                               totalMessage++;
//                             }
//                         })
              
//                     })
        
            
//             })
   
//         })
//     res.json(totalMessage);
    
//     })
// })



module.exports = router;