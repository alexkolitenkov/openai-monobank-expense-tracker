import nodemailer from 'nodemailer';

const TRANSPORTS_BY_TYPE = {
    SMTP : (config) => nodemailer.createTransport(config)
};

let INSTANCE = null;

class EmailSender {
    constructor({ mailOptions, mainUrl } = {}) {
        const { transport: transportType, transportOptions } = mailOptions || {};

        const transport = TRANSPORTS_BY_TYPE[transportType](transportOptions);

        if (!transport) throw new Error('Transport not found');

        this.transport = transport;
        this.mailOptions = mailOptions;
        this.mainUrl = mainUrl;
    }

    // for testing
    setTransport(transport) {
        this.transport = transport;
    }

    async send({ destinationEmail, subject, html = '', cc = '' }) {
        return this.#sendEmail({
            from : this.mailOptions.from,
            to   : destinationEmail,
            subject,
            html,
            cc
        });
    }

    #sendEmail = async (data) => {
        const response = await this.transport.sendMail(data);

        return response.messageId;
    };
}

export function initEmailSender(config) {
    INSTANCE = new EmailSender(config);

    return INSTANCE;
}

export function emailSender() {
    return INSTANCE;
}
