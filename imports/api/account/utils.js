import { Accounts } from 'meteor/accounts-base';

export const createInviteUser = function(email, spaceId) {
    let userId = Accounts.createUser({
        username: email,
        email: email,
        profile: {
            emailNotif: false,
            emailNewsletter: false,
            servicetype: "email"
        }
    });
    sendInviteEmail(userId, spaceId);
    return userId;
};

export const createFullUser = function(username, email, password) {
    let userId = Accounts.createUser({
        username: username,
        email: email,
        password: password,
        profile: {
            emailNotif: false,
            emailNewsletter: false,
            servicetype: "email"
        }
    });
    return userId;
};

export const sendInviteEmail = function(userId, spaceId) {
    //Customiser l'email pour indiquer la source de l'invitation et le nom de l'espace
    Accounts.sendEnrollmentEmail(userId);
};

export const updateUserEmail = function(userId, email) {
    let user = Meteor.users.findOne(userId);
    if (user && user.emails[0].address != email) {
        Accounts.removeEmail(userId, user.emails[0].address);
        Accounts.addEmail(userId, email);
    }
};

export const updateUsername = function(userId, username) {
    Accounts.setUsername(userId, username);
};

export const updateUserPassword = function(userId, password) {
    Accounts.setPassword(userId, password);
};

export const updateUserEmailNotif = function (userId, state) {
    Meteor.users.update({_id: userId}, {$set: {'profile.emailNotif': state}});
}
export const updateUserEmailNewsletter = function (userId, state) {
    Meteor.users.update({_id: userId}, {$set: {'profile.emailNewsletter': state}});
}