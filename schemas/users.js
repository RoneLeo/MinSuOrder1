/**
 * Created by Administrator on 2018/3/13.
 */

var mongoose = require('mongoose');

//用户的表结构
module.exports = new mongoose.Schema({
    //用户名
    username: String,
    //密码
    password: String,
    
    telephone:String,
    
    email:String,
    
    img: String,

    isAdmin: {
        type: Boolean,
        default: false
    }
});
