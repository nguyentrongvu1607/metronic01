var mongoose = require('mongoose');
var {Model, Schema} = mongoose;
var UserModel = require('./user');
var ConverModel = require('./conversation');

var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt-nodejs');
var conver_content = new Schema({
maconver: { type: Schema.Types.ObjectId, ref: ConverModel.modelName },
  makh: { type: Schema.Types.ObjectId, ref: UserModel.modelName },
  Content:String,
  Time: Date
});

// conver_content.pre('save',function(next)
// {
//     var doc = this;

//    conver_contentModel.findOne({}).sort('-maconver_content').exec(function(err,last)
//     {
//         if(doc.maconver_content > 0)
//         {
//         next();
//         return;
//         }

//         if(err || last ==null)
//         {
//             doc.maconver_content = 1;
//         }
//         else
//         {
//             doc.maconver_content = last.maconver_content + 1;
//         }
//         next();
//     }
//     )
// }
// );

var PublicFields = [];


class conver_contentModel extends Model
{ 
    static Createconver_content ( maconver,Time,makh,Content,callback)
    {
        
        
        return conver_contentModel.create({
         makh:makh,
         Content: Content,
         maconver:maconver,
         Time:Time

        }, callback);
    }

    static Updateconver_content (data , callback)
    {
        return conver_contentModel.findOneAndUpdate(data._maconver_content, {$set: data}, callback);
    }

    static Getconver_content(id, callback)
    {
        return conver_contentModel.findById(id, callback);
    }

    static Getconver_contents(data, callback)
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
                if(conver_content.paths[value])
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
                $or:[{ 'conver_contentname': { '$regex': data.search, '$options': 'i' } },
                { 'description': { '$regex': data.search, '$options': 'i' } }
                ]
            });
        }

        options.select = PublicFields;
        return conver_contentModel.paginate(filter, options, callback);

    }
    
    static Deleteconver_content(id, callback)
    {
        return conver_contentModel.findByIdAndRemove(id, callback);
    }
    
}



mongoose.model(conver_contentModel, conver_content);
module.exports = conver_contentModel;

module.exports.PublicFields = PublicFields;


