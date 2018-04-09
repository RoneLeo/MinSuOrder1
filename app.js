/**
 * Created by Administrator on 2018/4/4.
 */
//应用程序的启动入口文件
var Cookies = require('cookies');
var express = require('express');
var swig = require('swig');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express(); //相当于一个服务端对象
app.engine('html', swig.renderFile);
//设置模板文件存放的目录，第一个参数必须是views，第二个参数是目录
app.set('views', './views');
//注册所使用的模板引擎，第一个蚕食必须是view engine，第二个参数和app.engine这个方法中定义的弄吧引擎的名称（第一个）是一致的
app.set('view engine', 'html');
//在开发过程中需要取消模板缓存
swig.setDefaults({cache:false});

var User = require('./Models/User');

app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended:true
}));

//设置cookies
app.use( function (req, res, next) {
    req.cookies = new Cookies(req, res);
    next();
});


// app.get('/', function (req, res, next){
//     res.render('index.html');
//     // res.send("ddddd");
// })
app.use('/', require('./routers/main'));
// app.use('/room', require('./routers/room'));
// app.use('/loginAndRegister', require('./routers/loginAndRegister'));
mongoose.connect('mongodb://localhost:27019/MinSuOrder', function (err) {
    if(err) {
        console.log('数据库链接失败。');
    }else {
        console.log('数据库链接chengg 。');
        //监听http请求
        app.listen(8803);
    }
});


