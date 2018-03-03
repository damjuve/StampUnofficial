/* Setup server */
import './fixtures.js';
import './account.js';
import './profile.js';
import './spaces.js';
import './folders.js';
import './documents.js';
import './files.js';
import './versions.js';
import './cron.js';
import './notifications.js';
import './public.js';

Accounts.urls.enrollAccount = (token) => {
    return Meteor.absoluteUrl('invite/' + token);
  };

Accounts.emailTemplates.from = 'Dev Stamp <dev.stamp.com@gmail.com>';

Accounts.emailTemplates.enrollAccount = {
    subject(user) {
        return 'Vous avez été invité à rejoindre Stamp';
    },
    text(user, url) {
        return 'You have been selected to participate in building a better future!'
          + ' To activate your account, simply click the link below:\n\n'
          + url;
    }
};  