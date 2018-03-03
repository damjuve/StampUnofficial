import { Notifications } from '/imports/api/notifications/notifications.js';
import './list.css';
import './list.html';

Template.NotifPage.onCreated(function() {
});

Template.NotifPage.events({
    'click .show-notif': (e, t) => {
        e.preventDefault();
        e.stopPropagation();
        let notif = Notifications.findOne(e.currentTarget.value);
        if (notif) {
            Router.go(notif.data.url);
        }
    },
    'click .remove-notif': (e, t) => {
        e.preventDefault();
        e.stopPropagation();
        let notifId = e.currentTarget.value;
        Meteor.call('notif.remove', notifId, (err, res) => {
            if (err)
                console.log("Err Remove Notif : ", err);
        });
    }
});

Template.NotifPage.helpers({
    notifications() {
        return Notifications.find({userId: Meteor.userId()}, {sort: {date: -1}});
    },
    isNewNotif(notif) {
        if (!notif.seen)
            return "table-info";
    }
});