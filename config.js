module.exports = {
    port: process.env.BSPORT || 88,
    database: process.env.BSDB || 'mongodb://<dbuser>:<dbpass>@<server>:<port>/<db>',

    secret: process.env.BSSCT || '<secret>',
    tokenDuration: 1440 * 60 * 15,

    // mail service, used to send email confirmation and password reset mails
    mailservice: process.env.BSEML || '<mail_service_type>', // examle 'gmail'
    mailuser: process.env.BSEMLU || '<mail_address>',
    mailpass: process.env.BSEMLP || '<mail_pass>',

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
