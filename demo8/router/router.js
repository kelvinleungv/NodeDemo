//这个页面不关心数据库，只关心对象
var Book = require('../module/Book.js');
var db = require('../module/db.js');
//显示首页
exports.showIndex = function(req,res,next){
	Book.find(function(err,result){
		res.render('index',{
			"tushu":result
		})
	})	
}
//图书页面
exports.addBook = function(req,res,next){
	res.render('addBook');
}

//添加图书业务
exports.doadd = function(req,res,next){
	Book.create(req.query,function(err){
		if(err){
			res.send('失败！');
		}
		res.redirect('/');
		
	})
}

//修改页面显示
exports.edit = function(req,res,next){
	Book.findbyName({"name":req.query},function(err,result){
		console.log(result);

	})	
}
//修改业务
exports.doedit = function(req,res,next){
	//拿到url上面的东西
	//用原生的update
	Book.update({'name':req.query.name},req.query,function(){
		res.send('修改成功');
	});

}