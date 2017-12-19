const formidable = require('formidable');
const db = require('./../model/db.js');
const crypto = require('crypto');
const md5 = require('./../model/md5.js');
const path =require('path');
const fs = require('fs');
const ObjectId =require('mongodb').ObjectID;

//显示首页
exports.showIndex = function(req,res,next){
    //检索数据库查询头像
    if(req.session.login =='1'){
        //如果登录
        var username = req.session.username;
        var login = true;
    }else{
        //没有登录
        var username ='';
        var login =false;
    }    
    //已经登录，那么就要检索数据库，查找头像
    db.find('user',{username:username},function(err,result){
        if(result.length == 0 ){
            var avatar ='index.jpg';
        }else{
            var avatar = result[0].avatar;
        }
        res.render('index',{
            "login":login,
            "username" : username,
            'active':"首页",
            'avatar':avatar ,//查询数据库查询出来,登录人的头像
            
        })
    })  
   
}
//注册页面
exports.showReg = function(req,res,next){
    res.render('reg',{
        "login":req.session.login == "1" ? true : false,
        "username" : req.session.login == "1" ? req.session.username : " ",
        'active':"注册"
    });
}
//登录页面
exports.showLogin = function(req,res,next){
    res.render('login',{
        "login":req.session.login == "1" ? true : false,
        "username" : req.session.login == "1" ? req.session.username : " ",
        'active':"登录"
    });
}
//设置头像页面，必须保证此时是登录状态
exports.showSetAvater = function(req,res,next){
    if(req.session.login != '1'){
        res.end('非法闯入，这个页面要求登录!');
        return;
    }
    res.render('setavatar',{
        "login": true ,
        "username" : req.session.username ,
        'active': req.session.avatar
    });
}
//注册业务
exports.doRegist = function(req,res,next){
    //得到用户填写的东西，查询数据库中是否有这个人的
    //查询数据库中是不是有这个人
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        var username = fields.username;
        var password = fields.password;
        //加密
        var mima = md5(password);
        //查找数据库是否有这个人
        db.find('user',{"username":username},function(err,result){
            if(err){
                res.send('-3');
                return;
            }
            //result.length ！=0表示存在数据，所以才不等于0
            if(result.length != 0){
                res.send('-1');
                return;
            }
            //没有此人，插入数据库,avatar默认头像路径
            db.insertOne('user',
               {
                   "username":username,
                   "password":mima,
                   "avatar":"index.jpg"
               }  
            ,function(err,result){
                if(err){
                    res.send('-3');
                    return;
                }             
                 res.send('1');  
            })
        });
       
    }) 
}
//发表说说业务
exports.doPost = function(req,res,next){
    //需要保证用户登录
    if(req.session.login != "1"){
        res.end('非法闯入，这个页面要求登录！');
        return;
    }
    var username =req.session.username;
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        var content = fields.content;
            db.insertOne('shuoshuo',
               {
                   "username":username,
                   'content':content,
                   'datetime':new Date()
               }  
            ,function(err,result){
                if(err){
                    res.send('-3');
                    return;
                }   
                 res.send('1');  //发表成功
            })
        });
}
//登录业务
exports.doLogin = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){

        var username = fields.username;
        var password = fields.password;

        //判断加密
        var mima = md5(password);
        db.find('user',{"username":username},function(err,result){
            if(err){
                res.send('-3');//状态码，传给ajax
                return;
            }
            if(result.length == 0){
                res.send('-1'); //用户名不存在
                return;
            }
            if(mima == result[0].password){
                req.session.login = '1';
                req.session.username = username;
                res.send('1');    // 登录成功
                 console.log(req.session.login);
                return;
            }else{
                res.send('-2');//密码错误
                return;
            }
        })

    })
}
//设置头像
exports.doSetAvater = function(req,res,next){
    //得到表单
    var form = new formidable.IncomingForm();
    form.uploadDir =path.normalize(__dirname+"/../avatar");
    form.parse(req,function(err,fields,files){
        //得到上传对象在files里
        //  console.log(fields,files);
        var oldname = files.touxiang.path; 
        var newpath = path.normalize( __dirname+"/../avatar")+"/"+req.session.username + '.jpg';
        fs.rename(oldname,newpath,function(err){
               if(err){
                res.send('失败');
                return;
               }
              //开始写切图片的页面cut.ejs  【没有安装工具，不能使用 gm】
              //跳转到res.redirect('/qie');   redirect重定向
              req.session.avatar = req.session.username + 'jpg';
              //更改数据库 当前用户的avatar的值
            //   res.redirect('/');

           //【用post上传图片】
              db.updateMany('user',
                {"username":req.session.username},
                {$set:{'avatar':req.session.avatar}},
                function(err,results){
                    if(err){
                        req.send('-1');
                        return;
                    }
                    req.send('1');
              })
        });
    })
}

//列出所有说说
exports.getAllShuoshuo = function(req,res,next){
    //这个页面接受一个参数，页面
    var page =req.query.page;
    db.find('shuoshuo',{},{"pageamount":6,"page":page,"sort":{"datetime":-1}},function(err,result){
        res.json(result);
    })
}
//列出某个用户的信息,有分页功能
exports.getUserInfo = function(req,res,next){
    var username = req.query.username;
    db.find('user',{'username':username},function(err,result){
        var obj = {
            "_id":result[0]._id,
            "username":result[0].username,
            "avatar":result[0].avatar
        }
        res.json(obj);
    })
}
//分页的总数
exports.getShuoShuoAmount = function(req,res,next){
    db.getCount('shuoshuo',function(count){
        res.send(count.toString());
    })
}
//注销
exports.loginOut = function(req,res,next){
    req.session.login = null;
    res.redirect('/');
}
//某某的个人主页页面
exports.showUser = function(req,res,next){
    var user = req.params.user;
    db.find('shuoshuo',{'username':user},function(err,result){
        db.find('user',{'username':user},function(err,result2){
            res.render('user',{
                "login": true ,
                "username": req.session.username,
                'active':'个人主页',
                'user':user  ,//只查看的那个人
                'cirenshuoshuo':result ,//这个人的说说,
                'avatar':result2[0].avatar
            })
        })
    })
    
}
// 成员列表
exports.userList = function(req,res,next){
        db.find('user',{},function(err,result2){
            res.render('userlist',{
                "login": true ,
                'username':req.session.username,
                'active':'全体说说',
                'avatar':result2[0].avatar,
                'suoyouchengyuan':result2
            })
        })  
}
