/**
 * Created by Administrator on 2018/4/4.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Room = require('../models/Room');


var data;
var responseData;
var selectCity = "";
var selectRooms = [];
router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ''
    }
    next();
});
router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,
        userCookies:{},
        rooms:[],
        selectCity:""
    }
    Room.find().then(function (rooms) {
        data.rooms = rooms;
        next();
    });
});
//首页
router.get('/', function (req, res, next) {
    if(req.cookies) {
        data.userCookies = {
            userid: req.cookies.get('userid'),
            username: req.cookies.get('username'),
            headimg:req.cookies.get('headimg'),
            isAdmin:req.cookies.get('isAdmin')
        }
    }
    data.recommendRooms = data.rooms.splice(0,4);
    var where = {
        stars: 5
    }
    Room.find(where).limit(4).then(function (recommendRooms) {
        if(recommendRooms.lenght <= 4) {
            data.recommendRooms = recommendRooms;
        }
        console.log(data);
        res.render('index.html',data);
    })
    
    // console.log(data.userCookies);
    // res.send("4444");
});
router.get('/roomsview', function (req, res, next) {
    var room = req.query.room || '';
    var selectOption = req.query.option || '';
    data.orderCookies = {
        // selectCity: req.cookies.get('selectCity'),
        indate: req.cookies.get('indate'),
        outdate: req.cookies.get('outdate'),
        peoplenum: req.cookies.get('peoplenum')
    }
    // var roomid = req.query.roomid || '';
    var where = {};
    if(selectCity) {
        where.city = selectCity ;
        data.selectCity = selectCity;
        console.log(selectCity);
    }
    function compare(property){
        return function(obj1,obj2){
            var value1 = obj1[property];
            var value2 = obj2[property];
            return value2 - value1;     // 升序
        }
    }
    Room.find(where).count().then(function (count) {
        data.count = count;
        // data.pages = Math.ceil(data.count / data.limit);
        // //取值不能超过pages
        // data.page = Math.min( data.page, data.pages);
        // //取值不能<1
        // data.page = Math.max( data.page, 1);
        //
        // var skip = (data.page - 1) * data.limit;


        // return Room.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
        //     addTime: -1
        // });
        return Room.find(where);

    }).then(function (Selectrooms) {
        
        // console.log(data);
        if(!Selectrooms.length) {
            console.log("对不起，你查找的城市暂时还没有民宿在本网站发布！");
            res.render('viewRoomsError.html',data);
            return;
        }
        if(selectOption == "stars") {
            // console.log(Selectrooms);
            // console.log(typeof  Selectrooms);
            data.selectrooms = Selectrooms.sort(compare("stars"));
            res.render('viewRooms.html', data);
            // console.log("data.selectOption == stars");

            return;
        }else if(selectOption == "views") {
            data.selectrooms = Selectrooms.sort(compare("views"));
            res.render('viewRooms.html', data);
            return;
        }else if(selectOption == "comments") {
            //有问题
            if(Selectrooms.comments) {
                data.selectrooms = Selectrooms.sort(compare(Selectrooms.comments.length));
                res.render('viewRooms.html', data);
                return;
            }
        }
        selectRooms = Selectrooms;
        data.selectrooms = Selectrooms;
        // console.log(data);
        console.log(Selectrooms);
        res.render('viewRooms.html', data);
    });
    // Room.find
    // console.log(roomData);
    // console.log(selectCity);
    // res.render('viewRooms.html',roomData);
    // return;
})
// router.get('/roomsview', function (req, res, next) {
//     data.room = req.query.room || '';
//     console.log(selectCity);
//     var where = {};
//     if(selectCity) {
//         where.city = selectCity ;
//         data.selectCity = selectCity;
//         console.log(data.selectCity);
//     }
//     // console.log(roomData.selectCity);
//     Room.find(where).count().then(function (count) {
//         data.count = count;
//         // data.pages = Math.ceil(data.count / data.limit);
//         // //取值不能超过pages
//         // data.page = Math.min( data.page, data.pages);
//         // //取值不能<1
//         // data.page = Math.max( data.page, 1);
//         //
//         // var skip = (data.page - 1) * data.limit;
//
//
//         // return Room.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
//         //     addTime: -1
//         // });
//         return Room.find(where);
//
//     }).then(function (Selectrooms) {
//         // console.log(data);
//         if(!Selectrooms.length) {
//             console.log("对不起，你查找的城市暂时还没有民宿在本网站发布！");
//             res.render('viewRoomsError.html',data);
//             return;
//         }
//         selectRooms = Selectrooms;
//         data.selectrooms = Selectrooms;
//         // console.log(data);
//         res.render('viewRooms.html', data);
//     });
//     // Room.find
//     // console.log(roomData);
//     // console.log(selectCity);
//     // res.render('viewRooms.html',roomData);
//     // return;
//
// });
//点击单个民宿
router.get('/viewroom', function (req, res, next) {
    var roomid = req.query.roomid || '';
    console.log("要浏览的房间的id号：");
    console.log(roomid);
    console.log(typeof roomid);
    Room.findOne({
        _id: roomid
    }).then(function (viewingRoom) {
        data.viewingRoom =  viewingRoom;
        viewingRoom.views++;
        viewingRoom.save();
        Room.update({_id:roomid},{$set:{views:viewingRoom.views}},function (error) {
            if (error) {
                console.log("更新Room views失败");
                console.error(error);
                return;
            } else {
                console.log("更新Room views成功")
            }
        })
        // console.log(data);
        // responseData.data = viewingRoom.comments;
        // res.json(responseData);
        res.render('singleHome.html', data);
    });
});



router.get('/login.do', function (req, res, next) {
    res.render('login.html');
    return;

});
router.get('/register.do', function (req, res, next) {
    res.render('login.html');
    return;
});
router.post('/',function (req, res, next) {
    var city = req.body.city;
    var indate = req.body.indate;
    var outdate = req.body.outdate;
    var peoplenum = req.body.peoplenum;
    data.selectOption = {
        selectCity: city,
        indate: indate,
        outdate: outdate,
        peoplenum:peoplenum
    }
    selectCity = city;
    var indatearr = indate.split("-");
    var outdatearr = outdate.split("-");
    // var nowDate = new Date();
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }
    console.log("city:" + city + "; indate:" + indate + "; outdate:" + outdate +"; num:" + peoplenum);
    console.log("city:" + typeof city + "; indate:" + typeof indate + "; outdate:" + typeof outdate +"; num:" + typeof peoplenum);
    var nowDate = getNowFormatDate();
    var nowDateArr = nowDate.split('-');
    if(city == '' || indate == '' || outdate == '' || peoplenum == '') {
        data.selectOption.code = 1;
        data.selectOption.message = '城市、入住日期、离开日期、人数都不能为空！';
        res.json(data.selectOption);
        return;
    }
    if(! ((indatearr[1] <= outdatearr[1] &&  indatearr[2] < outdatearr[2]) && 
        (indatearr[1] >= nowDateArr[1] && indatearr[2] >= nowDateArr[2]))) {
        data.selectOption.code = 2;
        data.selectOption.message = '日期输入错误！';
        res.json(data.selectOption);
        return;
    }
    // console.log(data);
    res.json(data.selectOption);
})

router.get('/comment/get', function (req, res, next) {
    var roomId = req.query.roomid || '';
    Room.findOne({
        _id: roomId
    }).then(function (viewingRoom) {
        responseData.data = viewingRoom.comments;
        console.log(responseData.data);
        res.json(responseData);
    })
});

router.post('/comment/post',function (req, res, next) {
    var roomId = req.body.roomid || '';
    console.log("要评论的房间的id号：");
    console.log(roomId);
    console.log(typeof roomId);
    var postData = {
        username: req.cookies.get('username'),
        postTime: new Date(),
        writedContent: req.body.writedContent
        // username: req.userInfo.username,
        // postTime: new Date(),
        // content: req.body.content
    };
    console.log("要评论的房间的postData：")
    console.log(postData);
    Room.findOne({
        _id: roomId
    }).then(function (viewingRoom) {
        console.log("开始查询");
        viewingRoom.comments.push(postData);
        viewingRoom.save();
        console.log(viewingRoom);
        // Room.update({_id:roomId},{$set:{comments:viewingRoom.comments}},function (error) {
        //     if (error) {
        //         console.log("更新Room comments失败");
        //         console.error(error);
        //         return;
        //     } else {
        //         console.log("更新Room comments成功")
        //     }
        // })
        console.log("评论保存成功。");
    }).then(function (newViewingRoom) {
        responseData.message = '评论成功';
        responseData.data = newViewingRoom;
        console.log(responseData.data);
        res.json(responseData);
    });
})


router.post('/login.do', function (req, res, next) {
    // res.send('API - user0');
    var username = req.body.name;
    var password = req.body.pwd;
    //1、用户名、密码不能为空
    if(username == '' || password == '' ) {
        responseData.code = 1;
        responseData.message = '用户名、密码不能为空';
        res.json(responseData);
        return;
    }
    //查询数据库中相同用户名和密码的记录是否存在，如果村则则登录成功
    User.findOne({
        username: username,
        password: password
    }).then(function ( userInfo ) {
        // console.log("55555" + userInfo);
        if(!userInfo) {
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
        responseData.message = '登录成功。';
        // res.render('index.html');
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username,
            headimg:userInfo.img,
            isAdmin:userInfo.isAdmin
        }

        // console.log(data.userCookies);
        // req.cookies.set('userInfo', JSON.stringify({
        //     _id: userInfo._id,
        //     username: userInfo.username,
        //     headimg:userInfo.img,
        //     isAdmin:userInfo.isAdmin
        // }));
        // responseData.username = userInfo.username;

        res.json(responseData);
        // res.redirect("/");

    });

});



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
        // console.log("222222" + userInfo);
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


// router.get('/room', function (req, res, next) {
//     var roomid = req.query.roomid || '';
//     Room.findOne({
//         _id: roomid
//     }).populate(['user']).then(function (content) {
//         data.content = content;
//         content.views++;
//         content.save();
//         console.log(data);
//         res.render('main/view', data);
//     });
// });

module.exports = router;