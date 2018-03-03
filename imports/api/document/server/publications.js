import { check } from 'meteor/check';

import { Documents } from '../document.js';
import { Versions } from '../../version/version.js';
import { Files } from '../../file/file.js';
import { Folders } from '../../folder/folder.js';
import { checkSpaceAccess } from '../../space/utils.js';

Meteor.publish('document.list', (folderId) => {
    return Documents.find();
    //TO DO
    check(folderId, String);
    let folder = Folders.findOne(folderId);
    if (!folder || !checkSpaceAccess(folder.spaceId))
        return [];
    return Documents.find({folderId: folderId});
});

Meteor.publish('document.details', (docId) => {
    return [Documents.find(), Versions.find(), Files.find()];
    //TO DO
    check(docId, String);
    let doc = Documents.findOne(docId);
    if (!doc || !checkSpaceAccess(doc.spaceId))
        return [];
    let docs = Documents.find({_id: docId});
    let versions = Versions.find({docId: docId});
    let filesId = versions.fetch().map((v) => {return v.fileId});
    let files = Files.find({_id: {$in: filesId}});
    return [docs, versions, files];
});