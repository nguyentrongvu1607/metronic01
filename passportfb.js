var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./db/user');
var authfb = require('./routes/authfb');
var LoginModel = require('./db/login');
module.exports = function (passportfb) {

    passportfb.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passportfb.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passportfb.use(new FacebookStrategy({
        // điền thông tin để xác thực với Facebook.
        clientID: authfb.facebookAuth.clientID,
        clientSecret: authfb.facebookAuth.clientSecret,
        callbackURL: authfb.facebookAuth.callbackURL,
        profileFields: ['id','displayName','email','first_name','last_name','middle_name']
    },
    // Facebook sẽ gửi lại chuối token và thông tin profile của user
    function (token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function () {
            console.log(token, profile);
            // tìm trong db xem có user nào đã sử dụng facebook id này chưa
            // không hiểu facebook id ở đâu
            // User.findOne({'facebook.id': profile.id}, function (err, user) {
            //     if (err)
            //         return done(err);
            //     // Nếu tìm thấy user, cho họ đăng nhập
            //     if (user) {
            //         return done(null, user); // user found, return that user
            //     } else {
            //         // nếu chưa có, tạo mới user
            //         // hỏi cách viết lại bằng usermodel
            //         var newUser = new User();
            //         // lưu các thông tin cho user
            //         newUser.fbid = profile.id;
                   
            //         newUser.username = profile.name.givenName + ' ' + profile.name.familyName; // bạn có thể log đối tượng profile để xem cấu trúc
            //         // fb có thể trả lại nhiều email, chúng ta lấy cái đầu tiền
            //         // newUser.facebook.email = profile.emails[0].value; 
            //         // lưu vào db
            //         newUser.save(function (err) {
            //             if (err)
            //                 throw err;
            //             // nếu thành công, trả lại user
            //             return done(null, newUser);
            //         }); 

            //         var LoginModel = new LoginModel();
            //         LoginModel.Token = token;
            //         LoginModel.makh = newUser._id;  

            //         LoginModel.save(function(err){
            //             if (err)
            //                 throw err;
            //             // nếu thành công, trả lại user
            //             return done(null, LoginModel);
            //         })  ;        
            //     }
            // });
        });
    }));

}