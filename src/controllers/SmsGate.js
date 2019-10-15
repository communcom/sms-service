const core = require('cyberway-core-service');
const Basic = core.controllers.Basic;
const Logger = core.utils.Logger;

const env = require('../data/env');

const twilio = require('twilio')(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

class SmsGate extends Basic {
    constructor({ connector }) {
        super({ connector });
    }

    async sendSms({ phone, message }) {
        const from = env.GLS_TWILIO_PHONE_FROM;

        try {
            const result = await twilio.messages.create({ from, to: phone, body: message });

            // FIXME after mvp
            Logger.log(result);

            return {
                sid: result.sid,
            };
        } catch (error) {
            Logger.error('Twilio sms send error:', error);

            if (error.code === 21211) {
                throw { code: 1234, message: 'This phone number is invalid' };
            }

            throw { code: 500, message: error.message };
        }
    }
}

module.exports = SmsGate;
