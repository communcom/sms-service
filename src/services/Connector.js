const core = require('cyberway-core-service');
const BasicConnector = core.services.Connector;

const SmsGate = require('../controllers/SmsGate');

class Connector extends BasicConnector {
    constructor() {
        super();

        this._smsGate = new SmsGate({ connector: this });
    }

    async start() {
        await super.start({
            serverRoutes: {
                plainSms: {
                    handler: this._smsGate.sendSms,
                    scope: this._smsGate,
                    validation: {
                        required: ['phone', 'message'],
                        properties: {
                            phone: {
                                type: 'string',
                            },
                            message: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
        });
    }
}

module.exports = Connector;
