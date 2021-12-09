const cheerio = require("cheerio");
const axios = require("axios");
const express = require('express')
const cors = require('cors')
const app = express()

var domain = "https://coinmarketcap.com"
const port = 3000

var whitelist = ['http://example1.com', 'http://127.0.0.1:5500', 'http://cms.weeb.eu.org', 'https://cms.weeb.eu.org', 'https://an.weeb.eu.org', 'http://an.weeb.eu.org']
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {
            origin: true
        } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = {
            origin: false
        } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

//////////////////////////////////////////////////////////////////////////////////////////////

app.get('/crypto', cors(corsOptionsDelegate), (req, res) => {
    var data = {};
    data.name = "🪙Crypto Price Chart";
    data.coming = "from https://coinmarketcap.com/";
    data.author = "🌟healer-op";
    data.imgs = [];
    data.titles = [];
    data.symbols = [];
    data.prices = [];

    axios.get(`${domain}`).then(urlResponse => {
            const $ = cheerio.load(urlResponse.data);
            $('tbody').find('tr').each((i, element) => {

                const title = $(element).find('p.sc-1eb5slv-0.iworPT').text()
                data.titles.push(title.trim());
                const symbol = $(element).find('p.sc-1eb5slv-0.gGIpIK.coin-item-symbol').text()
                data.symbols.push(symbol.trim());
                const price = $(element).find('div.sc-131di3y-0.cLgOOr').find('a.cmc-link').find('span').text()
                data.prices.push(price.trim());
                const img = $(element).find('img.coin-logo').attr('src')
                data.imgs.push(img);

            });
        })
        .then(() => {
            res.send(data);
        })

})


//////////////////////////////////////////////////////////////////////////////////////////////

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    console.log('MADE BY HEALER')
})