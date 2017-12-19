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

//初始化
// init();
// function init() {
//     _connectDB(function (err,db) {
//         if(err){
//             console.log(err);
//             return;
//         }
//         db.collection('user').createIndex(
//             {"username":1},
//             null,
//             function (err,results) {
//                 if(err){
//                     console.log(err);
//                     return;
//                 }
//                 console.log('索引建立成功')
//             }
//         )
//     })
// }


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
//查找数据,找到所有需要的数据
//args中涉及：1）分页 2）排序
exports.find=function (collectionName,json,args,callback) {
    if(arguments.length==3){
        callback=args;
        args={"page":0,"pageamount":0}
    }
    var result=[];//结果数组；
    var skip=args.page*args.pageamount;//第几页
    var limit=Number(args.pageamount);//每页多少条
    var sort=args.sort||{};
    _connectDB(function (err,db) {
        var cursor=db.collection(collectionName).find(json).limit(limit).skip(skip).sort(sort);
        cursor.each(function (err,doc) {
            if(err){
                callback(err,null);
                return;
            }
            if(doc != null){
                result.push(doc);
            }else{
                //遍历结束，没有更多的文档了
                callback(null,result);
                db.close();
            }
        })
    })
};

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