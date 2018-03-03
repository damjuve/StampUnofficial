import { Documents } from './document.js';
import {
    createVersion, removeVersion
} from '../version/utils.js';
import { createNotif } from '../notifications/utils.js';
import { Folders } from '../folder/folder.js';
import { Versions } from '../version/version.js';

export const createDocument = function(name, description, fileId, folderId, userId) {
    let folder = Folders.findOne(folderId);
    let docId = Documents.insert({
        userId: userId,
        folderId: folderId,
        spaceId: folder.spaceId,
        date: Date.now(),
        name: name,
        versions: []
    });
    let versionId = createVersion(docId, description, fileId, userId);
    addVersionToDocument(versionId, docId);
    return docId;
};

export const removeDocument = function(docId) {
    let doc = Documents.findOne(docId);
    if (doc) {
        doc.versions.forEach((versionId) => {
            removeVersion(versionId);
        });
        Documents.remove({_id: docId});
        return true;
    }
    return false;
};

export const addVersionToDocument = function(versionId, docId) {
    Documents.update(docId, {
        $push: {versions: versionId}
    });
    let folder = Folders.findOne({docs: docId});
    let doc = Documents.findOne(docId);
    let version = Versions.findOne(versionId);
    if (folder && doc && version) {
        let version_creator = Meteor.users.findOne(version.userId);
        if (version_creator) {
            folder.users.forEach((user) => {
                if (user.userId != version_creator._id)
                    createNotif("Une nouvelle version d'un document a été ajouté",
                    version_creator.username + " a ajouté une nouvelle version à '" + doc.name + "'", user.userId,
                    {
                        url: `/folder/${folder._id}/doc/${docId}`
                    });
            });
        }
    }
};