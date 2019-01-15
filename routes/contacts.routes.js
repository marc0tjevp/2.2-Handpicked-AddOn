let routes = require('express').Router()
let controller = require('../controllers/contacts.controller')

<<<<<<< HEAD
routes.get('/:email', controller.mock)
routes.get('/mock/:email', controller.get)
routes.post('/',controller.post)
=======
routes.get('/:email', controller.get)
routes.get('/mock/:email', controller.mock)
routes.post('/', controller.post)
>>>>>>> api-develop

module.exports = routes