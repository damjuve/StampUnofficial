import { Versions } from './version.js';
import { Files } from '../file/file.js';
import { Folders } from '../folder/folder.js';
import { Documents } from '../document/document.js';
import { createNotif } from '../notifications/utils.js';

export const createVersion = function(docId, description, fileId, userId) {
    let versionId = Versions.insert({
        userId: userId,
        fileId: fileId,
        docId: docId,
        description: description,
        date: Date.now(),
        comments: []
    });
    Files.update(fileId, {
        $set: {temporary: false}
    });
    return versionId;
};

export const removeVersion = function(versionId) {
    let version = Versions.findOne(versionId);
    if (version) {
        Files.remove({_id: version.fileId});
        Versions.remove({_id: versionId});
        return true;
    }
    return false;
};

export const addCommentToVersion = function(comment, versionId, userId) {
    let version = Versions.findOne(versionId);
    if (version.comments.find((comment) => comment.userId == userId)) {
        Versions.update({
            _id: versionId,
            'comments.userId': userId
        }, {
            $set: {
                'comments.$.comment': comment
            }
        });
    }
    else {
        Versions.update(versionId, {
            $push: {comments: {
                userId: userId,
                comment: comment,
                date: Date.now()
            }}
        })
    }
};

export const updateUserviewToVersion = function(versionId, userId) {
    let version = Versions.findOne(versionId);
    if (!(version.comments.find((comment) => comment.userId == userId))) {
        Versions.update(versionId, {
            $push: {comments: {
                userId: userId,
                date: Date.now()
            }}
        })
    }
    
};

export const updateUservoteToVersion = function(versionId, vote, userId) {
    let version = Versions.findOne(versionId);
    let doc = Documents.findOne(version.docId);
    let folder = Folders.findOne(doc.folderId);
    let voter = Meteor.users.findOne(userId);
    if (version.comments.find((comment) => comment.userId == userId)) {
        Versions.update({
            _id: versionId,
            'comments.userId': userId
        }, {
            $set: {
                'comments.$.accepted': vote
            }
        });
        folder.users.forEach((user) => {
            if (user.userId != userId) {
                createNotif("Un vote a été modifié sur une version",
                    voter.username + " a modifié son vote sur '" + doc.name + "'", user.userId, {
                    url: `/folder/${doc.folderId}/doc/${version.docId}`
                });
            }
        });
    }
    else {
        Versions.update(versionId, {
            $push: {comments: {
                userId: userId,
                accepted: vote,
                date: Date.now()
            }}
        });
        folder.users.forEach((user) => {
            if (user.userId != userId) {
                createNotif("Un vote a été ajouté à une version",
                    voter.username + " a voté sur '" + doc.name + "'", user.userId, {
                    url: `/folder/${doc.folderId}/doc/${version.docId}`
                });
            }
        });
    }
};