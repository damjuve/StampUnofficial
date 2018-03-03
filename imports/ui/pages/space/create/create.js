import './create.css';
import './create.html';

Template.SpaceCreate.onCreated(function() {

});

Template.SpaceCreate.events({
    'submit #create': (e, t) => {
        e.preventDefault();
        let target = e.target;
        let name = target.name.value;
        if (name.trim().length < 3) {
            return sAlert.error("Entrez un nom de plus de 3 caractères")
        }
        Meteor.call('space.create', name, (err, res) => {
            if (err) {
                console.log('err create', err);
                sAlert.error(err.reason);
            }
            else {
                $('#spaceModal').modal('hide');
                sAlert.success('Espace créé avec succès');
                Router.go('home');
            }
        });
    }
});

Template.SpaceCreate.helpers({
    isNotSidebar() {
        let data = Template.instance().data;
        if (!data)
            return true;
        return data.position && data.position != 'sidebar';
    }
});