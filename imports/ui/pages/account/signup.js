import { Meteor } from 'meteor/meteor';

import {
    isValidEmail,
    isValidPassword,
    isValidUsername
} from '/imports/utils/valid.js';

import '/imports/ui/stylesheets/bootstrap-social.css';
import './signin.css';
import './signup.html';

Template.AccountSignup.onCreated(function () {
    let query = Router.current().params["query"];

    this.email = query.email;
});

Template.AccountSignup.helpers({
    'EmailValue': () => {
        return Template.instance().email;
    }
});

Template.AccountSignup.events({
    'submit #signup': (e, t) => {
        e.preventDefault();
        let email = e.target.email.value.toLowerCase();
        let username = e.target.username.value;
        let password = e.target.password.value;
        let password2 = e.target.password2.value;

        if (!isValidEmail(email)) {
            sAlert.error('Entrez une adresse email valide');
            return false;
        }
        if (!isValidUsername(username)) {
            sAlert.error('Entrez un pseudo de 3 caractères ou plus');
            return false;
        }
        if (!isValidPassword(password)) {
            sAlert.error('Entrez un mot de passe de plus de 6 caractères');
            return false;
        }
        if (password != password2) {
            sAlert.error('Les mot de passes ne correspondent pas');
            return false;
        }
        Meteor.call('account.signup', email, username, password, (err) => {
            if (err) {
                if (err.reason == "Username already exists. [403]")
                    sAlert.error("Ce nom d'utilisateur existe déjà");
                else if (err.reason == "Email already exists. [403]")
                    sAlert.error("Cette adresse email est déjà enregistrée")
                else {
                    sAlert.error("Impossible de compléter l'inscription");
                    console.error("account.signup", err);
                }
            }
            else {
                sAlert.success("Inscription réussie");
                Router.go('account.signin');
            }
        });
    },
    'click #signin': (e, t) => {
        Router.go('account.signin');
    },
    'click #google': (e, t) => {
        Meteor.loginWithGoogle({}, (err) => {
            if (err) {
              console.log("ERR SIGNIN GOOGLE", err);
            } else {
              console.log("SUCCESS")
            }
        });
    },
    'click #facebook': (e, t) => {
        Meteor.loginWithFacebook({
            requestPermissions: ['user_friends', 'public_profile', 'email']
        }, (err) => {
            if (err) {
              console.log("ERROR SIGNIN FACEBOOK", err);
            } else {
              console.log("SUCCESS")
            }
        });
    }
});