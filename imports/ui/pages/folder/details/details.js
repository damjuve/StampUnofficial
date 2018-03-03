import { Spaces } from '/imports/api/space/space.js';
import { Folders } from '/imports/api/folder/folder.js';
import { Documents } from '/imports/api/document/document.js';
import '../create/create.js';
import '../../document/create/create.js';
import './details.css';
import './details.html';

Template.FolderDetails.onCreated(function() {
    this.subscribe('folder.details', Router.current().params.folder_id);
});

Template.FolderDetails.events({
    'click .users-folder': (e, t) => {
        e.preventDefault();
        e.stopPropagation();
        Router.go('folder.users', {folder_id: e.currentTarget.value});
    },
    'click .details-folder': (e, t) => {
        e.preventDefault();
        let folderId = e.currentTarget.id;
        Router.go('folder.details', {folder_id: folderId});
    },
    'click .remove-folder': (e, t) => {
        e.preventDefault();
        e.stopPropagation();
        let folderId = e.currentTarget.value;
        bootbox.confirm({
            message: "Souhaitez vous supprimer ce dossier ?", 
            buttons: {
                confirm: { label: 'Oui', className: 'btn-outline-success' },
                cancel: { label: 'Non', className: 'btn-outline-danger' }
            },
            callback: (res) => { 
                if (res) {
                    Meteor.call('folder.remove', folderId, (err, res) => {
                        if (err) {
                            console.log('err remove', err);
                            sAlert.error(err.reason);
                        }
                        else
                            sAlert.success('Suppression réussie');
                    });
                }
            }
        });
    },
    'click .details-document': (e, t) => {
        e.preventDefault();
        let docId = e.currentTarget.id;
        Router.go('document.details', {folder_id: Router.current().params.folder_id, doc_id: docId});
    },
    'click .remove-document': (e, t) => {
        e.preventDefault();
        e.stopPropagation();
        let docId = e.currentTarget.value;
        bootbox.confirm({
            message: "Souhaitez vous supprimer ce document ?", 
            buttons: {
                confirm: { label: 'Oui', className: 'btn-outline-success' },
                cancel: { label: 'Non', className: 'btn-outline-danger' }
            },
            callback: (res) => { 
                if (res) {
                    Meteor.call('document.remove', docId, (err, res) => {
                        if (err) {
                            console.log('err remove', err);
                            sAlert.error(err.reason);
                        }
                        else
                            sAlert.success('Suppression réussie');
                    });
                }
            }
        });
    }
});

Template.FolderDetails.helpers({ 
    currentFolder() {
        return Folders.findOne(Router.current().params.folder_id);
    },
    folders() {
        return Folders.find({parentFolder: Router.current().params.folder_id}).fetch();
    },
    documents() {
        return Documents.find({folderId: Router.current().params.folder_id}).fetch();
    },
    isRootFolder() {
        let currentFolder = Folders.findOne(Router.current().params.folder_id);
        if (currentFolder) {
            return !currentFolder.parentFolder;
        }
    },
    folderIsEmpty() {
        let folders = Folders.find({parentFolder: Router.current().params.folder_id}).fetch();
        let docs = Documents.find({folderId: Router.current().params.folder_id}).fetch();
        return folders.length == 0 && docs.length == 0;
    },
    canAddFolder() {
        let currentFolder = Folders.findOne(Router.current().params.folder_id);
        if (currentFolder && currentFolder.users) {
            let user = currentFolder.users.find(user => user.userId == Meteor.userId());
            if (user) {
                return user.addFolder;
            }
        }
        return false;
    },
    canAddDocument() {
        let currentFolder = Folders.findOne(Router.current().params.folder_id);
        if (currentFolder && currentFolder.users) {
            let user = currentFolder.users.find(user => user.userId == Meteor.userId());
            if (user) {
                return user.addDocument;
            }
        }
        return false;
    },
    canDeleteFolder(folderId) {
        let targetFolder = Folders.findOne(folderId);
        if (targetFolder && targetFolder.userId == Meteor.userId())
            return true;
        let currentFolder = Folders.findOne(Router.current().params.folder_id);
        if (currentFolder && currentFolder.users) {
            let user = currentFolder.users.find(user => user.userId == Meteor.userId());
            if (user) {
                return user.admin;
            }
        }
        return false;
    },
    canDeleteDoc(docId) {
        let targetDoc = Documents.findOne(docId);
        if (targetDoc && targetDoc.userId == Meteor.userId())
            return true;
        let currentFolder = Folders.findOne(Router.current().params.folder_id);
        if (currentFolder && currentFolder.users) {
            let user = currentFolder.users.find(user => user.userId == Meteor.userId());
            if (user) {
                return user.admin;
            }
        }
        return false;
    }
});