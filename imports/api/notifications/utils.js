import { Notifications } from './notifications.js';
import { sendEmail } from '../emails/utils.js';

export const createNotif = function(title, content, userId, data = null) {
    let user = Meteor.users.findOne(userId);
    if (user.profile.emailNotif) {
        sendEmail(user.emails[0].address, "Stamp Notification", "notification", {
            title: title,
            subtitle: content,
            url: data ? Meteor.absoluteUrl(data.url.substr(1)) : ""
        });
    }
    return Notifications.insert({
        userId: userId,
        title: title,
        content: content,
        data: data,
        seen: false,
        date: Date.now()
    });
};

export const removeNotif = function(notifId, userId) {
    return Notifications.remove({
        _id: notifId,
        userId: userId
    })
};

export const updateSeenNotif = function(userId) {
    Notifications.update({userId: userId, seen: false}, {
        $set: {seen: true},
    }, {multi: true})
};