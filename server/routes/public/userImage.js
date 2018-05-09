var config = require('../../../config')
var UserImage = require('../../models/userImage')
var InPromise = require('../../util/inpromise.js')

module.exports = function (app, express) {
    var userImageRouter = express.Router()

    userImageRouter.get('/:imgId', function (req, res) {
        InPromise.mongo
            .findOne({
                schema: UserImage,
                criteria: {_id: req.params.imgId},
                orFail: true
            })
            .then(image => {
                res.contentType(image.contentType)
                res.end(image.data, 'binary')
            })
            .catch(() => {
                res.status(404).end("image not found")
            })
    })

    return userImageRouter
}