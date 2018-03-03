import { Spaces } from '/imports/api/space/space.js';
import { Folders } from '/imports/api/folder/folder.js';
import '../../user/inviteSpace/invite.js';
import './users.css';
import './users.html';

Template.SpaceUsers.onCreated(function() {
    this.subscribe('space.details', Router.current().params.space_id);
});

Template.SpaceUsers.onRendered(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

Template.SpaceUsers.events({
    'change .see-right': (e, t) => {
        
    },
    'change .stamp-right': (e, t) => {
        Meteor.call('space.users.right', Router.current().params.space_id, e.currentTarget.value, 'stamp', e.currentTarget.checked, (err, res) => {
            if (err)
                sAlert.error(err.reason);
            else
                sAlert.success("Droit mis à jour")
        });
    },
    'change .folder-right': (e, t) => {
        Meteor.call('space.users.right', Router.current().params.space_id, e.currentTarget.value, 'addFolder', e.currentTarget.checked, (err, res) => {
            if (err)
                sAlert.error(err.reason);
            else
                sAlert.success("Droit mis à jour")
        });
    },
    'change .document-right': (e, t) => {
        Meteor.call('space.users.right', Router.current().params.space_id, e.currentTarget.value, 'addDocument', e.currentTarget.checked, (err, res) => {
            if (err)
                sAlert.error(err.reason);
            else
                sAlert.success("Droit mis à jour")
        });
    },
    'change .version-right': (e, t) => {
        Meteor.call('space.users.right', Router.current().params.space_id, e.currentTarget.value, 'addVersion', e.currentTarget.checked, (err, res) => {
            if (err)
                sAlert.error(err.reason);
            else
                sAlert.success("Droit mis à jour")
        });
    },
    'change .admin-right': (e, t) => {
        Meteor.call('space.users.right', Router.current().params.space_id, e.currentTarget.value, 'admin', e.currentTarget.checked, (err, res) => {
            if (err)
                sAlert.error(err.reason);
            else
                sAlert.success("Droit mis à jour")
        });
    }
});

Template.SpaceUsers.helpers({
    users() {
        let folder = Folders.findOne({spaceId: Router.current().params.space_id});
        if (folder) {
            return folder.users;
        }
    },
    hasAdminRight(userId) {
        let space = Spaces.findOne(Router.current().params.space_id);
        if (space) {
            let my_user = space.users.find(user => user.userId == (userId ? userId : Meteor.userId()));
            return my_user && my_user.admin == true;
        }
    },
    spaceOwner() {
        let space = Spaces.findOne(Router.current().params.space_id);
        if (space)
            return space.userId;
    }
});