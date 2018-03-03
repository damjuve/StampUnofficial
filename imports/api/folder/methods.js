import { check } from 'meteor/check';
import { Folders } from './folder.js';
import { Spaces } from '../space/space';
import {
    createFolder,
    removeFolder,
    addFolderToFolder,
    addUserToFolder,
    updateFolderUserRight
} from './utils.js';
import { createNotif } from '../notifications/utils.js';

Meteor.methods({
    'folder.create': function(folderId, name, users) {
        if (!Meteor.userId()) return false;
        check(name, String);

        if (name.trim().length < 3)
            throw new Meteor.Error('', 'Invalid name');
        let newFolderId = createFolder(name, folderId, Meteor.userId(), users);
        return newFolderId;
    },
    'folder.remove': function(folderId) {
        if (!Meteor.userId()) return false;
        check(folderId, String);

        let folder = Folders.findOne(folderId);
        if (!folder)
            throw new Meteor.Error('', 'Folder not found');
        if (folder.userId != Meteor.userId())
            throw new Meteor.Error('', 'You are not the owner');
        removeFolder(folderId);
        return true;
    },
    'folder.invite': function(folderId, userId) {
        if (!Meteor.userId()) return false;
        check(folderId, String);
        check(userId, String);

        if (!Meteor.users.findOne(userId))
            throw new Meteor.Error('', 'User not found');
        let folder = Folders.findOne(folderId);
        if (!folder)
            throw new Meteor.Error('', 'Folder not found');
        let space = Spaces.findOne(folder.spaceId);
        if (!space)
            throw new Meteor.Error('', 'Space not found');
        if (!space.users.find(user => user.userId == userId))
            throw new Meteor.Error('', 'User not in space');
        if (folder.users.find(user => user.userId == userId))
            throw new Meteor.Error('', 'User already in folder');
        addUserToFolder(userId, folderId);
        let invitor = Meteor.users.findOne(Meteor.userId());
        createNotif("Vous avez été invité dans un nouveau dossier",
            invitor.username + " vous a invité dans '" + folder.name + "'", userId, {
            url: `/folder/${folderId}`
        });
        return true;
    },
    'folder.users.right': function(folderId, userId, right, state) {
        if (!Meteor.userId()) return false;
        check(userId, String);
        check(right, String);
        check(state, Boolean);

        let rights = ['stamp', 'addDocument', 'addVersion', 'admin'];
        if (rights.indexOf(right) == -1)
            throw new Meteor.Error('', 'Invalid right');
        
        let folder = Folders.findOne(folderId);
        if (!folder)
            throw new Meteor.Error('', 'Folder not found');
        if (folder.userId == userId && right == 'admin')
            throw new Meteor.Error('', 'You cannot remove folder owner admin right');
        let user = folder.users.find(usr => usr.userId == Meteor.userId());
        if (!user)
            throw new Meteor.Error('', 'Current user not in folder');
        if (!user.admin)
            throw new Meteor.Error('', "Can't update folder rights");
        updateFolderUserRight(folderId, userId, right, state);
    }
});