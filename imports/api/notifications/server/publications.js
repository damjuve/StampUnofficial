import { Notifications } from "../notifications.js";

Meteor.publish('notifications.my', () => {
    return Notifications.find({userId: Meteor.userId()});
});