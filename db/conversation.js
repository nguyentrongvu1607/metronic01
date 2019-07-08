var mongoose = require('mongoose');
var {Model, Schema} = mongoose;
var UserModel = require('./user')

var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt-nodejs');
var conver = new Schema({
  user1:String,
  user2:String


  
});

// conver.pre('save',function(next)
// {
//     var doc = this;

//    converModel.findOne({}).sort('-maconver').exec(function(err,last)
//     {
//         if(doc.maconver > 0)
//         {
//         next();
//         return;
//         }

//         if(err || last ==null)
//         {
//             doc.maconver = 1;
//         }
//         else
//         {
//             doc.maconver = last.maconver + 1;
//         }
//         next();
//     }
//     )
// }
// );

var PublicFields = [];


class converModel extends Model
{ 
    static Createconver ( user1,user2,callback)
    {
        
        
        return converModel.create({
         user1:user1,
         user2:user2

        }, callback);
    }

    static Updateconver (data , callback)
    {
        return converModel.findOneAndUpdate(data._maconver, {$set: data}, callback);
    }

    static Getconver(id, callback)
    {
        return converModel.findById(id, callback);
    }

    static Getconvers(data, callback)
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
                if(conver.paths[value])
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
                $or:[{ 'convername': { '$regex': data.search, '$options': 'i' } },
                { 'description': { '$regex': data.search, '$options': 'i' } }
                ]
            });
        }

        options.select = PublicFields;
        return converModel.paginate(filter, options, callback);

    }
    
    static Deleteconver(id, callback)
    {
        return converModel.findByIdAndRemove(id, callback);
    }
    
}



mongoose.model(converModel, conver);
module.exports = converModel;

module.exports.PublicFields = PublicFields;


