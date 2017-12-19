//引包
var mongoose = require('mongoose');
var db = require('./db.js');

var keChengSchema = new mongoose.Schema({
    'kid' : Number,
    'name': String,
    'students': [Number] //这个数组存放的是学生的sid学号
})

//设置索引
keChengSchema.index({'kid':1});

//添加静态方法
keChengSchema.statics.tianjiaxuesheng = function(kidarray,sid,callback){
    for(var i=0;i<kidarray;i++){
        Kecheng.update({"kid":kidarray[i]},{$push:{'students':sid}},function(){
            console.log('课程添加学生');
        })
    }
}

//创建模型
var keChengModel = db.model('Kecheng',keChengSchema);

//暴露
module.exports = keChengModel;