import { Folders } from '/imports/api/folder/folder.js';
import { Versions, STATES } from '/imports/api/version/version.js';
import { Documents } from '/imports/api/document/document.js';
import { Files } from '/imports/api/file/file.js';
import '../../version/comment/comment.js';
import './details.css';
import './details.html';

Template.VersionDetails.onCreated(function() {
    this.imageLoaded = new ReactiveVar(false);
    this.subscribe('version.details', this.data.versionId);
    if (this.data.last) {
        //UPDATE DANS LA BASE DE LA VUE
        Meteor.call('version.userview', this.data.versionId, (err, res) => {
            if (err)
                console.log('Err update userview : ', err);
        });
    }
});

Template.VersionDetails.onRendered(function() {
    $('[data-toggle="tooltip"]').tooltip();
    $('#v' + this.data.versionId).on('shown.bs.collapse', () => {
        //UPDATE DANS LA BASE DE LA VUE
        Meteor.call('version.userview', this.data.versionId, (err, res) => {
            if (err)
                console.log('Err update userview : ', err);
        });
    });
});

Template.VersionDetails.events({
    'click .comment': (e, t) => {
        bootbox.prompt(
            "Saisissez votre commentaire",
            (comment) => {
                Meteor.call('version.comment', comment, t.data.versionId, (err, res) => {
                    if (err)
                        console.log("Comment error ", err);
                    else
                        sAlert.success('Commentaire ajouté');
                });
            }
        );
    },
    'load img': (e, t) => {
        t.imageLoaded.set(true);
    },
    'click #open-browser': (e, t) => {
        let version = Versions.findOne(t.data.versionId);
        let file = Files.findOne(version.fileId);
        window.open(file.url(), '_blank');
    },
    'click #download': (e, t) => {
        let version = Versions.findOne(t.data.versionId);
        let file = Files.findOne(version.fileId);
        downloadURI(file.url(), file.original.name);
    },
    'click .show-comment': (e, t) => {
        let userId = e.currentTarget.value;
        let version = Versions.findOne(Template.instance().data.versionId);
        if (version) {
            let comment = version.comments.find(comment => comment.userId == userId);
            if (comment)
                bootbox.alert(comment.comment);
        }
    },
    'click #stamp-up': (e, t) => {
        Meteor.call('version.uservote', t.data.versionId, true, (err, res) => {
            if (err)
                console.log('Err update uservote : ', err);
            else { 
                sAlert.success('Statut mis à jour');
                $('#versionCommentModal' + t.data.versionId).modal('show');
            }
        });
    },
    'click #stamp-down': (e, t) => {
        Meteor.call('version.uservote', t.data.versionId, false, (err, res) => {
            if (err)
                console.log('Err update uservote : ', err);
            else {
                sAlert.success('Statut mis à jour');
                $('#versionCommentModal' + t.data.versionId).modal('show');
            }
        });
    }
});

Template.VersionDetails.helpers({
    getNbAccepted() {
        let version = Versions.findOne(Template.instance().data.versionId);
        if (version) {
            let nb = 0;
            version.comments.forEach((comment) => {
                if (comment.accepted == true)
                    nb += 1;
            });
            if (nb == 0)
                return "";
            return nb + " Accepté";
        }
        return "";
    },
    getNbRefused() {
        let version = Versions.findOne(Template.instance().data.versionId);
        if (version) {
            let nb = 0;
            version.comments.forEach((comment) => {
                if (comment.accepted == false)
                    nb += 1;
            });
            if (nb == 0)
                return "";
            return nb + " Refusé";
        }
        return "";
    },
    getNbWaiting() {
        let version = Versions.findOne(Template.instance().data.versionId);
        if (version) {
            let nb = 0;
            version.comments.forEach((comment) => {
                if (comment.accepted == undefined)
                    nb += 1;
            });
            if (nb == 0)
                return "";
            return nb + " En attente";
        }
        return "";
    },
    getNbComment() {
        let version = Versions.findOne(Template.instance().data.versionId);
        if (version) {
            let nb = 0;
            version.comments.forEach((comment) => {
                if (comment.comment != undefined)
                    nb += 1;
            });
            if (nb == 0)
                return "";
            return nb + " Commentaires";
        }
        return "";
    },
    getNbNotSeen() {
        let folder = Folders.findOne(Router.current().params.folder_id);
        let version = Versions.findOne(Template.instance().data.versionId);
        if (folder && version) {
            let nb = 0;
            folder.users.forEach((user) => {
                if (!version.comments.find(c => c.userId == user.userId))
                    nb += 1;
            });
            if (nb == 0)
                return "";
            return nb + " Pas vu";
        }
        return "";
    },
    currentVersion() {
        return Versions.findOne(Template.instance().data.versionId);
    },
    getStatus(userId) {
        let version = Versions.findOne(Template.instance().data.versionId);
        if (version) {
            let userComment = version.comments.find((comment) => comment.userId == userId);
            if (!userComment) {
                return "Pas vu";
            }
            if (userComment.accepted == undefined)
                return "En attente";
            return (userComment.accepted ? "Validé" : "Refusé");
        }
    },
    getStatusBadge(userId) {
        let version = Versions.findOne(Template.instance().data.versionId);
        if (version) {
            let userComment = version.comments.find((comment) => comment.userId == userId);
            if (!userComment) {
                return "badge-secondary";
            }
            if (userComment.accepted == undefined)
                return "badge-primary";
            return (userComment.accepted ? "badge-success" : "badge-danger");
        }
    },
    hasAccepted(disabled) {
        let version = Versions.findOne(Template.instance().data.versionId);
        if (version) {
            let userComment = version.comments.find((comment) => comment.userId == Meteor.userId());
            if (!userComment || userComment.accepted == undefined)
                return (disabled ? {} : "btn-outline-success");
            if (userComment.accepted)
                return (disabled ? {disabled: "disabled"} : "btn-success");
            return (disabled ? {} : "btn-outline-success");
        }
    },
    hasRefused(disabled) {
        let version = Versions.findOne(Template.instance().data.versionId);
        if (version) {
            let userComment = version.comments.find((comment) => comment.userId == Meteor.userId());
            if (!userComment || userComment.accepted == undefined)
                return (disabled ? {} : "btn-outline-danger");
            if (userComment.accepted)
                return (disabled ? {} : "btn-outline-danger");
            return (disabled ? {disabled: "disabled"} : "btn-danger");
        }
    },
    versionFile(fileId) {
        return Files.findOne(fileId);
    },
    folderUsers() {
        let folder = Folders.findOne(Router.current().params.folder_id);
        if (folder) {
            return folder.users;
        }
    },
    last() {
        return Template.instance().data.last;
    },
    hasCommented(userId) {
        let version = Versions.findOne(Template.instance().data.versionId);
        if (version) {
            let comment = version.comments.find(comment => comment.userId == userId);
            if (comment)
                return comment.comment != undefined;
        }
    },
    imageLoaded() {
        let loaded = Template.instance().imageLoaded.get();
        return (loaded ? "visible" : "hidden");
    },
    isPDF(file) {
        return file.original.type == 'application/pdf';
    },
    canStamp() {
        let parentFolder = Folders.findOne(Router.current().params.folder_id);
        if (parentFolder && parentFolder.users) {
            let user = parentFolder.users.find(user => user.userId == Meteor.userId());
            if (user) {
                return user.stamp;
            }
        }
        return false;
    }
});

function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}