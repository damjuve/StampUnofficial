import './wisiwig.css';
import './wisiwig.html';

/*
** Use summernote wisiwig
** https://summernote.org
*/

Template.wisiwig.onCreated(function () {
    this.text = new ReactiveVar("");
});

Template.wisiwig.onRendered(function () {
    $('#wisiwig').summernote({
        minHeight: 150,
        toolbar: [
            ['font', ['fontsize']],
            ['decoration', ['bold', 'italic', 'underline', 'color']],
            ['list', ['ol', 'ul', 'paragraph']],
            ['insert', ['hr', 'link']],
        ],
        disableDragAndDrop: true,
        placeholder: "Tapez quelquechose"
    });
});

Template.wisiwig.onDestroyed(function () {
    $('#wisiwig').summernote('destroy');
});

Template.wisiwig.events({
    'click #save': (e, t) => {
        t.text.set($('#wisiwig').summernote('code'));
    },
    'click #insert': (e, t) => {
        $('#wisiwig').summernote('code', '<p style="margin-left: 75px;"><span style="font-size: 18px; font-weight: 700; text-decoration-line: underline;">Je suis <span style="background-color: rgb(0, 0, 255); color: rgb(255, 255, 255);">inséré </span>:)</span></p>')
    }
});

Template.wisiwig.helpers({
    'getText': () => {
        return Template.instance().text.get();
    }
})