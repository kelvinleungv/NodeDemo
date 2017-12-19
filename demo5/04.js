const express = require('express');
const cookieParser = require('cookie-parser');

var app= express();
//使用cookie必须要使用cookie-parser中间件
app.use(cookieParser());
    //req是读取cookies   res是设置cookies
app.get('/',(req,res)=>{
    //maxAge在express以毫秒为单位
    res.send(req.cookies.mudidi);
})

app.get('/jipiao',function(err,req,res){
    //得到get请求，用户查询的目的地
    var mudidi = req.query,mudidi;
    //记录用户的喜好
    //先读取用户喜好，然后把新的数据push进去数组，然后设置新的cookie
    var mudidiarr = req.cookies.mudidi || [];
    mudidiarr.push(mudidi);
    res.cookie('mudidi',mudidiarr,,{maxAge:90000,httpOnly:true});
    res.send(mudidi+'旅游攻略');
})
app.listen(3000);