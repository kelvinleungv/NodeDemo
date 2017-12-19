// mongoose 链接
var mongoose = require('mongoose');
//创建数据库连接
var db  = mongoose.createConnection('mongodb://127.0.0.1:27017/tushu'); 

db.on('error', function(error) {
    console.log(error);
});

db.once('open',function(callback){
	console.log('数据库成功连接');
})
module.exports = db;