import './profile.css';
import './profile.html';

import {
    isValidEmail,
    isValidPassword,
    isValidUsername,
} from '/imports/utils/valid.js';

Template.Profile.onCreated(function () {
    this.subscribe("profile.me");
});

Template.Profile.helpers({
    getEmail() {
        let user = Meteor.user();
        if (user)
            return user.emails[0].address;
    },
    getUsername() {
        let user = Meteor.user();
        if (user)
            return user.username;        
    },
    isAccount(account) {
        let user = Meteor.user();
        if (user)
            return user.profile.servicetype == account;
    },
    getServiceName() {
        let user = Meteor.user();
        if (user)
            return user.profile.servicename;       
    },
    hasEmailNotif() {
        let user = Meteor.user();
        if (user)
            return user.profile.emailNotif;
    },
    hasEmailNewsletter() {
        let user = Meteor.user();
        if (user)
            return user.profile.emailNewsletter;
    }
})

Template.Profile.events({
    'submit #editEmail': (e, t) => {
        e.preventDefault();
        let email = e.target.email.value.toLowerCase();

        if (!isValidEmail(email)) {
            sAlert.error("Entrez une adresse email valide");
            return false;
        }

        Meteor.call('profile.update.email', email, (err) => {
            if (err) {
                sAlert.error(err.reason);
            }
            else {
                sAlert.success("Modification enregistrée");
            }
        });
    },
    'submit #editUsername': (e, t) => {
        e.preventDefault();
        let username = e.target.username.value;

        if (!isValidUsername(username)) {
            sAlert.error("Entrez un nom d'utilisateur de plus de 3 caractères");
            return false;
        }

        Meteor.call('profile.update.username', username, (err) => {
            if (err) {
                sAlert.error(err.reason);
            }
            else {
                sAlert.success("Modification enregistrée");
            }
        });
    },
    'submit #editPassword': (e, t) => {
        e.preventDefault();
        let password = e.target.password.value;
        let password2 = e.target.password2.value;

        if (!isValidPassword(password)) {
            sAlert.error("Entrez un mot de passe de plus de 6 caractères");
            return false;
        }
        if (password != password2) {
            sAlert.error("Les mots de passe ne correspondent pas");
            return false;
        }

        Meteor.call('profile.update.password', password, (err) => {
            if (err) {
                sAlert.error(err.reason);
            }
            else {
                sAlert.success("Modification enregistrée");
            }
        });
    },
    'change #checkNotif': (e, t) => {
        e.preventDefault();
        let state = e.currentTarget.checked;
        Meteor.call('profile.update.emailNotif', state, (err) => {
            if (err) {
                sAlert.error(err.reason);
            }
            else {
                sAlert.success("Les emails de notifications ont été " + (state ? "activés" : "désactivés"));
            }
        });
    },
    'change #checkNewsletter': (e, t) => {
        e.preventDefault();
        let state = e.currentTarget.checked;
        Meteor.call('profile.update.emailNewsletter', state, (err) => {
            if (err) {
                sAlert.error(err.reason);
            }
            else {
                sAlert.success("Les newsletters ont été " + (state ? "activées" : "désactivées"));
            }
        });
    }
});