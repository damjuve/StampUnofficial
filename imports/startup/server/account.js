/* Account */
import '/imports/api/account/methods.js';
import '/imports/api/account/server/publications.js';


ServiceConfiguration.configurations.upsert({
    service: "facebook"
}, {
    $set: {
        appId: Meteor.settings.facebook.appId,
        loginStyle: "popup",
        secret: Meteor.settings.facebook.secret
    }
});

ServiceConfiguration.configurations.upsert({
    service: "google"
}, {
    $set: {
        clientId: Meteor.settings.google.clientId,
        loginStyle: "popup",
        secret: Meteor.settings.google.secret
    }
});

Accounts.onCreateUser(function (options, user) {
    if (user.services.facebook) {
        user.username = user.services.facebook.name;
        user.emails = [{address: user.services.facebook.email, verified: true}];
        user.profile = {
            emailNotif: false,
            emailNewsletter: false,
            servicetype: 'facebook',
            servicename: user.services.facebook.name
        };
    }
    else if (user.services.google) {
        user.username = user.services.google.name;
        user.emails = [{address: user.services.google.email, verified: true}];
        user.profile = {
            emailNotif: false,
            emailNewsletter: false,
            servicetype: 'google',
            servicename: user.services.google.name
        };
    }
    else {
        user.profile = {
            emailNotif: options.profile.emailNotif,
            emailNewsletter: options.profile.emailNewsletter,
            servicetype: options.profile.servicetype
        };
    }
    return user;
});

Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl('reset-password/' + token);
};
