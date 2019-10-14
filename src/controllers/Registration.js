const core = require('gls-core-service');
const BasicController = core.controllers.Basic;
const Logger = core.utils.Logger;

class Registration extends BasicController {
    constructor({ smsGate, smsSecondCheck, connector }) {
        super({ connector });

        smsGate.on('incoming', this.incomingSms.bind(this));
        smsSecondCheck.on('recentList', this.recentSmsList.bind(this));
    }

    async incomingSms(phone) {
        await this.callService('registration', 'incomingSms', { phone });
    }

    async recentSmsList(list) {
        await this.callService('registration', 'recentSmsList', { list });
    }

    async callService(...args) {
        try {
            await super.callService(...args);
        } catch (error) {
            Logger.warn(`Cant send data to registration-service - ${error}`);
        }
    }
}

module.exports = Registration;
