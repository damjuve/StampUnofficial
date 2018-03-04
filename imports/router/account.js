import '/imports/ui/layouts/public/public.js';

/* Login */
Router.route('/signin', {
    name: 'account.signin',
    onBeforeAction: function() {
        import '/imports/ui/pages/account/signin.js';
        this.next();
    },
    action: function() {
        this.layout('LayoutPublic');
        this.render('AccountSignin');
    }
});

/* Sign up */
Router.route('/signup', {
    name: 'account.signup',
    onBeforeAction: function() {
        import '/imports/ui/pages/account/signup.js';
        this.next();
    },
    action: function() {
        this.layout('LayoutPublic');
        this.render('AccountSignup');
    }
});

/* Reset password (from email) */
Router.route('/reset-password/:token', {
    name: 'account.reset',
    onBeforeAction: function() {
        import '/imports/ui/pages/account/reset.js';
        this.next();
    },
    action: function() {
        console.log("RESET ROUTE");
        this.layout('LayoutPublic');
        this.render('AccountReset');
    }
});

/* Invitation page (from email) */
Router.route('/invite/:token', {
    name: 'account.invite',
    onBeforeAction: function() {
        import '/imports/ui/pages/account/invite/invite.js';
        Meteor.logout();
        this.next();
    },
    action: function() {
        this.layout('LayoutPublic');
        this.wait(this.subscribe('account.invite', this.params.token));
        if (this.ready()) {
            this.render('AccountInvite', {
                data: function() {
                    return Meteor.users.findOne()
                }
            });
        }
    }
});

/* Confirm email (from email) */
Router.route('/confirm', {
    name: 'account.confirm',
    onBeforeAction() {
        import '/imports/ui/pages/account/confirm.js';
        this.next();
    },
    action: function() {
        this.layout('LayoutPublic');
        this.render('AccountConfirm');
    }
});