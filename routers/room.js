/**
 * Created by Administrator on 2018/4/6.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Room = require('../models/Room');

router.get('/view', function (req, res, next) {
    // if(!data) {
    //     console.log("data为空");
    // }else {
    //     console.log("11111" + data.userInfo);
    //
    // }
    res.render('viewRooms.html');

})

module.exports = router;