const Promise = require('bluebird');
const request = require('superagent');

const URL = 'www.jogossantacasa.pt';
const USER_AGENT = 'Dalvik';
const API_KEY = '552CF226909890A044483CECF8196792';
const CHANNEL = '7';
const APP_CLIENT = 'Android.Tablet';
const APP_VERSION = '1.0.2';

function req(options) {
    return new Promise((resolve, reject)=> {
        request
            .get(`https://${URL}/${options.path}`)
            .query(Object.assign({
                apiKey: API_KEY,
                channel: CHANNEL,
                appClient: APP_CLIENT,
                appVersion: APP_VERSION
            }, options.query))
            .set('User-Agent', USER_AGENT)
            .end((err, res)=> {
                if (err) return reject(err);

                const data = res.body,
                    header = data.header;

                if (header.responseSuccess === false) {
                    return reject(new Error(`${header.errorCode} - ${header.errorMessage}`))
                }

                resolve(data.body.data);
            })
    })
}

const placard = {
    fullSportsBook(cb) {
        return req({
            path: '/WebServices/SBRetailWS/FullSportsBook'
        }).nodeify(cb)
    },

    nextEvents(cb) {
        return req({
            path: '/WebServices/SBRetailWS/NextEvents'
        }).nodeify(cb)
    },

    info(cb) {
        return req({
            path: '/WebServices/ContentWS/Contents/',
            query: {categoryCode: 'ADRETAILINFOS'}
        }).nodeify(cb)
    },

    faq(cb) {
        return req({
            path: '/WebServices/ContentWS/Contents/',
            query: {categoryCode: 'ADRETAILFAQSAPP'}
        }).nodeify(cb)
    }
};

module.exports = placard;