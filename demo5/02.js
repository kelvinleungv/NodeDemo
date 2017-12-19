const express = require('express');

const app =express();

var db = require('./model/db.js');

app.get('/',function(req,res){
    db.insertOne('teacher',{"name":"小红"},function(err,result){
        if(err){
            console.log('插入失败');
            return ;
        }
        res.send('插入成功');

    });
})
// app.get('/du',function(req,res){
//     //这个页面现在接受一个page参数
//     var page =parseInt(req.query.page);//express中读取get参数很简单,{"pageamout":5,"page":page}
//     db.find('teacher',{},{"pageamount":5,"page":page},function(err,result){
//         if(err){
//             console.log(err);
//         }
//         res.send(result);
//         console.log(result.length);
//     });
// })

// app.get('/shan?id',function(req,res){
//     var id = req.query.id;
//     db.deleteMany('teacher',{"restaurant_id":id},function(err,results){
//         if(err){
//             console.log('删不掉哦');
//         }
//         res.send(results);
//     })

// })

// app.get('/xiugai',function(req,res){
//     var id = req.query.id;
//     db.updateMany('teacher',{"restaurant_id":id},
//     {$set:{"name":"aaa"}}
//     ,function(err,results){
//         if(err){
//             console.log('改不掉哦');
//         }
//         res.send(results);
//     })

// })

app.listen(3000);