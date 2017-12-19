'strict mode'
var cheerio = require('cheerio'),
    request = require('request');

var IQIYIURL = 'http://www.vipfenxiang.com/iqiyi/',
    YOUKUURL = 'http://www.vipfenxiang.com/youku/';


// '.'匹配非/n的字符，那就不用再区分是否是邮箱了
var REGEXP = /(?:vip)?(?:账号)(.+)(?:密码)(.+)/,
	REGEXP2 = /^(?!账号无法)(?:vip)?(?:账号)(.+)(?:密码)(.+)/;


module.exports = function getAccountList(type, callback) {
    if (type == 'iqiyi') {
        var URL = IQIYIURL;
    } else if (type == 'youku') {
        var URL = YOUKUURL;
        REGEXP = REGEXP2;
    }

    request(URL, function(err, res, body) {
        if (err) return callback(err);
        var $ = cheerio.load(body);
        var url = $('.content>article.excerpt').first().find('a').attr('href');
        request(url, function(err, res, body) {
            if (err) return callback(err);
            $item = cheerio.load(body);
            var accounts = [];
            $item('article.article-content p').each(function() {
                var text = $item(this).text().trim();
                if (text.match(REGEXP)) {
                    accounts = accounts.concat(text.split('\n').map(format));
                }
            });
            callback(null, accounts);
        });
    });
};

module.exports.REGEXP = REGEXP;

function format(str) {
    var obj = {};
    var match = str.match(REGEXP);
    if (match == null)
        return;
    obj.user = match[1].trim();
    obj.password = match[2].trim();
    return obj;
}
