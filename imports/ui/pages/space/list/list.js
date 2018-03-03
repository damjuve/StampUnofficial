import { Spaces } from '/imports/api/space/space.js';
import '../create/create.js';
import './list.css';
import './list.html';

Template.SpaceList.onCreated(function() {
    this.subscribe('space.my');
});

Template.SpaceList.events({
    'click .details-space': (e, t) => {
        e.preventDefault();
        let space = Spaces.findOne(e.currentTarget.id);
        if (space)
            Router.go('folder.details', {folder_id: space.rootFolder});
    },
    'click .users-space': (e, t) => {
        e.preventDefault();
        e.stopPropagation();
        Router.go('space.users', {space_id: e.currentTarget.value});
    },
    'click .remove-space': (e, t) => {
        e.preventDefault();
        e.stopPropagation();
        let spaceId = e.currentTarget.value;
        bootbox.confirm({
            message: "Souhaitez vous supprimer cet espace ?", 
            buttons: {
                confirm: { label: 'Oui', className: 'btn-outline-success' },
                cancel: { label: 'Non', className: 'btn-outline-danger' }
            },
            callback: (res) => { 
                if (res) {
                    Meteor.call('space.remove', spaceId, (err, res) => {
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

Template.SpaceList.helpers({
    spaces() {
        return Spaces.find();
    }
});