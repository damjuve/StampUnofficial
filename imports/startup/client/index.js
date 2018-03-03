/* Usefull imports */
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';

/* Setup imports */
import './routes.js';
import '/imports/ui/stylesheets/style.css';

/* Startup functions */
Meteor.startup(function () {
    sAlert.config({
        effect: 'slide',
        position: 'top-right',
        timeout: 5000,
        html: false,
        onRouteClose: true,
        stack: {
            spacing: 10,
            limit: 3
        },
        offset: 0,
        beep: false,
        onClose: _.noop
    });
});

Template.registerHelper('humanDateFromNow', (date) => {
    return moment(new Date(date)).fromNow();
});
Template.registerHelper('humanDate', (date) => {
    return moment(new Date(date)).format("DD/MM/YYYY [à] HH:mm");
});
Template.registerHelper('humanTime', (date) => {
    return moment(new Date(date)).format("HH:mm");
});
Template.registerHelper('humanDateShort', (date) => {
    return moment(new Date(date)).format("DD/MM/YYYY");
});
Template.registerHelper('getUsername', (userId) => {
    let user = Meteor.users.findOne(userId);
    if (user) {
        return user.username;
    }
    return "Inconnu";
});
Template.registerHelper('getEmail', (userId) => {
    let user = Meteor.users.findOne(userId);
    if (user) {
        return user.emails[0].address;
    }
    return "Inconnu";
});

Template.registerHelper('log', (data) => {
    console.log(data);
});