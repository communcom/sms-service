const core = require('gls-core-service');
const BasicConnector = core.services.Connector;
const Send = require('../controllers/Send');
const Registration = require('../controllers/Registration');
const env = require('../data/env');

class Connector extends BasicConnector {
    constructor({ smsGate, smsSecondCheck }) {
        super();

        this._sendController = new Send({ smsGate, connector: this });

        new Registration({ smsGate, smsSecondCheck, connector: this });
    }

    async start() {
        await super.start({
            serverRoutes: {
                plainSms: this._sendController.sendPlainSms.bind(this._sendController),
            },
            requiredClients: {
                registration: env.GLS_REGISTRATION_CONNECT,
            },
        });
    }
}

module.exports = Connector;
