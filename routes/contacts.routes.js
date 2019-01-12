let routes = require('express').Router()
let controller = require('../controllers/contacts.controller')

routes.get('/test/:email', controller.get)
routes.get('/:email', controller.mock)

module.exports = routes