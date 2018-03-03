Router.route('/notifications', {
    name: 'notifications',
    onBeforeAction: function() {
        import '/imports/ui/pages/notifications/list/list.js';
        this.next();
    },
    action: function() {
        this.layout('LayoutPrivate');
        this.render('NotifPage');
    }
});

Router.route('/folder/:folder_id', {
    name: 'folder.details',
    onBeforeAction: function() {
        import '/imports/ui/pages/folder/details/details.js';
        this.next();
    },
    action: function() {
        this.layout('LayoutPrivate');
        this.render('FolderDetails');
    }
});

Router.route('/users/folder/:folder_id', {
    name: 'folder.users',
    onBeforeAction: function() {
        import '/imports/ui/pages/folder/users/users.js';
        this.next();
    },
    action: function() {
        this.layout('LayoutPrivate');
        this.render('FolderUsers');
    }
});

Router.route('/folder/:folder_id/doc/:doc_id', {
    name: 'document.details',
    onBeforeAction: function() {
        import '/imports/ui/pages/document/details/details.js';
        this.next();
    },
    action: function() {
        this.layout('LayoutPrivate');
        this.render('DocumentDetails');
    }
});

Router.route('/users/:space_id', {
    name: 'space.users',
    onBeforeAction: function() {
        import '/imports/ui/pages/space/users/users.js';
        this.next();
    },
    action: function() {
        this.layout('LayoutPrivate');
        this.render('SpaceUsers');
    }
});

Router.route('/profile', {
    name: 'profile',
    onBeforeAction: function() {
        import '/imports/ui/pages/profile/profile.js';
        this.next();
    },
    action: function() {
        this.layout('LayoutPrivate');
        this.render('Profile');
    }
});