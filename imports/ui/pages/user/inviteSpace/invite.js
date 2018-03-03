import './invite.css';
import './invite.html';
import { ReactiveVar } from 'meteor/reactive-var';

Template.InviteSpace.onCreated(function() {
    this.sending = new ReactiveVar(false);
});

Template.InviteSpace.events({
    'submit #invite': (e, t) => {
        e.preventDefault();
        if (t.sending.get())
            return ;
        let target = e.target;
        let email = target.email.value;
        let spaceId = Router.current().params.space_id;
        t.sending.set(true);
        Meteor.call('space.invite', spaceId, email, (err, res) => {
            t.sending.set(false);
            if (err) {
                console.log('err invite', err);
                sAlert.error(err.reason);
            }
            else {
                $('#userSpaceModal').modal('hide');
                sAlert.success('Utilisateur invité avec succès');
            }
        });
    },
    'click #inviteSpaceButton': (e, t) => {
        t.sending.set(false);
        t.$('#email').val("");
    }
});

Template.InviteSpace.helpers({
    proceeding() {
        return Template.instance().sending.get() == true;
    }
});