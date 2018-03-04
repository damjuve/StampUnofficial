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
    CalendarDate(date) {
        return moment(date).format("DD/MM/YYYY");
    },
    WatchDate(date) {
        return moment(date).format("HH:mm");
    },
    versionIco() {
        if (Template.instance().data.last)
            return {badge: "primary", title: "Version la plus récente"};
        let version = Versions.findOne(Template.instance().data.versionId);
        if (version) {
            let nbOk = 0;
            let nbKo = 0;
            version.comments.forEach((comment) => {
                if (comment.accepted == true)
                    nbOk++;
                if (comment.accepted == false)
                    nbKo++;
            });
            if (nbOk != 0 && nbOk == version.comments.length)
                return {badge: "success", title: "Validée par tous"};
            if (nbKo != 0 && nbKo == version.comments.length)
                return {badge: "danger", title: "Refusée par tous"};
            return {badge: "secondary", title: "Ancienne version"};
        }
        return "";
    },
    getNbAccepted() {
        let version = Versions.findOne(Template.instance().data.versionId);
        if (version) {
            let nb = 0;
            version.comments.forEach((comment) => {
                if (comment.accepted == true)
                    nb += 1;
            });
            if (nb == 0)
                return 0;
            return nb;
        }
        return 0;
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
                return 0;
            return nb;
        }
        return 0;
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
                return 0;
            return nb;
        }
        return 0;
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
                return 0;
            return nb;
        }
        return 0;
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
                return 0;
            return nb;
        }
        return 0;
    },
    currentVersion() {
        return Versions.findOne(Template.instance().data.versionId);
    },
    getStatus(type, userId) {
        let version = Versions.findOne(Template.instance().data.versionId);
        if (version) {
            let userComment = version.comments.find((comment) => comment.userId == userId);
            if (!userComment) {
                if (type == 'badge')
                    return "badge-secondary";
                if (type == 'ico')
                    return "fa-eye-slash";
                if (type == 'title')
                    return "Pas vu";
            }
            if (userComment.accepted === undefined) {
                if (type == 'badge')
                    return "badge-primary";
                if (type == 'ico')
                    return "fa-hourglass";
                if (type == 'title')
                    return "En attente";
            }
            if (userComment.accepted) {
                if (type == 'badge')
                    return "badge-success";
                if (type == 'ico')
                    return "fa-check-circle";
                if (type == 'title')
                    return "Validé";
            }
            else {
                if (type == 'badge')
                    return "badge-danger";
                if (type == 'ico')
                    return "fa-times-circle";
                if (type == 'title')
                    return "Refusé";
            }
        }
        return "";
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
    getUserDate(userId) {
        let version = Versions.findOne(Template.instance().data.versionId);
        if (version) {
            let comment = version.comments.find(comment => comment.userId == userId);
            if (comment)
                return moment(comment.date).format('DD/MM/YYYY HH:MM');
        }
    },
    imageLoaded() {
        let loaded = Template.instance().imageLoaded.get();
        return (loaded ? "visible" : "hidden");
    },
    isPDF(file) {
        return file.original.type == 'application/pdf';
    },
    hasPreview(file) {
        let types = file.original.type.split('/');
        if (types[0] == 'image')
            return true;
        if (types[1] == 'pdf')
            return true;
        return false;
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