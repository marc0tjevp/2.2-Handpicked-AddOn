let routes = require('express').Router()
let controller = require('../controllers/example.controller')

routes.get('/', controller.get)

routes.post('/', controller.post)

module.exports = routes