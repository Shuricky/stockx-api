const request = require('request-promise');
const moment = require('moment');

//This one works: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'

module.exports = async (bearer, options) => {
    const { amount, variantID, currency, proxy, cookieJar, userAgent } = options;
    const expiresAt = moment().add(30, 'days').utc().format();

    const res = await request({
        uri: 'https://stockx.com/api/portfolio?a=bid',
        method: 'POST',
        headers: {
            'authority': 'stockx.com',
            'path': '/api/portfolio?a=bid',
            'scheme': 'https',
            'sec-fetch-mode': 'cors',
            'origin': 'https://stockx.com',
            'authorization': `Bearer ${bearer}`,
            'content-type': 'application/json',
            'appos': 'web',
            'x-requested-with': 'XMLHttpRequest',
            'user-agent': userAgent,
            'appversion': '0.1',
            'accept': '*/*',
            'sec-fetch-site': 'same-origin',
            'accept-language': 'en-US,en;q=0.9',
        },
        json: {
            "action": "bid",
            "PortfolioItem": {
                "localAmount": amount,
                "expiresAt": "2020-11-16T06:38:19+0000",
                "skuUuid": variantID,
                "localCurrency": "USD",
                "meta": {
                    "discountCode": "",
                    "deviceData": "{\"correlation_id\":\"4b3e83b67166473fbb0b1bc3a848960f\"}"
                }
            },
            "item": null
        },
        jar: cookieJar,
        simple: false,
        resolveWithFullResponse: true,
        proxy
    });

    if (res.statusCode !== 200){
        const e = new Error(`Status code error: ${res.statusCode}`);
        e.statusCode = res.statusCode;
        e.body = res.body;

        throw e;
    };

    return {
        id: res.body.PortfolioItem.chainId,
        //response: res.body
    };
};