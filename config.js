module.exports = {
    'port': process.env.BSPORT || 88,
    'database': process.env.BSDB || 'mongodb://rrqdbs:rrqdbs124pas@8.9.15.150:27017/rrqdbs',
    'secret': process.env.BSSCT || '<secret>',
    'mailservice' : process.env.BSEML || 'gmail',
    'mailuser' : process.env.BSEMLU || 'budget.simply.io@gmail.com',
    'mailpass' : process.env.BSEMLP || 'budgetsimply123'
}
