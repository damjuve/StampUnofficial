import { Spaces } from '/imports/api/space/space.js';
import { Folders } from '/imports/api/folder/folder.js';
import { Documents } from '/imports/api/document/document.js';
import '../../pages/space/create/create.js';

import './sidebar.css';
import './sidebar.html';

Template.sidebar.onCreated(function () {
    this.spaceId = new ReactiveVar(null);
    this.folderId = new ReactiveVar(null);
    this.currentSpace = null;

    this.subscribe('space.my', (err) => {
        if (err) {
            console.log("Space subscription error", err);
            return ;
        }
        let space = Spaces.findOne();
        if (space) {
            this.folderId.set(space.rootFolder);
        }
    });

    this.autorun(() => {
        let routefolder = Router.current().params["folder_id"];
        if (routefolder) {
            this.subscribe('folder.details', routefolder, (err) => {
                if (err) {
                    console.log("Folder subscription error", err);
                    return ;
                }
                let folder = Folders.findOne({_id: routefolder});
                if (folder.spaceId != this.currentSpace) {
                    let space = Spaces.findOne({_id: folder.spaceId});
                    this.folderId.set(space.rootFolder);
                }
            });
        }
    })

    this.autorun(() => {
        if (this.folderId.get()) {
            this.subscribe('folder.details', this.folderId.get(), (err) => {
                if (err) {
                    console.log("Folder subscription error", err);
                    return ;
                }
                let folder = Folders.findOne({_id: this.folderId.get()});
                this.spaceId.set(folder.spaceId);
                this.currentSpace = folder.spaceId;
            });    
        }
    });
});

Template.sidebar.helpers({
    'Spaces': () => {
        return Spaces.find().fetch();
    },
    'isSelectedSpace': (spaceId) => {
        return spaceId == Template.instance().spaceId.get();
    },
    'Folders': () => {
        return Folders.find({parentFolder: Template.instance().folderId.get()}).fetch();
    },
    'Documents': () => {
        return Documents.find({folderId: Template.instance().folderId.get()}).fetch();
    },
    'isActiveFolder': (folderId) => {
        return Router.current().params["folder_id"] == folderId;
    },
    'isActiveDocument': (documentId) => {
        return Router.current().params["doc_id"] == documentId;
    }
});

Template.sidebar.events({
    'change #spaceSelect': (e, t) => {
        let spaceId = e.currentTarget.value;
        if (spaceId != t.spaceId.get()) {
            let space = Spaces.findOne(spaceId);
            t.folderId.set(space.rootFolder);
        }
    },
    'click .sideFolder': (e, t) => {
        let folderId = e.currentTarget.getAttribute('folderid');
        Router.go('folder.details', {folder_id: folderId});
    },
    'click .sideDocument': (e, t) => {
        let documentId = e.currentTarget.getAttribute('documentid');
        Router.go('document.details', {folder_id: t.folderId.get(), doc_id: documentId});
    }
});
