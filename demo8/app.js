const express = require('express');
const app=express();
const db = require('./module/db.js');
const router = require('./router/router.js');

app.set('view engine','ejs');

app.get('/',router.showIndex);//显示首页
app.get('/addBook',router.addBook);//添加图书页面
app.get('/doadd',router.doadd);//添加图书业务

app.get('/edit',router.edit);//修改图书页面
app.get('/doedit/:name',router.edit);//修改业务

app.listen(3000);