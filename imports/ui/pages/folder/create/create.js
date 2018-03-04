import { Folders } from '/imports/api/folder/folder.js';
import { Spaces } from '/imports/api/space/space.js';
import './create.css';
import './create.html';

Template.FolderCreate.onCreated(function() {
    this.selectedUsers = new ReactiveVar([]);
});

Template.FolderCreate.onRendered(function() {
    $('[data-toggle="tooltip"]').tooltip();
    $('.select-users-folder').select2({language: "fr"});
    $('.select-users-folder').on('select2:select', (e) => {
        let users = this.selectedUsers.get();
        users.push({
            userId: e.params.data.id,
            read: true,
            addDocument: false,
            addVersion: false,
            stamp: false,
            admin: false
        });
        this.selectedUsers.set(users);
    });
    $('.select-users-folder').on('select2:unselect', (e) => {
        let users = this.selectedUsers.get();
        let idx = users.findIndex(user => user.userId == e.params.data.id);
        users.splice(idx, 1);
        this.selectedUsers.set(users);
    });
});

Template.FolderCreate.events({
    'click #createFolder': (e, t) => {
        t.$('#namefolder').val("");
        $('.select-users-folder').val(null).trigger('change');
        t.selectedUsers.set([]);
    },
    'submit #create': (e, t) => {
        e.preventDefault();
        let target = e.target;
        let name = target.namefolder.value;
        let users = t.selectedUsers.get();
        if (name.trim().length < 3) {
            return sAlert.error("Entrez un nom de plus de 3 caractères")
        }
        Meteor.call('folder.create', Router.current().params.folder_id, name, users, (err, res) => {
            if (err) {
                console.log('err create', err);
                sAlert.error(err.reason);
            }
            else {
                $('#folderModal').modal('hide');
                sAlert.success('Dossier créé avec succès');
            }
        });
    },
    'change .see-right': (e, t) => {
        let users = t.selectedUsers.get();
        let user = users.find(user => user.userId == e.currentTarget.value);
        user.read = e.currentTarget.checked;
        t.selectedUsers.set(users);
    },
    'change .stamp-right': (e, t) => {
        let users = t.selectedUsers.get();
        let user = users.find(user => user.userId == e.currentTarget.value);
        user.stamp = e.currentTarget.checked;
        t.selectedUsers.set(users);
    },
    'change .document-right': (e, t) => {
        let users = t.selectedUsers.get();
        let user = users.find(user => user.userId == e.currentTarget.value);
        user.addDocument = e.currentTarget.checked;
        t.selectedUsers.set(users);
    },
    'change .version-right': (e, t) => {
        let users = t.selectedUsers.get();
        let user = users.find(user => user.userId == e.currentTarget.value);
        user.addVersion = e.currentTarget.checked;
        t.selectedUsers.set(users);
    },
    'change .admin-right': (e, t) => {
        let users = t.selectedUsers.get();
        let user = users.find(user => user.userId == e.currentTarget.value);
        user.admin = e.currentTarget.checked;
        t.selectedUsers.set(users);
    }
});

Template.FolderCreate.helpers({
    users() {
        let currentFolder = Folders.findOne(Router.current().params.folder_id);
        if (currentFolder) {
            let space = Spaces.findOne(currentFolder.spaceId);
            if (space) {
                let userIds = space.users.map(user => user.userId);
                userIds = userIds.filter(userId => userId != Meteor.userId());
                return Meteor.users.find({_id: {$in: userIds}});
            }
        }
    },
    selectedUsers() {
        return Template.instance().selectedUsers.get();
    },
    isPublicSpace() {
        let folder = Folders.findOne(Router.current().params.folder_id);
        let space = Spaces.findOne(folder.spaceId);
        if (space) {
            return space.public;
        }
        return false;
    }
});