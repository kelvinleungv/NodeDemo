const fs = require('fs');
const gm = require('gm');

//node.js缩略图的制作

gm('./logo.jpg')//路径
    .resize(200,200,"!")//!表示强行修改
    .write('./logo2.jpg', function (err) {//写入到
        if(err){
            console.log(err);
        }
});
