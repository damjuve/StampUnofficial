import { Folders } from '/imports/api/folder/folder.js';
import { Spaces } from '/imports/api/space/space.js';
import './invite.css';
import './invite.html';

Template.InviteFolder.onCreated(function() {
    this.sending = new ReactiveVar(false);
});

Template.InviteFolder.onRendered(function() {
    $('.select-user').select2({language: "fr"});
});

Template.InviteFolder.events({
    'click #inviteFolder': (e, t) => {
        $('.select-user').val(null).trigger('change');
    },
    'submit #invite': (e, t) => {
        e.preventDefault();
        if (t.sending.get())
            return ;
        let target = e.target;
        let userId = t.$('#user').val();
        let folderId = Router.current().params.folder_id;
        t.sending.set(true);
        Meteor.call('folder.invite', folderId, userId, (err, res) => {
            t.sending.set(false);
            if (err) {
                console.log('err invite', err);
                sAlert.error(err.reason);
            }
            else {
                $('#userFolderModal').modal('hide');
                sAlert.success('Utilisateur invité avec succès');
            }
        });
    }
});

Template.InviteFolder.helpers({
    proceeding() {
        return Template.instance().sending.get();
    },
    usersToInvite() {
        let folder = Folders.findOne(Router.current().params.folder_id);
        if (folder) {
            let userIdsFolder = folder.users.map(user => user.userId);
            let space = Spaces.findOne(folder.spaceId);
            if (space) {
                let userIdsSpace = space.users.map(user => user.userId);
                console.log(userIdsFolder, userIdsSpace);
                let userToInvite = userIdsSpace.filter(x => !userIdsFolder.includes(x));
                return userToInvite;
            }
        }
    }
})