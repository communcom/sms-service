const core = require('gls-core-service');
const Logger = core.utils.Logger;
const request = require('request-promise-native');
const env = require('../data/env');
const querystring = require('querystring');

const SEND_POINT = 'https://smsc.ru/sys/send.php';
const HISTORY_POINT = 'https://smsc.ru/sys/get.php';
const DEFAULT_PARAMS = { fmt: 3, charset: 'utf-8' };

class Smsc {
    async send(phone, message) {
        const encodedMessage = encodeURIComponent(message);
        const login = env.GLS_SMS_GATE_LOGIN;
        const pass = env.GLS_SMS_GATE_PASS;
        const sender = env.GLS_SMSC_SENDER_NAME;
        const queryParams = querystring.stringify({
            login,
            psw: pass,
            sender,
            phones: phone,
            mes: encodedMessage,
            ...DEFAULT_PARAMS,
        });
        const query = `${SEND_POINT}?${queryParams}`;
        const resultString = await request.get(query);
        let result;

        try {
            result = JSON.parse(resultString);
        } catch (error) {
            throw { code: 500, message: 'Invalid sms service response' };
        }

        if (result.error) {
            const errorText = `SMSC send error - [${result.error_code}] ${result.error}`;

            Logger.error(errorText);

            throw { code: 500, message: errorText };
        } else {
            return result;
        }
    }

    async getPhonesHistory() {
        const login = env.GLS_SMS_GATE_LOGIN;
        const pass = env.GLS_SMS_GATE_PASS;
        const hour = env.GLS_SMS_SECOND_CHECK_HISTORY_HOURS + 1;
        const queryParams = querystring.stringify({
            login,
            psw: pass,
            hour,
            get_answers: 1,
            ...DEFAULT_PARAMS,
        });
        const query = `${HISTORY_POINT}?${queryParams}`;
        const rawHistory = await request.get(query);
        const history = JSON.parse(rawHistory);
        const result = [];

        if (history.error) {
            throw `SMSC history error - [${history.error_code}] ${history.error}`;
        }

        if (!Array.isArray(history)) {
            throw `Invalid SMSC history response - ${rawHistory}`;
        }

        for (let entity of history) {
            if (entity.message === '[CALL]') {
                continue;
            }

            result.push(entity.phone);
        }

        return result;
    }
}

module.exports = Smsc;
