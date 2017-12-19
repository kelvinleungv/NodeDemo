var express  =require('express');
var app = express();
var db =require('./model/db.js')
var session = require('express-session');
app.set('view engine','ejs');
//设置静态服务
app.use(express.static('./public'));

app.get('/',(req,res,next)=>{
    //用session
   if(req.session.login == '1'){
       res.send('欢迎'+req.session.username);
   }else{
       res.send('没有成功登录');
   }
  })

app.get('/login',(req,res,next)=>{
  //渲染模板
  res.render('login');
})

app.get('/checklogin',(req,res)=>{
    //用户填写的username
    var tianxiedeusername = req.query.username;
    //用户填写的password
    var tianxiedepassword = req.query.password;
    //根据用户填写的名，去数据库里面找文档然后读取密码,
    //如果读取的密码和填写的密码一样就登录成功，反之就登录失败，如果没有找到这个记录，就表示用户名不存在
    db.find('user',{'username':tianxiedeusername},(err,result)=>{
        if(result.length === 0){
            res.send('用户不存在');
            return;
        }
        var shujuzhongdeusername = result[0].username;
        //数据库中的密码
        var shujukuzhongdepassword = result[0].password;
        if(shujukuzhongdepassword ===tianxiedepassword ){
            //用session读取
            req.session.login = '1';
            req.session.username = result[0].username;
            res.send(`欢迎${shujuzhongdeusername}登录成功`);
        }else{
            res.send('密码错误');
        }
    })
})


app.listen(3000,(err,res)=>{
    if(err){
        res.render('登录失败');
    }
    console.log('服务器连接成功');
})