const express = require('express');

const app = express();

const MongoClient = require('mongodb');//mongoDb模块
const assert = require('assert');//用于调试


app.get('/',(req,res)=>{
	//url就是数据库的地址，/后面表示数据库
	//加入数据库不存在，会自动新建一个数据库
	var url = 'mongodb://localhost:27017/haha';
	//连接数据库
	MongoClient.connect(url,(err,db)=>{
		//回调函数表示连接成功做的事情，db参数就是连接上数据库的实体
		assert.equal(null,err);
		console.log('connect successed');

		//插入数据
		db.collection('student').insertOne({
			"name":"哈哈",
			"age":parseInt(Math.random()*100 + 10)
		},(err,result)=>{
			if(err){
				console.log('插入失败');
				return;
			}
			//插入之后做的事情,result表示插入结果
			console.log(result);
			res.send(result);
			db.close();
		})


		
	})
})

app.listen(3000, function (req, res) {
    console.log('app is running at port 3000');
});

