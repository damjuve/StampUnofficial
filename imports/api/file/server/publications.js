import { Files } from '../file.js';

Meteor.publish('files.my.temporary', () => {
    return Files.find({
        owner: Meteor.userId(),
        temporary: true
    });
});