import './account.js';
import './private.js';
import './public.js';

import '/imports/ui/pages/notfound/notfound.js';
import '/imports/ui/layouts/private/private.js';

/* ** Configuration ** */

Router.configure({
    notFoundTemplate: 'notFound'
});

/* ** Hooks ** */

/* 
** When logged client access account pages
** Redirect to home
** Only account pages
*/
Router.onBeforeAction(function () {
    if (Meteor.userId())
        this.redirect('home');
    this.next();
},
{
    only: ['account.signup', 'account.signin', 'account.reset', 'account.invite', 'account.confirm']
});

/* 
** When unlogged client access private pages
** Redirect to login
** Except public pagess
** Save original target in session
*/
Router.onBeforeAction(function () {
    if (!Meteor.userId()) {
        Session.set('url_target', {
            url: this.url
        });
        this.redirect('account.signin');
        this.next();
    }
    else {
      this.next();
    }
},
{
    except: ['home',
            'account.signup', 'account.signin', 'account.reset', 'account.invite', 'account.confirm',
            'public.welcome', 'public.faq', 'public.contact', 'public.versions']
});

/* ** Generic routes ** */
Router.route('/', {
    name: 'home',
    onBeforeAction: function() {
        if (Meteor.userId()) {
            import '/imports/ui/layouts/private/private.js';
            import '/imports/ui/pages/space/list/list.js';
        }
        else {
            import '/imports/ui/layouts/public/public.js';
            import '/imports/ui/pages/public/welcome/welcome.js';    
        }
        this.next();
    },
    action: function() {
        if (Meteor.userId()) {
            this.layout('LayoutPrivate');
            this.render('SpaceList');
        }
        else {
            this.layout('LayoutPublic');
            this.render('PublicWelcome');
        }
    }
});
