import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import Isemail from 'isemail';
import { 
    isValidPassword,
    isValidUsername
} from '/imports/utils/valid.js';
import { 
    updateUserEmail,
    updateUsername,
    updateUserPassword,
    updateUserEmailNotif,
    updateUserEmailNewsletter
} from '/imports/api/account/utils.js';

Meteor.methods({
    'profile.update.email': function(email) {
        check(email, String);

        if (!Meteor.userId)
            throw new Meteor.Error('', 'User not connected');
        if (email == '' || !Isemail.validate(email))
            throw new Meteor.Error('', 'Invalid email');
        updateUserEmail(Meteor.userId(), email);
        return true;
    },
    'profile.update.username': function(username) {
        check(username, String);

        if (!Meteor.userId)
            throw new Meteor.Error('', 'User not connected');
        if (!isValidUsername(username))
            throw new Meteor.Error('', 'Invalid username');
        updateUsername(Meteor.userId(), username);
        return true;
    },
    'profile.update.password': function(password) {
        check(password, String);

        if (!Meteor.userId)
            throw new Meteor.Error('', 'User not connected');
        if (!isValidPassword(password))
            throw new Meteor.Error('', 'Invalid password');
        updateUserPassword(Meteor.userId(), password);
        return true;
    },
    'profile.update.emailNotif': function(state) {
        check(state, Boolean);

        if (!Meteor.userId)
            throw new Meteor.Error('', 'User not connected');
        updateUserEmailNotif(Meteor.userId(), state);
        return true;
    },
    'profile.update.emailNewsletter': function(state) {
        check(state, Boolean);

        if (!Meteor.userId)
            throw new Meteor.Error('', 'User not connected');
        updateUserEmailNewsletter(Meteor.userId(), state);
        return true;
    }
});