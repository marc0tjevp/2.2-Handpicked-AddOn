let routes = require('express').Router()
let controller = require('../controllers/contacts.controller')

routes.get('/:email', controller.get)
routes.get('/mock/:email', controller.mock)

module.exports = routes