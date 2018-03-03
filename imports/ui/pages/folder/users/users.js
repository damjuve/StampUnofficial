import { Folders } from '../../../../api/folder/folder';
import '../../user/inviteFolder/invite.js';
import './users.css';
import './users.html';

Template.FolderUsers.onCreated(function() {
    this.subscribe('folder.details', Router.current().params.folder_id);
});

Template.FolderUsers.onRendered(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

Template.FolderUsers.events({
    'change .see-right': (e, t) => {
        
    },
    'change .stamp-right': (e, t) => {
        Meteor.call('folder.users.right', Router.current().params.folder_id, e.currentTarget.value, 'stamp', e.currentTarget.checked, (err, res) => {
            if (err)
                sAlert.error(err.reason);
            else
                sAlert.success("Droit mis à jour")
        });
    },
    'change .document-right': (e, t) => {
        Meteor.call('folder.users.right', Router.current().params.folder_id, e.currentTarget.value, 'addDocument', e.currentTarget.checked, (err, res) => {
            if (err)
                sAlert.error(err.reason);
            else
                sAlert.success("Droit mis à jour")
        });
    },
    'change .version-right': (e, t) => {
        Meteor.call('folder.users.right', Router.current().params.folder_id, e.currentTarget.value, 'addVersion', e.currentTarget.checked, (err, res) => {
            if (err)
                sAlert.error(err.reason);
            else
                sAlert.success("Droit mis à jour")
        });
    },
    'change .admin-right': (e, t) => {
        Meteor.call('folder.users.right', Router.current().params.folder_id, e.currentTarget.value, 'admin', e.currentTarget.checked, (err, res) => {
            if (err)
                sAlert.error(err.reason);
            else
                sAlert.success("Droit mis à jour")
        });
    }
});

Template.FolderUsers.helpers({
    folderName() {
        let folder = Folders.findOne(Router.current().params.folder_id);
        if (folder) {
            return folder.name;
        }
    },
    folderUsers() {
        let folder = Folders.findOne(Router.current().params.folder_id);
        if (folder) {
            return folder.users.sort((a, b) => {return a != Meteor.userId()});
        }
    },
    folderOwner() {
        let folder = Folders.findOne(Router.current().params.folder_id);
        if (folder)
            return folder.userId;
    },
    isFolderAdmin() {
        let currentFolder = Folders.findOne(Router.current().params.folder_id);
        if (currentFolder && currentFolder.users) {
            let user = currentFolder.users.find(user => user.userId == Meteor.userId());
            if (user) {
                return user.admin;
            }
        }
    }
});