import { check } from 'meteor/check';

Meteor.publish('account.invite', (token) => {
    check(token, String);
    return Meteor.users.find({'services.password.reset.token': token});
});