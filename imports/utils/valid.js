
export const isValidEmail = function(email) {
    if (email.length == 0)
        return false;
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email));
}

export const isValidPassword = function(password) {
    if (password.length < 6)
        return false;
    return true;
}

export const isValidUsername = function(username) {
    if (username.length < 3)
        return false;
    return true;
}