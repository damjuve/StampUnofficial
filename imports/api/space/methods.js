import { check } from 'meteor/check';
import { Spaces } from './space.js';
import { Accounts } from 'meteor/accounts-base';
import {
    createSpace,
    removeSpace,
    addFolderToSpace,
    inviteEmailToSpace,
    updateSpaceUserRight
} from './utils.js';
import Isemail from 'isemail';
import { createInviteUser } from '../account/utils';
import { updateFolderUserRight } from '../folder/utils.js';

Meteor.methods({
    'space.create': function(name) {
        if (!Meteor.userId()) return false;
        check(name, String);

        if (name.trim().length < 3)
            throw new Meteor.Error('', 'Invalid name');
        let spaceId = createSpace(name, Meteor.userId());
        return spaceId;
    },
    'space.remove': function(spaceId) {
        if (!Meteor.userId()) return false;
        check(spaceId, String);

        let space = Spaces.findOne(spaceId);
        if (!space)
            throw new Meteor.Error('', 'Space not found');
        if (space.userId != Meteor.userId())
            throw new Meteor.Error('', 'You are not the owner');
        removeSpace(spaceId);
        return true;
    },
    'space.invite': function(spaceId, email) {
        if (!Meteor.userId()) return false;
        check(spaceId, String);
        check(email, String);

        if (email == '' || !Isemail.validate(email))
            throw new Meteor.Error('', 'Invalid email');

        let userId = inviteEmailToSpace(email, spaceId);
        return true;
    },
    'space.users.right': function(spaceId, userId, right, state) {
        if (!Meteor.userId()) return false;
        check(spaceId, String);
        check(userId, String);
        check(right, String);
        check(state, Boolean);

        let rights = ['stamp', 'addFolder', 'addDocument', 'addVersion', 'admin'];
        if (rights.indexOf(right) == -1)
            throw new Meteor.Error('', 'Invalid right');
        
        let space = Spaces.findOne(spaceId);
        if (!space)
            throw new Meteor.Error('', 'Space not found');
        if (space.userId == userId && right == 'admin')
            throw new Meteor.Error('', 'You cannot remove space owner admin right');
        let user = space.users.find(usr => usr.userId == Meteor.userId());
        if (!user)
            throw new Meteor.Error('', 'Current user not in space');
        if (!user.admin)
            throw new Meteor.Error('', "Can't update space rights");
        if (right == 'admin')
            updateSpaceUserRight(spaceId, userId, right, state);
        updateFolderUserRight(space.rootFolder, userId, right, state);
    }
});