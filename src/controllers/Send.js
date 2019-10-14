const core = require('gls-core-service');
const BasicController = core.controllers.Basic;

class Send extends BasicController {
    constructor({ smsGate, connector }) {
        super({ connector });

        this._smsGate = smsGate;
    }

    async sendPlainSms({ phone, message, lang }) {
        await this._smsGate.sendTo(phone, message, lang);
    }
}

module.exports = Send;
