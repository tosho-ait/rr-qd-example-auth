module.exports = {
    port: process.env.BSPORT || 88,
    database: process.env.BSDB || 'mongodb://rrqdbs:rrqdbs124pas@8.9.15.150:27017/rrqdbs',

    secret: process.env.BSSCT || '<secret>',
    tokenDuration: 1440 * 60 * 15,

    mailservice: process.env.BSEML || 'gmail',
    mailuser: process.env.BSEMLU || 'budget.simply.io@gmail.com',
    mailpass: process.env.BSEMLP || 'budgetsimply123',

    userActiveOnRegister: true,
    userVerifyMailOnRegister: true,

    userVerifyMailSubject: 'Confirm Your Email',
    userVerifyMailText: (token) =>
        'Please click on the following link to complete your registration:\n\n' +
        'http://website/#confirm?token=' + token + '\n\n',

    userPwdResetMailSubject: 'Confirm Password Reset',
    userPwdResetMailText: (token) =>
            'You are receiving this because you (or someone else) have requested the reset of the password for your website account.\n\n' +
            'Please click on the following link to complete the reset:\n\n' +
            'http://website/#recover?token=' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'

}
