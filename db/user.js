var mongoose = require('mongoose');
var {Model, Schema} = mongoose;

var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt-nodejs');
var user = new Schema({
  makh: Number,
  username: String,
  password: String,
  TenKH: String,
  DiaChi: String,
  Sdt: String,
  Role: String,
    Image: String
  
});
//Blog.create({ten:'abc'}).then(blog=>{
 // console.log(blog);
//}).catch(err=>{
 //// console.log(err)
//})


user.pre('save',function(next)
{
    var doc = this;

   userModel.findOne({}).sort('-makh').exec(function(err,last)
    {
        if(doc.makh > 0)
        {
        next();
        return;
        }

        if(err || last ==null)
        {
            doc.makh = 1;
        }
        else
        {
            doc.makh = last.makh + 1;
        }
        next();
    }
    )
}
);

var PublicFields = [];


class userModel extends Model
{ 
    static Createuser ( username , password, TenKH, DiaChi, Sdt ,Role,Image ,callback)
    {
        
        
        return userModel.create({
            username: username,
            password : password,
            TenKH : TenKH,
            DiaChi : DiaChi,
            Sdt : Sdt,
            Role:Role,
            Image: Image

        }, callback);
    }

    static Updateuser (data , callback)
    {
        return userModel.findOneAndUpdate(data._makh, {$set: data}, callback);
    }

    static Getuser(id, callback)
    {
        return userModel.findById(id, callback);
    }

    static Getusers(data, callback)
    {
        let options = {};
        options['sort']= data.sort || {registerDate: -1};
        if(data.limit != undefined) options['limit'] = Number(data.limit);
        if(data.page !=undefined) options['page'] = Number(data.page);
        let filter = {};
        if(data.filter && Object.keys(data.filter).length > 0)
        {
            var fArr = [];
            Object.keys(data.filter).forEach(function (value)
            {
                if(user.paths[value])
                {
                    let f = {};
                    if(Array.isArray(data.filter[value]))
                    {
                        if(data.filter[value].length > 0) f[value] = {$in : data.filter[value]}
                    }
                    else
                    {
                        f[value] = new RegExp(data.filter[value], 'ig');
                    }

                    if(Object.keys(f).length) fArr.push(f);
                }
            }
            );

            if(fArr.length > 0) filter['$and'] = fArr;
        }

        if(data.search && typeof (data.search) == 'string' && data.search.length)
        {
            if(!filter['$and']) filter['$and'];
            filter.$and.push({
                $or:[{ 'username': { '$regex': data.search, '$options': 'i' } },
                { 'description': { '$regex': data.search, '$options': 'i' } }
                ]
            });
        }

        options.select = PublicFields;
        return userModel.paginate(filter, options, callback);

    }
    
    static Deleteuser(id, callback)
    {
        return userModel.findByIdAndRemove(id, callback);
    }
    
}

// user.methods.hashPassword = function(password){
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
// };

// user.methods.comparePassword = function(password, hash){
//     return bcrypt.compareSync(password,hash) 
// };

mongoose.model(userModel, user);
module.exports = userModel;
// sign up
// module.exports = mongoose.model('user', user, 'user');
module.exports.PublicFields = PublicFields;


