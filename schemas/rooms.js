/**
 * Created by Administrator on 2018/3/13.
 */

var mongoose = require('mongoose');

//用户的表结构
module.exports = new mongoose.Schema({
    //用户名
    city: String,
    //密码
    place: String,
    
    name:String,
    
    price:String,
    
    stars: String,

    image: String,
    
    isFull: Boolean,

    views: Number,

    introduction: String,
    
    comments: {
        type: Array,
        default: []
    }
    
});
