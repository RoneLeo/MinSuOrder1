/**
 * Created by Administrator on 2018/3/13.
 */
var mongoose = require('mongoose');
var roomsSchema = require('../schemas/rooms');

module.exports = mongoose.model('Room', roomsSchema);