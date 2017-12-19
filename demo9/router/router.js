var db = require('../module/db.js');
var Student = require('../module/Student.js');
var Kecheng = require('../module/KeCheng.js');

//测试
// Kecheng.create({"kid":"1002","name":"美术课"});
// Kecheng.create({"kid":"1003","name":"武术课"});
// Kecheng.create({"kid":"1004","name":"体术课"});

//显示首页
exports.showIndex = function(req,res,next){
    Student.find({},function(err,result){
        //result就是所有学生数组
        console.log(result);
        res.render('index',{
            'students':result,
            
        });
    })
}
//添加页面
exports.showAdd = function(req,res,next){
    //先要去查询有多少种课程，然后给add这个模板引擎
    Kecheng.find({},function(err,result){
        res.render('add',{
            "quanbukecheng":result
        });
    })
    
}

//添加业务
exports.doAdd = function(req,res,next){
    //req.query是对象
    //{'name',小红,sex:'男, kechengs:[100,101]}
    Student.create(req.query,function(){
        console.log('插入成功');
        //在课程中添加此人(给课程写静态方法)
        Kecheng.tianjiaxuesheng(req.query.Kechengs,req.query.kid,function(){
            console.log('插入成功');
        })
        res.redirect('/');
    }) 
} 

//修改页面
exports.showEdit = function(req,res,next){
    //执行页面修改
    var sid = req.params['sid'];//获得：后面的东西
    //findOne是mongoose的api
    Student.findOne({"sid":sid},function(err,result){
        if(err || !result){
            res.send('错误');
        }
        res.render('edit',{
            "student" : result
        });
    })
}
//修改业务
exports.doeidt = function(req,res,next){
    //要改的学生ID
    var sid = parseInt(req.params['sid']);
    Student.update({'sid':sid},req.query,function(){
        console.log('修改成功');
        res.redirect('/');
    });
}

//删除业务
exports.doremove = function(req,res,next){
    var sid = parseInt(req.params['sid']);
    Student.remove({'sid':sid},{justOne:true},function(){
        console.log('删除成功');
        res.redirect('/');
    })
}



//