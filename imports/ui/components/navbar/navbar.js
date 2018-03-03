import '../../pages/notifications/dropdown/dropdown.js';

import './navbar.css';
import './navbar.html';

Template.navbar.onRendered(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

Template.navbar.events({
    'click #logout': (e, t) => {
        Meteor.logout();
    },
    'click #profile': (e, t) => {
        Router.go('profile');
    },
    'click #sidebar-btn': (e, t) => {
        $('#sidebar').toggleClass('active');
    }
});