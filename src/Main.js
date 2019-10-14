const core = require('gls-core-service');
const stats = core.utils.statsClient;
const BasicMain = core.services.BasicMain;
const env = require('./data/env');
const twilio = require('twilio')(env.GLS_SMS_GATE_SECRET_SID, env.GLS_TWILIO_SECRET);
const Connector = require('./services/Connector');
const SmsGate = require('./services/SmsGate');
const SmsSecondCheck = require('./services/SmsSecondCheck');
const Smsc = require('./utils/Smsc');

class Main extends BasicMain {
    constructor() {
        super(stats, env);

        const smsc = new Smsc();
        const smsGate = new SmsGate(smsc, twilio);
        const smsSecondCheck = new SmsSecondCheck(smsc, twilio);
        const connector = new Connector({ smsGate, smsSecondCheck });

        this.addNested(smsGate, smsSecondCheck, connector);
        this.defineMeta({ name: 'sms' });
    }
}

module.exports = Main;
