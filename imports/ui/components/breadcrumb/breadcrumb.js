import { ReactiveVar } from 'meteor/reactive-var';
import { Folders } from '/imports/api/folder/folder.js';
import { Documents } from '/imports/api/document/document.js';
import { Versions } from '/imports/api/version/version.js';
import './breadcrumb.css';
import './breadcrumb.html';

Template.breadcrumb.onCreated(function() {

});

Template.breadcrumb.events({

});

Template.breadcrumb.helpers({
    isNotRootFolder() {
        let folderId = Router.current().params.folder_id;
        if (folderId) {
            let folder = Folders.findOne(folderId);
            return folder && folder.parentFolder;
        }
    },
    getRootFolder() {
        let folderId = Router.current().params.folder_id;
        if (folderId) {
            let folder = Folders.findOne(folderId);
            if (folder) {
                let rootFolder = Folders.findOne(folder.parentFolder);
                return rootFolder;
            }
        }
    },
    getRootFolderId() {
        let folderId = Router.current().params.folder_id;
        if (folderId) {
            let folder = Folders.findOne(folderId);
            return folder.parentFolder;
        }
    },
    hasFolder() {
        return !!Router.current().params.folder_id;
    },
    getFolder() {
        let folderId = Router.current().params.folder_id;
        if (folderId) {
            let folder = Folders.findOne(folderId);
            return folder;
        }
    },
    getFolderId() {
        return Router.current().params.folder_id;
    },
    isFolderActive() {
        if (!Router.current().params.doc_id)
            return "active";
    },
    hasDocument() {
        return !!Router.current().params.doc_id;
    },
    getDocument() {
        let docId = Router.current().params.doc_id;
        if (docId) {
            let doc = Documents.findOne(docId);
            return doc;
        }
    },
    getDocId() {
        return Router.current().params.doc_id;
    },
    isDocActive() {
        return "active";
    }
});