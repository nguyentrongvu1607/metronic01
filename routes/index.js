var express = require('express');
var router = express.Router();
var LoginModel = require('../db/login');
var UserModel = require('../db/user');

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


router.get('/CV', loggedin, function(req, res, next) {

  res.render('CV');
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

router.get('/login1', function(req, res, next) {
    res.render('login1', { title: 'Express' });
});

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

router.get('/logout', function(req, res) {
    req.logout()
    res.send('/')
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


router.get('/showprofile', function(req, res, next) {
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

// var fs = require('fs');
// var ejs = require('ejs');
// var compiled = ejs.compile(fs.readFileSync(__dirname + '/../views/test.ejs', 'utf8'));
// var html = compiled({ title : 'EJS' });
// console.log(html);

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;