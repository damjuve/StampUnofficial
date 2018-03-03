import { check } from 'meteor/check';
import { Email } from 'meteor/email';

SSR.compileTemplate('notification', Assets.getText('email/notification.html'));
SSR.compileTemplate('contact', Assets.getText('email/contact.html'));
SSR.compileTemplate('newsletter', Assets.getText('email/newsletter.html'));

function getEmailHtml(template_name, data) {
    return SSR.render(template_name, data);
}

export const sendEmail = function(email_address, subject, template_name, data) {
    check([email_address, subject, template_name], [String]);

    const html = getEmailHtml(template_name, data);

    Email.send({
        to: email_address,
        from: 'dev.stamp.com@gmail.com',
        subject: subject,
        html: html
    });
};