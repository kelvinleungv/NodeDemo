//裁切图片 crop
const fs = require('fs');
const gm = require('gm');

gm('./logo.jpg').crop(141,96,152,181).write('./logo2.jpg',(err)=>{
    if(err){
        console.log(err);
    }
})