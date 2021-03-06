var config = require('../../../config')
var Image = require('../../models/image')
var InPromise = require('../../util/inpromise.js')
var msg = require('../../res/msg')


module.exports = function (app, express) {
    let imageRouter = express.Router()

    imageRouter.get('/:imgId', function (req, res) {
        InPromise.mongo
            .findOne({
                schema: Image,
                criteria: {_id: req.params.imgId},
                orFail: true
            })
            .then(image => {
                res.contentType(image.contentType)
                res.end(image.data, 'binary')
            })
            .catch(() => {
                res.status(404).end(msg.IMAGE_NOT_FOUND)
            })
    })

    return imageRouter
}