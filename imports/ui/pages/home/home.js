import '../space/list/list.js';

import './home.html';

Template.home.events({
    'click #logout': (e, t) => {
        Meteor.logout();
    }
})
