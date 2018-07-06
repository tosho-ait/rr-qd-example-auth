var User = require('../../models/user')

module.exports = function (app, express) {
    let usersMw = express.Router()

    usersMw.use(function (req, res, next) {
        User.find({}, function (err, all) {
            if (err) {
                res.status(418).json({message: "Internal error!"})
            } else {
                var map = all.map(user => ({_id: user._id, email: user.email}))
                map.getMail = id => map.filter(user => user._id == id)[0].email
                map.getId = mail => map.filter(user => user.email == mail)[0]._id
                req.allusers = map
                next()
            }
        })
    })

    return usersMw
}
