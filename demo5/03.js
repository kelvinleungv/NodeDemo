const express =require('express');
const app =express();
const db = require('./model/db.js');
const formidable =require('formidable');
const ObjectId =require('mongodb').ObjectID;

//设置模板引擎
app.set('view engine','ejs');

//静态服务
app.use(express.static('./public'));

//显示留言列表 /路由
app.get('/',(req,res,next)=>{
    db.getCount('liuyanben',function(count){
        res.render('index',{
            "pageamount":Math.ceil(count/4)
        });
    })
});


//后台读取留言,这个供ajax使用
app.get("/du",function(req,res,next){
    //分页 
    //这个页面可以接受一个参数
    var page =parseInt(req.query.page);                                             //一页有4条记录
    db.find("liuyanben",{},{"sort":{"shijian":-1},"pageamount":4,"page":page},function(err,result){
        res.json({"result":result});
    })
})



//处理留言
app.post('/tijiao',(req,res,next)=>{
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields){
        //写入数据库
        db.insertOne('liuyanben',{
            "xingming":fields.xingming,
            "liuyan":fields.liuyan,
            "shijian": new Date()
        },function(err,result){
            if(err){
                res.json('-1')//-1是给ajax看的
                return;
            }
            res.json('1');
          }
    )
        console.log('收到请求了'+fields.xingming+fields.liuyan);
    })
});


//删除  --->当用户点击删除，路由去到localhost：3000/shanchu>id=....  这个位置
app.get('/shanchu',function(req,res,next){
    db.deleteMany("liuyanben",{"_id":ObjectId(id)},function(err,result){
        res.redirect('/');//重定向回去
    })
})

app.listen(3000);