import './contact.css';
import './contact.html';

import {
    isValidEmail
} from '/imports/utils/valid.js';

Template.PublicContact.onRendered(function() {
    $('#wisiwig-contact').summernote({
        minHeight: 100,
        toolbar: [
            ['font', ['fontsize']],
            ['decoration', ['bold', 'italic', 'underline', 'color']],
            ['list', ['ol', 'ul', 'paragraph']],
            ['insert', ['hr', 'link']],
        ],
        disableDragAndDrop: true,
        placeholder: "Votre commentaire..."
    });
});

Template.PublicContact.onDestroyed(function() {
    $('#wisiwig-contact').summernote('destroy');
});

Template.PublicContact.events({
    'submit #contact': (e, t) => {
        e.preventDefault();
        let target = e.target;
        let email = target.email.value.toLowerCase();
        let message = $('#wisiwig-contact').summernote('code');
        
        if (!isValidEmail(email)) {
            sAlert.error('Entrez une adresse email valide');
            return false;
        }
        if (message.length == 0) {
            sAlert.error('Entrez un message');
            return false;
        }

        Meteor.call('public.contact.sendMessage', email, message, (err) => {
            if (err)
                console.log("ERROR", err);
            else {
                sAlert.success('Merci, votre message a bien été envoyé');
            }
        });
    }
});