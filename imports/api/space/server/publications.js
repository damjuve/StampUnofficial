import { check } from 'meteor/check';

import { Spaces} from '../space.js';

Meteor.publish('space.my', () => {
    if (!Meteor.userId()) return [];
    return Spaces.find({
        $or: [
            { userId: Meteor.userId() },
            { 'users.userId': Meteor.userId() }
        ]
    });
});

Meteor.publish('space.details', (spaceId) => {
    check(spaceId, String);
    if (!Meteor.userId()) return [];
    let space = Spaces.findOne(spaceId);
    if (space) { 
        let userIds = space.users.map(user => user.userId);
        let users = Meteor.users.find({_id: {$in: userIds}});
        return [Spaces.find({_id: spaceId}), users];
    }
    return [];
});