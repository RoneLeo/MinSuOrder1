/**
 * Created by Administrator on 2018/4/4.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');

var responseData;
router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ''
    }
    next();
});

router.get('/login.do', function (req, res, next) {
    res.render('login.html');
})
router.get('/register.do', function (req, res, next) {
    res.render('login.html');
})

router.post('/register.do', function (req, res, next) {
    // res.send('API - user0');
    var username = req.body.regName;
    var password = req.body.pwd;
    var repassword = req.body.pwd2;
    //1、用户名不能为空
    if(username == '') {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    //2、密码不能为空
    if(password == '') {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    //3、两次密码必须一致
    if(password != repassword) {
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json(responseData);
        return;
    }
    //
    User.findOne({
        username: username
    }).then(function ( userInfo ) {
        console.log(userInfo);
        if(userInfo) {
            responseData.code = 4;
            responseData.message = '用户名已经被注册';
            res.json(responseData);
            return;
        }
        var user = new User({
            username: username,
            password: password
        });
        return user.save();

    }).then(function(newUserInfo) {
        console.log(newUserInfo);
        responseData.message = '注册成功';
        res.json(responseData);

    });
});

module.exports = router;