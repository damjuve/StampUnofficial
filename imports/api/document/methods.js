import { check } from 'meteor/check';
import { Documents } from './document.js';
import { Folders } from '../folder/folder.js';
import { Spaces } from '../space/space';
import { Files } from '../file/file.js';
import { createNotif } from '../notifications/utils.js';
import {
    createDocument,
    removeDocument,
    addVersionToDocument
} from './utils.js';

import { 
    addDocumentToFolder
} from '../folder/utils.js';

Meteor.methods({
    'document.create': function(folderId, name, description, fileId) {
        if (!Meteor.userId()) return false;
        check(folderId, String);
        check(name, String);
        check(fileId, String);

        if (name.trim().length < 3)
            throw new Meteor.Error('', 'Invalid name');
        if (!Files.findOne(fileId))
            throw new Meteor.Error('', 'File not found');
        let folder = Folders.findOne(folderId);
        if (!folder)
            throw new Meteor.Error('', 'Folder not found');
        let docId = createDocument(name, description, fileId, folderId, Meteor.userId());
        let invitor = Meteor.users.findOne(Meteor.userId());
        addDocumentToFolder(folderId, docId);
        folder.users.forEach((user) => {
            if (user.userId != Meteor.userId()) {
                createNotif("Un nouveau document a été ajouté",
                    invitor.username + " a ajouté le document '" + name + "'", user.userId, {
                    url: `/folder/${folderId}/doc/${docId}`
                });
            }
        });
        return docId;
    },
    'document.remove': function(docId) {
        if (!Meteor.userId()) return false;
        check(docId, String);

        let doc = Documents.findOne(docId);
        if (!doc)
            throw new Meteor.Error('', 'Document not found');
        if (doc.userId != Meteor.userId())
            throw new Meteor.Error('', 'You are not the owner');
        removeDocument(docId);
        return true;
    }
});