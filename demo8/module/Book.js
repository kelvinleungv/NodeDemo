//引包
var mongoose = require('mongoose');
var db = require('./db.js');

//创建图书Schema
var bookSchema = new mongoose.Schema({
	name      :        {type:String},
	author     :        {type:String},
	price     :        {type:Number}
})

//mongoose封装了mongodb->DAO
//列出所有图书(利用原生的find用static)
bookSchema.static.find = function(name,callback){
	return this.model('book').find({},callback);
}

//根据name查找图书
bookSchema.statics.findbyName = function(name, callback) {
    return this.model('book').find({"name": name}, callback);
}

//创建模型
var BookModel = db.model("book",bookSchema); //book相当于集合

//暴露模型
module.exports = BookModel;