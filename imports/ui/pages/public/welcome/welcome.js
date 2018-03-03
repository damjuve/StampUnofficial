import './welcome.css';
import './welcome.html';

Template.PublicWelcome.events({
    'click .btn-signup': (e, t) => {
        Router.go('account.signup');
    },
    'click .btn-signin': (e, t) => {
        Router.go('account.signin');
    }
});