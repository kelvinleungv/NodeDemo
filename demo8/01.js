//引包
var mongoose = require('mongoose');
//持久性连接数据库
mongoose.connect('mongodb://localhost/mm', { useMongoClient: true });


mongoose.Promise = global.Promise;

var Cat = mongoose.model('Cat', { name: String });

var kitty = new Cat({ name: 'Zildjian' });

//save方法
kitty.save(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('meow');
  }
});