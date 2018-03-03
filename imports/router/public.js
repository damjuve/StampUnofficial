Router.route('/contact', {
    name: 'public.contact',
    onBeforeAction: function() {
        import '/imports/ui/pages/public/contact/contact.js';
        this.next();
    },
    action: function() {
        this.layout('LayoutPublic');
        this.render('PublicContact');
    }
});

Router.route('/faq', {
    name: 'public.faq',
    onBeforeAction: function() {
        import '/imports/ui/pages/public/faq/faq.js';
        this.next();
    },
    action: function() {
        this.layout('LayoutPublic');
        this.render('PublicFaq');
    }
});

Router.route('/welcome', {
    name: 'public.welcome',
    onBeforeAction: function() {
        import '/imports/ui/pages/public/welcome/welcome.js';
        this.next();
    },
    action: function() {
        this.layout('LayoutPublic');
        this.render('PublicWelcome');
    }
});

Router.route('/versions', {
    name: 'public.versions',
    onBeforeAction: function() {
        import '/imports/ui/pages/public/versions/versions.js';
        this.next();
    },
    action: function() {
        this.layout('LayoutPublic');
        this.render('PublicVersions');
    }
});