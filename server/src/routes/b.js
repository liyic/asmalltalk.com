const fetch = require('node-fetch')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const HttpsProxyAgent = require('https-proxy-agent');
const url = require('url');

const userAgents = [
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.12) Gecko/20070731 Ubuntu/dapper-security Firefox/1.5.0.12',
  'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Acoo Browser; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506)',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20',
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.71 Safari/537.1 LBBROWSER',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0) ,Lynx/2.8.5rel.1 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/1.2.9',
  'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)',
  'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)',
  'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:2.0b13pre) Gecko/20110307 Firefox/4.0b13pre',
  'Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; fr) Presto/2.9.168 Version/11.52',
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.12) Gecko/20070731 Ubuntu/dapper-security Firefox/1.5.0.12',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; LBBROWSER)',
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6',
  'Mozilla/5.0 (X11; U; Linux; en-US) AppleWebKit/527+ (KHTML, like Gecko, Safari/419.3) Arora/0.6',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)',
  'Opera/9.25 (Windows NT 5.1; U; en), Lynx/2.8.5rel.1 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/1.2.9',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
]

const cookie = 'Cookie:PB3_SESSION="2|1:0|10:1523104228|11:PB3_SESSION|40:djJleDo1Mi4yMjEuMTcyLjIyOTo4MDI3MjQ0Nw==|9584a5276e4f98cae3aa173da49cb10390e0c768b6f4acc72c9291dc09619f63"; V2EX_LANG=zhcn; _ga=GA1.2.1238317516.1523104237; _gid=GA1.2.958185580.1523104237'

const index = Math.floor(Math.random() * userAgents.length)
const ua = userAgents[index]
// const url1 = `https://www.v2ex.com/api/members/show.json?username=metrue`
//
const options = {
    host: '167.99.147.239',
    port: 3218,
}
const agent = new HttpsProxyAgent(options);
const opt = {
    method: 'GET',
    headers: {
        'User-Agent': ua,
    },
}

function parseBio(str) {
    const dom = new JSDOM(str);
    const items = dom.window.document.querySelectorAll('#Main .box .cell')
    console.log((new Date()).toString(), items[1].textContent); // "Hello wor
}

function print(str) {
    console.log(str)
}


function main(i) {
    console.log(i++)
const url1 = `http://localhost:5002/v1/api/users/valid\?userId\=metrue`
    fetch(url1, opt)
        .then((res) => {
            if (res.status === 200) {
            console.log('+++')
                return res.json()
            } else {
            console.log('+++ Error')
                console.log('Error', res.status)
            }
        })
        .then((data) => {
            // parseBio(data)
            console.log('+++')
            print(data)
            setTimeout(() => {
            console.log('+++')
                main(i)
            }, 1000)
        })
        .catch((e) => {
            console.log('+++')
            console.log(e)
            console.log('+++')
        })
}

try {
    main(0);
} catch (e) {
    console.log(e)
}