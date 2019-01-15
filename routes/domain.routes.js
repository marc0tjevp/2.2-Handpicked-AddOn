let routes = require('express').Router()
let controller = require('../controllers/domain.controller')

routes.post('/', controller.post)

module.exports = routes