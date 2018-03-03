import { Folders } from './folder.js';
import { Spaces } from '../space/space.js';
import {
    removeDocument
} from '../document/utils.js';
import { createNotif } from '../notifications/utils.js';

export const createRootFolder = function(name, spaceId, userId) {
    let users = [{
        userId: userId,
        date: Date.now(),
        read: true,
        addFolder: true,
        addDocument: true,
        addVersion: true,
        stamp: true,
        admin: true
    }];
    return Folders.insert({
        userId: userId,
        spaceId: spaceId,
        name: name,
        folders: [],
        docs: [],
        users: users,
        date: Date.now()
    });
};

export const createFolder = function(name, folderId, userId, usersInvited) {
    let folder = Folders.findOne(folderId);
    if (!folder)
        throw new Meteor.Error('', "Root folder not found");
    let space = Spaces.findOne(folder.spaceId);
    if (!space)
        throw new Meteor.Error('', 'Space not found');
    let spaceUserIds = space.users.map(user => user.userId);
    let userTab = usersInvited.slice(0);
    if (!userTab.every(function(userInvited) { return spaceUserIds.indexOf(userInvited.userId) >= 0}))
        throw new Meteor.Error('', 'Some user are not in the space');
        userTab.push({
        userId: userId,
        read: true,
        addFolder: true,
        addDocument: true,
        addVersion: true,
        stamp: true,
        admin: true
    });
    userTab.forEach((userInvited) => {
        userInvited.date = Date.now()
    });
    let newFolderId = Folders.insert({
        userId: userId,
        parentFolder: folderId,
        spaceId: folder.spaceId,
        name: name,
        folders: [],
        docs: [],
        users: userTab,
        date: Date.now()
    });
    addFolderToFolder(folderId, newFolderId);
    let folder_creator = Meteor.users.findOne(userId);
    userTab.forEach((user) => {
        if (user.userId != userId) {
            createNotif("Vous avez été invité dans un nouveau dossier",
            folder_creator.username + " vous a invité dans '" + name + "'", user.userId, {
                url: `/folder/${newFolderId}`
            });
        }
    });
    return newFolderId;
};

export const addUserToRootFolder = function(userToAdd, folderId) {
    let folder = Folders.findOne(folderId);
    if (!folder)
        throw new Meteor.Error('', 'Folder not found');
    if (folder.users.find((user) => user.userId == userToAdd.userId))
        throw new Meteor.Error('', 'User already in folder');
    Folders.update({_id: folderId}, {
        $push: {
            users: userToAdd
        }
    });
};

export const addUserToFolder = function(userId, folderId) {
    let folder = Folders.findOne(folderId);
    if (!folder)
        throw new Meteor.Error('', 'Folder not found');
    if (folder.users.find((user) => user.userId == userId))
        throw new Meteor.Error('', 'User already in folder');
    Folders.update({_id: folderId}, {
        $push: {
            users: {
                userId: userId,
                date: Date.now(),
                read: true,
                addDocument: false,
                addVersion: false,
                stamp: false,
                admin: false
            }
        }
    });
};

export const removeFolder = function(folderId) {
    let folder = Folders.findOne(folderId);
    if (folder) {
        folder.folders.forEach((folder_id) => {
            removeFolder(folder_id);
        });
        folder.docs.forEach((docId) => {
            removeDocument(docId);
        });
        Folders.remove({_id: folderId});
        return true;
    }
    return false;
};

export const addFolderToFolder = function(folderId, newFolderId) {
    Folders.update(folderId, {
        $push: {folders: newFolderId}
    });
};

export const addDocumentToFolder = function(folderId, docId) {
    Folders.update(folderId, {
        $push: {docs: docId}
    });
};

export const updateFolderUserRight = function(folderId, userId, right, state) {
    let tmp = {};
    tmp['users.$.' + right] = state;
    Folders.update({_id: folderId, 'users.userId': userId}, {
        $set: tmp
    });
};