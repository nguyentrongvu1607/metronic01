var mongoose = require('mongoose');
var {Model, Schema} = mongoose;
var UserModel = require('./user')

var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt-nodejs');
var login = new Schema({
  malogin: Number,
  Token: String,
  makh: { type: Schema.Types.ObjectId, ref: UserModel.modelName },
  
});

login.pre('save',function(next)
{
    var doc = this;

   loginModel.findOne({}).sort('-malogin').exec(function(err,last)
    {
        if(doc.malogin > 0)
        {
        next();
        return;
        }

        if(err || last ==null)
        {
            doc.malogin = 1;
        }
        else
        {
            doc.malogin = last.malogin + 1;
        }
        next();
    }
    )
}
);

var PublicFields = [];


class loginModel extends Model
{ 
    static Createlogin ( Token,makh,callback)
    {
        
        
        return loginModel.create({
            makh:makh,
            Token:Token

        }, callback);
    }

    static Updatelogin (data , callback)
    {
        return loginModel.findOneAndUpdate(data._malogin, {$set: data}, callback);
    }

    static Getlogin(id, callback)
    {
        return loginModel.findById(id, callback);
    }

    static Getlogins(data, callback)
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
                if(login.paths[value])
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
                $or:[{ 'loginname': { '$regex': data.search, '$options': 'i' } },
                { 'description': { '$regex': data.search, '$options': 'i' } }
                ]
            });
        }

        options.select = PublicFields;
        return loginModel.paginate(filter, options, callback);

    }
    
    static Deletelogin(id, callback)
    {
        return loginModel.findByIdAndRemove(id, callback);
    }
    
}



mongoose.model(loginModel, login);
module.exports = loginModel;

module.exports.PublicFields = PublicFields;


