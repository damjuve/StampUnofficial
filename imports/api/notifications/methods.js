import { check } from 'meteor/check';
import { Notifications } from './notifications.js';
import {
    removeNotif,
    updateSeenNotif
} from './utils.js';

Meteor.methods({
    'notif.remove': function(notifId) {
        if (!Meteor.userId()) return false;
        check(notifId, String);

        if (!Notifications.findOne(notifId))
            throw new Meteor.Error('', 'Notif not found');
        removeNotif(notifId, Meteor.userId());
        return true;
    },
    'notifs.update': function() {
        if (!Meteor.userId()) return false;
        updateSeenNotif(Meteor.userId());
        return true;
    }
});