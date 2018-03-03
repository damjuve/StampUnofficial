import { check } from 'meteor/check';
import { sendEmail } from '../emails/utils.js';
import Isemail from 'isemail';

Meteor.methods({
    'public.contact.sendMessage': function(email, message) {
        check(email, String);
        check(message, String);

        if (email.length == 0 || !Isemail.validate(email))
            throw new Meteor.Error('', 'Invalid email');
        if (message.length == 0)
            throw new Meteor.Error('', 'Invalid message');
        sendEmail('dev.stamp.com@gmail.com', 'Contact', 'contact', {email: email, message: message});
    }
});
