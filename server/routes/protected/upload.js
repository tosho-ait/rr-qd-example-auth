var Image = require('../../models/image')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')
var sharp = require('sharp')
var msg = require('../../res/msg')


module.exports = function (app, express) {
    let uploadRouter = express.Router()

    uploadRouter.post('/userimg', function (req, res) {
        InPromise
            .do(()=>sharp(req.file.buffer))
            .then(imo => Promise.all([imo, imo.metadata()]))
            .then(pair => {
                return pair
            })
            .then(pair => {
                pair[0] = pair[0].resize(240, 240)
                    .background({r: 255, g: 255, b: 255, alpha: 1})
                    .embed()
                return pair
            })
            .then(pair => pair[0].toBuffer())
            .then(buffer => ({
                data: buffer,
                contentType: req.file.mimetype,
                originalName: req.file.originalname,
                ownerId: req.decoded.user._id,
            }))
            .then(img => InPromise.mongo.save({entity: new Image(img)}))
            .then(saved => ({path: req.file.path, filename: req.file.filename, fileid: saved._id}))
            .then(resUtil.success(res, msg.IMAGE_SAVED))
            .catch(resUtil.error(res))
    })

    return uploadRouter
}
