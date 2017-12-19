const express = require('express');
const app = express();
const router = require('./router/router.js')
const session = require('express-session');

//session设置
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }))

//设置模板引擎
app.set('view engine','ejs');

//静态页面
app.use(express.static('./public'));
app.use("/avatar",express.static('./avatar'));

//路由表
app.get('/',router.showIndex);
app.get('/regist',router.showReg);
app.post('/doregist',router.doRegist);
app.get('/login',router.showLogin);
app.post('/dologin',router.doLogin);
app.get('/setavatar',router.showSetAvater);
app.post('/dosetavatar',router.doSetAvater);
app.post('/post',router.doPost)  //发表说说
app.get('/getAllShuoshuo',router.getAllShuoshuo);//列出所有说说Ajax服务
app.get('/getUserInfo',router.getUserInfo);
app.get('/getshuoshuoamount',router.getShuoShuoAmount);
app.get('/loginout',router.loginOut);//注销
app.get('/user/:user',router.showUser);//显示登录用户的所有说说(主页)
// app.get('/post/:oid',router.showUser);
app.get('/userlist',router.userList);//全体成员
app.listen(3000); 