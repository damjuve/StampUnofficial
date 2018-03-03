import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import Isemail from 'isemail';
import {
    isValidPassword,
    isValidUsername
} from '/imports/utils/valid.js';
import { 
    createFullUser,
    updateUserEmail,
    updateUsername,
    updateUserPassword
} from './utils';

Meteor.methods({
    'account.signup': function(email, username, password) {
        check(username, String);
        check(email, String);
        check(password, String);

        if (email.length == 0 || !Isemail.validate(email))
            throw new Meteor.Error('', 'Invalid email');
        if (!isValidPassword(password))
            throw new Meteor.Error('', 'Invalid username');
        if (!isValidUsername(username))
            throw new Meteor.Error('', 'Invalid password');

        let userId = createFullUser(username, email, password);
        return true;
    },
    'account.invitation': function(token, email, username, password) {
        check(username, String);
        check(email, String);
        check(password, String);

        let user = Meteor.users.findOne({'services.password.reset.token': token});
        if (!user)
            throw new Meteor.Error('', 'Invalid token');
        if (email.length == 0 || !Isemail.validate(email))
            throw new Meteor.Error('', 'Invalid email');
        if (username.length < 3)
            throw new Meteor.Error('', 'Invalid username');
        if (password.length < 6)
            throw new Meteor.Error('', 'Invalid password');
        
        updateUserEmail(user._id, email);
        updateUsername(user._id, username);
        updateUserPassword(user._id, password);
        return true;
    }
});
