const express =require('express');
const app =express();
const db = require('./model/db.js');
const formidable =require('formidable');
const ObjectId =require('mongodb').ObjectID;
const crypto = require('crypto');
const md5 = require('./model/md5.js');

app.set('view engine','ejs');

app.use(express.static('./public'));

//注册页面
app.get('/reg',(req,res)=>{
    res.render('reg');
})

//登录页面
app.get('/login',(req,res)=>{
    res.render('login');
})

//执行注册-->就是当别人post就到这么页面执行
//第一个参数表示处理post到/dopost这个页面的参数
app.post('/doreg',function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
            var username=fields.username;
            var password=fields.password;
            //加密
             var mima=md5(password);
            //添加到数据库
            db.insertOne('user',
            {
                "username":username,
                "password":mima
             },
            function(err,result){
               //result给ajax回调
               if(err){
                   res.send('-1');
                   return;
               }
               res.send('1');
            })
    })
})

//执行登录
app.post('/dologin',function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        var username= fields.username;
        var password = fields.password;
        //检索数据库，按登录名检索数据库，查看密码是否匹配
        db.find('user',{"username":username},function(err,result){
            if(result.length==0){
                res.send('-2');//没有这个人
                return; 
            }
            var shujukuzhongdemima = result[0].password;
            //对用户这次输入的密码进行相同的加密然后进行匹配
            var mima =md5(password);
            if(shujukuzhongdemima === mima){
                res.send('1');//表示成功
            }else{
                res.send('-1');//表示密码不匹配
            }
        })
    })
})


app.listen(3000);