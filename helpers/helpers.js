const helpers = {};

/**
 * This is a sample helper function, works with ASCII number functionality
 * @param {*} password 
 * @returns encripted password
 */
helpers.encryptPassword = async (password) => {

    let sRet = "";
    
    for (let i = 0; i < password.length; i++) {
        let c = password.charCodeAt(i);
        if (i % 2 == 0) {
            c = c - 2;
        } else {
            c = c + 3;
        }
        sRet = sRet + String.fromCharCode(c);
    }
    return sRet;
};

helpers.decryptPassword = async (password) => {
    let sRet = "";

    for (let i = 0; i < password.length; i++) {
        var c = password.charCodeAt(i);
        if (i % 2 == 0) {
            c = c + 2;
        } else {
            c = c - 3;
        }
        sRet = sRet + String.fromCharCode(c);
    }
    return sRet;
};

module.exports = helpers;
