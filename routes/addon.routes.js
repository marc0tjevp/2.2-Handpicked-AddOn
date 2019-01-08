let routes = require('express').Router()
let controller = require('../controllers/addon.controller')

routes.get('/:email', controller.get)

module.exports = routes