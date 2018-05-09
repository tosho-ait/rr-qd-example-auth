module.exports = {
    'port': process.env.BSPORT || 88,
    'database': process.env.BSDB || 'mongodb://rrqdbs:rrqdbs124pas@8.9.15.150:27017/rrqdbs',
    'secret': process.env.BSSCT || '<secret>',
    'mailservice' : process.env.BSEML || '<mailservice>',
    'mailuser' : process.env.BSEMLU || '<mailuser>',
    'mailpass' : process.env.BSEMLP || '<mailpass>'
}
