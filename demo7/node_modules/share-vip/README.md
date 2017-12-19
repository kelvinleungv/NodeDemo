## Share-vip

Yet another script of fetching available vip accounts of ~~thunder,~~ iqiyi and youku.
It's a copycat of [thunder-vip](https://github.com/nswbmw/thunder-vip)  , but change the sources and add youku & iqiyi.
Just enjoy it.

这是一个基于node.js，通过爬目标网站数据，然后在控制台输出相关信息的小玩意

### Install

    npm i share-vip -g

### Usage

Install node.js and open your commander , and simply type one of the following messages in your commander.

```
vip iqiyi

vip youku
```
And you will receive a list of vip account.

Or add this to your JS file.

```
var vip = require('share-vip');

vip('iqiyi',function (err,accounts) {
	 console.log(accounts); 
});
```

### License

MIT
