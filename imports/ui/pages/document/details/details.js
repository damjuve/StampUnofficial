import { Documents } from '/imports/api/document/document.js';
import { Folders } from '/imports/api/folder/folder.js';
import { Versions } from '/imports/api/version/version.js';
import { Files } from '/imports/api/file/file.js';
import { Spaces } from '/imports/api/space/space.js';
import '../../version/create/create.js';
import '../../version/details/details.js';
import './details.css';
import './details.html';

Template.DocumentDetails.onCreated(function() {
    this.subscribe('folder.details', Router.current().params.folder_id);
    this.subscribe('document.details', Router.current().params.doc_id);
});

Template.DocumentDetails.onRendered(function() {
    var clipboard = new ClipboardJS('#inputBtn');
});

Template.DocumentDetails.events({
    'click #btnUrl': (e, t) => {
        let el = $('#inputUrl')[0];
        el.select();
        document.execCommand("copy");
    }
});

Template.DocumentDetails.helpers({
    getDocUrl() {
        return Router.current().url;
    },
    isPublicSpace() {
        let folder = Folders.findOne(Router.current().params.folder_id);
        let space = Spaces.findOne(folder.spaceId);
        if (space) {
            return space.public;
        }
        return false;
    },
    getNbUsers() {
        let folder = Folders.findOne(Router.current().params.folder_id);
        if (folder) {
            return folder.users.length;
        }
        return 0;
    },
    getNbVersions() {
        let doc = Documents.findOne(Router.current().params.doc_id);
        if (doc) {
            return doc.versions.length;
        }
    },
    currentDocument() {
        return Documents.findOne(Router.current().params.doc_id);
    },
    isLast(index, array) {
        return array.length == index + 1;
    },
    documentVersions() {
        let doc = Documents.findOne(Router.current().params.doc_id);
        if (doc) {
            return doc.versions.reverse();
        }
    },
    canAddVersion() {
        let parentFolder = Folders.findOne(Router.current().params.folder_id);
        if (parentFolder && parentFolder.users) {
            let user = parentFolder.users.find(user => user.userId == Meteor.userId());
            if (user) {
                return user.addVersion;
            }
        }
        return false;
    }
});