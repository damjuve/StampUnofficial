import './comment.css';
import './comment.html';

Template.VersionComment.onCreated(function() {
});

Template.VersionComment.onRendered(function() {
    $('#wisiwig-version-comment' + this.data.versionId).summernote({
        minHeight: 150,
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

Template.VersionComment.onDestroyed(function() {
    $('#wisiwig-version-comment' + this.data.versionId).summernote('destroy');
});

Template.VersionComment.events({
    'submit #commentForm': (e, t) => {
        e.preventDefault();
        let comment = $('#wisiwig-version-comment' + t.data.versionId).summernote('code');
        Meteor.call('version.comment', comment, t.data.versionId, (err, res) => {
            if (err)
                console.log("Add comment err : ", err);
            else {
                $('#versionCommentModal' + t.data.versionId).modal('hide');
                sAlert.success("Commentaire ajouté");
            }
        });
    }
});

Template.VersionComment.helpers({
    versionId() {
        return Template.instance().data.versionId;
    }
});