import './public.css';
import './public.html';

Template.LayoutPublic.events({
    'click .btn-signup': (e, t) => {
        e.preventDefault();
        Router.go('account.signup');
    },
    'click .btn-signin': (e, t) => {
        e.preventDefault();
        Router.go('account.signin');
    },
    'click .page-welcome': (e, t) => {
        e.preventDefault();
        Router.go('home')
    },
    'click .page-versions': (e, t) => {
        e.preventDefault();
        Router.go('public.versions')
    },
    'click .page-faq': (e, t) => {
        e.preventDefault();
        Router.go('public.faq');
    },
    'click .page-contact': (e, t) => {
        e.preventDefault();
        Router.go('public.contact')
    }
})