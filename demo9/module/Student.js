//引包
var mongoose = require('mongoose');
var db = require('./db.js');

//创建StudentSchema
var StudentSchema = new mongoose.Schema({
    'sid'   : Number,
    'name'  : String,
    'age'   : Number,
    'sex'   : String,
    'Kechengs': [Number] //数组存放kid
})
//设置索引
StudentSchema.index({'sid':1});

//创建模型
var StudentModel = db.model('student',StudentSchema);

//暴露
module.exports = StudentModel;