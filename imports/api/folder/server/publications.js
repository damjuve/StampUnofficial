import { check } from 'meteor/check';

import { Folders } from '/imports/api/folder/folder.js';
import { Spaces } from '/imports/api/space/space.js';
import { Documents } from '/imports/api/document/document.js';
import { 
    checkSpaceAccess,
    getSpaceUserIds
} from '/imports/api/space/utils.js';

Meteor.publish('folder.details', (folderId) => {
    return [Folders.find(), Documents.find(), Meteor.users.find(), Spaces.find()];
    //TO DO
    check(folderId, String);
    let folder = Folders.findOne(folderId);
    if (!folder || !checkSpaceAccess(folder.spaceId)) return [];
    
    let folders = Folders.find({
        $or: [
            { _id: folderId },
            { parentFolder: folderId },
            { folders: folderId }
        ]
    });
    let docs = Documents.find({
        folderId: folderId
    });

    let userIds = getSpaceUserIds(folder.spaceId);
    let users = Meteor.users.find({_id: {$in: userIds}});
    let space = Spaces.find({_id: folder.spaceId});

    return [folders, docs, users, space];
});