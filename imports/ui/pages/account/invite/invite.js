import { isValidEmail } from '/imports/utils/valid.js';
import '../signin.css';
import './invite.css';
import './invite.html';

Template.AccountInvite.onCreated(function() {
    console.log(this.data);
    if (!this.data) {
        sAlert.error('Lien invalide');
        Router.go('/signup');
    }
});

Template.AccountInvite.events({
    'submit #invite': (e, t) => {
        e.preventDefault();
        let target = e.target;
        let email = target.email.value.toLowerCase();
        let username = target.username.value;
        let password = target.password.value;
        let password2 = target.password2.value;
        if (email == '' || !isValidEmail(email)) {
            sAlert.error('Entrez une adresse email valide');
            return false;
        }
        if (username.length < 3) {
            sAlert.error('Entrez un pseudo de 3 caractères ou plus');
            return false;
        }
        if (password.length < 6) {
            sAlert.error('Entrez un mot de passe de plus de 6 caractères');
            return false;
        }
        if (password != password2) {
            sAlert.error('Les mot de passes ne correspondent pas');
            return false;
        }
        let token = Router.current().params.token;
        Meteor.call('account.invitation', token, email, username, password, (err, res) => {
            if (err) {
                console.log(err);
            }
            else {
                sAlert.success("Inscription réussie");
                Meteor.loginWithPassword(email, password, (err) => {
                    if (err)
                        console.error("loginWithPassword", err);
                    else
                        Router.go('home');
                });
            }
        });
    }
});

Template.AccountInvite.helpers({
    email() {
        if (this.emails)
            return this.emails[0].address;
    }
});