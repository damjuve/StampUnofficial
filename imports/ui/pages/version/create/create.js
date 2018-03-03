import { Files } from '/imports/api/file/file.js';

import './create.css';
import './create.html';

Template.VersionCreate.onCreated(function() {
    this.subscribe('files.my.temporary');
    this.fileId = new ReactiveVar(null);
});

Template.VersionCreate.onRendered(function() {
    $('#wisiwig-version-create').summernote({
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

Template.VersionCreate.onDestroyed(function() {
    $('#wisiwig-version-crate').summernote('destroy');
});

Template.VersionCreate.events({
    'click #dropzone': function(e, t) {
        $('#fileinput').click();
    },
    'dropped #dropzone': (e, t) => {
        e.preventDefault();
        FS.Utility.eachFile(e, function(file) {
            let fsFile = new FS.File(file);
            fsFile.owner = Meteor.userId();
            fsFile.temporary = true;
            fsFile.date = Date.now();
            Files.insert(fsFile, function (err, fileObj) {
                if (err)
                    console.log(err);
                else
                    t.fileId.set(fileObj._id);
            });
        });
    },
    'change #fileinput': (e, t) => {
        FS.Utility.eachFile(e, function(file) {
            let fsFile = new FS.File(file);
            fsFile.owner = Meteor.userId();
            fsFile.temporary = true;
            fsFile.date = Date.now();
            Files.insert(fsFile, function (err, fileObj) {
                if (err)
                console.log(err);
                else
                    t.fileId.set(fileObj._id);
            });
        });
    },
    'submit #create': (e, t) => {
        e.preventDefault();
        let fileId = t.fileId.get();
        let description = $('#wisiwig-version-create').summernote('code');
        if (fileId == null) {
            return sAlert.error("Sélectionnez un fichier");
        }
        Meteor.call('version.create', Router.current().params.doc_id, description, fileId, (err, res) => {
            if (err) {
                console.log('err create', err);
                sAlert.error(err.reason);
            }
            else {
                t.fileId.set(null);
                $('#versionModal').modal('hide');
                sAlert.success('Version créée avec succès');
            }
        });
    },
    'click .remove-file': (e, t) => {
        e.preventDefault();
        let fileId = e.currentTarget.value;
        Files.remove({_id: fileId}, (err, nbRemoved) => {
            if (err)
                console.log('err remove', err);
            else
                t.fileId.set(null);
        });
    }
});

Template.VersionCreate.helpers({
    fileToUpload() {
        let fileId = Template.instance().fileId.get();
        if (fileId) {
            return Files.findOne(fileId);
        }
    },
    canUpload() {
        let fileId = Template.instance().fileId.get();
        if (!fileId)
            return "disabled";
    }
});