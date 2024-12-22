import UseCaseBase     from '../../Base.js';
import User            from '../../../domain-model/User.js';
import SystemAction    from '../../../domain-model/SystemAction.js';
import { dumpContext } from '../utils/dumps.js';
import { emailSender } from '../../../infrastructure/email-sender/EmailSender.mjs';
import config          from '../../../config.cjs';

export class Registration extends UseCaseBase {
    static validationRules = {
        name     : [ 'required', 'string', { 'max_length': 255 } ],
        email    : [ 'required', 'email', { 'max_length': 255 } ],
        password : [ 'required', 'string', { 'length_between': [ 8, 25 ] } ]
    }

    async execute({ email, name, password }) {
        const user = await User.create({
            name,
            email,
            state : User.STATE_TYPES.PENDING,
            password
        });

        const systemAction = await SystemAction.create({
            type   : SystemAction.TYPES.USER_ACTIVATION,
            userId : user.id
        });

        const subject = 'Account Activation';
        const html = `<p>Verify your email address to complete the signup and login into your account.</p><p>This link <b>expires in N hours</b></p><p>Press <a href=${`${config.currentUrl}system-actions/${systemAction.id}`}>here</a> to proceed</p>`;

        await emailSender().send({ destinationEmail: email, subject, html });

        return {
            context : dumpContext(user, this.context.useragent)
        };
    }
}
