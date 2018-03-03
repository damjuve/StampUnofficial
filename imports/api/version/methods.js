import { check } from 'meteor/check';
import { Versions } from './version.js';
import { Documents } from '../document/document.js';
import { Files } from '../file/file.js';
import {
    createVersion,
    removeVersion,
    addCommentToVersion,
    updateUserviewToVersion,
    updateUservoteToVersion
} from './utils.js';
import {
    addVersionToDocument
} from '../document/utils.js';

Meteor.methods({
    'version.create': function(docId, description, fileId) {
        if (!Meteor.userId()) return false;
        check(docId, String);
        check(description, String);
        check(fileId, String);

        if (!Files.findOne(fileId))
            throw new Meteor.Error('', 'File not found');
        if (!Documents.findOne(docId))
            throw new Meteor.Error('', 'Document not found');
        let versionId = createVersion(docId, description, fileId, Meteor.userId());
        addVersionToDocument(versionId, docId);
        return versionId;
    },
    'version.comment': function(comment, versionId) {
        if (!Meteor.userId()) return false;
        check(comment, String);
        check(versionId, String);

        if (!Versions.findOne(versionId))
            throw new Meteor.Error('', 'Version not found');
        addCommentToVersion(comment, versionId, Meteor.userId());
        return true;
    },
    'version.userview': function(versionId) {
        if (!Meteor.userId()) return false;
        check(versionId, String);

        if (!Versions.findOne(versionId))
            throw new Meteor.Error('', 'Version not found');
        updateUserviewToVersion(versionId, Meteor.userId());
        return true;
    },
    'version.uservote': function(versionId, vote) {
        if (!Meteor.userId()) return false;
        check(versionId, String);
        check(vote, Boolean);

        if (!Versions.findOne(versionId))
            throw new Meteor.Error('', 'Version not found');
        updateUservoteToVersion(versionId, vote, Meteor.userId());
    }
});