const express =  require('express');
const app = express();
const db = require('./module/db.js');
const router = require('./router/router.js');

app.set('view engine','ejs');

app.get('/',router.showIndex);//显示首页
app.get('/add',router.showAdd);//添加页面
app.get('/doadd',router.doAdd);//添加业务

app.get('/edit/:sid',router.showEdit);//修改页面

app.get('/doedit/:sid',router.doeidt);//修改业务

app.get('/remove/:sid',router.doremove);//修改业务

app.listen(3000);