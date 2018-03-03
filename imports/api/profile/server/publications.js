Meteor.publish('profile.me', () => {
    if (!Meteor.userId())
        return [];
    return Meteor.users.find({_id: Meteor.userId()}, {fields: {_id: 1, emails: 1, username: 1, profile: 1}});
});