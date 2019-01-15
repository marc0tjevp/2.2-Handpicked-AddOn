let routes = require('express').Router()
let controller = require('../controllers/contacts.controller')

routes.get('/:email', controller.get)
routes.get('/mock/:email', controller.mock)
routes.post('/', controller.post)

module.exports = routes