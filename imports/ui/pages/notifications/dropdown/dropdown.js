import { Notifications } from '/imports/api/notifications/notifications';
import './dropdown.css';
import './dropdown.html';

Template.NotifList.onCreated(function() {
    this.subscribe('notifications.my');
});

Template.NotifList.onRendered(function() {
    $('[data-toggle="dropdown"]').tooltip();
    $('#notifsDropdown').on('hidden.bs.dropdown', () => {
        Meteor.call('notifs.update', (err, res) => {
            if (err)
                console.log('Err update notifs : ', err);
        });
    });
});

Template.NotifList.events({
    'click #goNotif': (e, t) => {
        Router.go('/notifications');
    }
});

Template.NotifList.helpers({
    notifications() {
        return Notifications.find({userId: Meteor.userId()}, {sort: {date: -1}}).fetch();
    },
    nbNewNotifs() {
        return Notifications.find({userId: Meteor.userId(), seen: false}).fetch().length;
    },
    isNewNotif(notif) {
        if (!notif.seen)
            return "red-border";
    }
});