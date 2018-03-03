import './create.css';
import './create.html';
import { Files } from '../../../../api/file/file';

Template.DocumentCreate.onCreated(function() {
    this.subscribe('files.my.temporary');
    this.fileId = new ReactiveVar(null);
});

Template.DocumentCreate.onRendered(function() {
    $('#wisiwig-document-create').summernote({
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

Template.DocumentCreate.onDestroyed(function() {
    $('#wisiwig-document-create').summernote('destroy');
});

Template.DocumentCreate.events({
    'click #createDocument': function(e, t) {
        t.$('#name').val("");
        $('#wisiwig-document-create').summernote('code', '');
    },
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
    'submit #create': (e, t) => {
        e.preventDefault();
        let target = e.target;
        let name = target.name.value;
        let description = $('#wisiwig-document-create').summernote('code');
        if (name.trim().length < 3) {
            return sAlert.error("Entrez un nom de plus de 3 caractères")
        }
        let fileId = t.fileId.get();
        if (fileId == null) {
            return sAlert.error("Sélectionnez un fichier");
        }
        Meteor.call('document.create', Router.current().params.folder_id, name, description, fileId, (err, res) => {
            if (err) {
                console.log('err create', err);
                sAlert.error(err.reason);
            }
            else {
                t.fileId.set(null);
                $('#documentModal').modal('hide');
                sAlert.success('Document créé avec succès');
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

Template.DocumentCreate.helpers({
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