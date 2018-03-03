import { Spaces } from './space.js';
import {
    removeFolder,
    createRootFolder,
    addUserToRootFolder,
    addUserToFolder
} from '../folder/utils.js';
import { createNotif } from '../notifications/utils.js';
import { createInviteUser } from '../account/utils';

export const checkSpaceAccess = function(spaceId) {
    let space = Spaces.findOne(spaceId);
    if (space.public)
        return true;
    if (!Meteor.userId())
        return false;
    let user = space.users.find((u) => {return u.userId == Meteor.userId()});
    return user != undefined;
}

export const getSpaceUserIds = function(spaceId) {
    let space = Spaces.findOne(spaceId);
    return space.users.map((u) => {return u.userId});
}

export const createSpace = function(name, userId, public = false) {
    let spaceId = Spaces.insert({
        name: name,
        userId: userId,
        users: [
            {
                userId: userId,
                date: Date.now(),
                admin: true
            }
        ],
        created: Date.now(),
        public: public
    });
    let folderId = createRootFolder(name, spaceId, userId);
    Spaces.update(spaceId, {
        $set: {rootFolder: folderId}
    });
    return spaceId;
};

export const removeSpace = function(spaceId) {
    let space = Spaces.findOne(spaceId);
    if (space) {
        removeFolder(space.rootFolder);
        Spaces.remove({_id: spaceId});
        return true;
    }
    return false;
};

export const inviteEmailToSpace = function(email, spaceId) {
    let userId = Accounts.findUserByEmail(email);
    if (!userId)
        userId = createInviteUser(email, spaceId);
    else
        userId = userId._id;
    addUserToSpace(userId, spaceId);
    return userId;
};

export const addUserToSpace = function(userId, spaceId) {
    let space = Spaces.findOne(spaceId);
    let space_creator = Meteor.users.findOne(space.userId);
    createNotif("Vous avez été invité à un nouvel espace",
    space_creator.username + " vous a invité à '" + space.name + "'", userId,
    {
        url: `/`
    });
    Spaces.update(spaceId, {
        $push: {
            users: {
                userId: userId,
                date: Date.now(),
                admin: false
            }
        }
    });
    addUserToRootFolder({
        userId: userId,
        date: Date.now(),
        read: true,
        addFolder: true,
        addDocument: true,
        addVersion: true,
        stamp: true,
        admin: false
    }, space.rootFolder);
};

export const updateSpaceUserRight = function(spaceId, userId, right, state) {
    let tmp = {};
    tmp['users.$.' + right] = state;
    Spaces.update({_id: spaceId, 'users.userId': userId}, {
        $set: tmp
    });
};