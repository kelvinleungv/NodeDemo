//这个模块封装了所有对数据库的常用操作
var MongoClient = require('mongodb').MongoClient
//内部函数
function _connectDB(callback){
    var url = 'mongodb://localhost:27017/haha';
    //连接数据库
    MongoClient.connect(url,(err,db)=>{
        // callback连接成功之后做的事情
        callback(err,db);
    })
}
//插入数据 
exports.insertOne = function(collectionName,json,callback){
    //连接上数据库
    _connectDB(function(err,db){
        //选择哪个集合
        db.collection(collectionName).insertOne(json,function(err,result){
            //把err,result这个参数往callback里面传
            callback(err,result);
            //关闭数据库
            db.close();
        })
    })
}

//查找数据,找到所有数据
exports.find = function(collectionName,json,C,D){
    var result = [];//结果数组
    if(arguments.length ==3){
       //那么参数C就是callback
       var callback = C;
       var skipnumber = 0;//应该省略的条数
       var limits = 0;
    }else if(arguments.length ==4){
        var callback = D;
        var args =C;
        var skipnumber = args.pageamount * args.page || 0;//应该省略的条数
        var limits = args.pageamount || 0;
        var sort = args.sort || {};//排序方式
        // console.log(skipnumber,limits);
    }else {
        throw new Error('猜猜');
        return;
    }
    _connectDB(function(err,db){
       var cursor = db.collection(collectionName).find(json).skip(skipnumber).limit(limits).sort(sort);
        cursor.each(function(err,doc){
            if(err){
                callback(err,null);
                return;
            }
            if(doc != null){
                result.push(doc);//放入结果数组
            }else{
                //遍历结束,没有更多的文档
                callback(null,result);
                db.close();
            }
        })
    })
}

//删除
exports.deleteMany = function(collectionName,json,callback){
    //连接数据库
    _connectDB(function(err,db){
        db.collection(collectionName).deleteMany(
            json,
            function(err,results){
                callback(err,results);
                db.close();
            }
             
        )
    })
}


//修改  json1是改什么人，json2是改成什么
exports.updateMany = function(collectionName,json1,json2,callback){
    _connectDB(function(err,db){
        db.collection(collectionName).updateMany({
            json1,
            json2,
            function(err,results){
                callback(err,results);
                db.close();
            }
        })
    })
}


//总数量
exports.getCount = function(collectionName,callback){
    _connectDB(function(err,db){
       db.collection(collectionName).count({}).then(function(count){
           callback(count);
        //    console.log(count);
           db.close();
       })
    })
}