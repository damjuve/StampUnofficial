import './reset.html';

Template.AccountReset.onCreated(function () {
    this.token = Router.current().params.token;
    if (!this.token)
        Router.go("account.signin");
})

Template.AccountReset.events({
    'click #btn-reset': (e, t) => {
        let password = t.find("#input-password").value;
        let password2 = t.find("#input-password-2").value;
        
        if (password < 6) {
            sAlert.error("Entrez un mot de passe de plus de 6 caractères");
            return false;
        }
        if (password != password2) {
            sAlert.error("Les mots de passe ne correspondent pas");
            return false;
        }

        Accounts.resetPassword(t.token, password, (err, res) => {
            console.log(err, res);
        });
    }
});
