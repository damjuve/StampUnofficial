import '/imports/ui/stylesheets/bootstrap-social.css';
import './signin.css';
import './signin.html';

Template.AccountSignin.onCreated(function () {
    let query = Router.current().params["query"];

    this.email = query.email;
});

Template.AccountSignin.helpers({
    'EmailValue': () => {
        return Template.instance().email;
    }
});

Template.AccountSignin.events({
    'submit #signin': (e, t) => {
        e.preventDefault();
        let target = e.target;
        let email = target.email.value.toLowerCase();
        let password = target.password.value;

        if (email.length == 0) {
            sAlert.error("Entrez votre adresse email");
            return false;
        }
        if (password.length == 0) {
            sAlert.error("Entrez votre mot de passe");
            return false;
        }

        Meteor.loginWithPassword(email, password, (err) => {
            if (err) {
                console.error("loginwithpassword", err);
                if (err.message == "User not found [403]")
                    sAlert.error("Cette adresse email n'est pas enregistrée");
                else
                    sAlert.error("Mot de passe incorrect");
            }
            else
                Router.go('home');
        });
    },
    'click #reset': (e, t) => {
        e.preventDefault();
        let email = $('#email')[0].value.toLowerCase();
        
        if (email.length == 0) {
            sAlert.error("Entrez votre adresse email");
            return false;
        }

        Accounts.forgotPassword({email: email}, (err) => {
            if (err) {
                console.error("forgot password ", err);
                sAlert.error("Cette adresse email n'est pas enregistrée");
            }
            else
                sAlert.info("Un lien vous a été envoyé pour modifier votre mot de passe");
        });
    },
    'click #signup': (e, t) => {
        Router.go('account.signup');
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
})
