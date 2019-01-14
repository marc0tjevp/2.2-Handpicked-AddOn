let routes = require('express').Router()
let controller = require('../controllers/contacts.controller')

routes.get('/:email', controller.mock)
routes.get('/mock/:email', controller.get)
routes.post('/',controller.post)

module.exports = routes