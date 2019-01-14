let routes = require('express').Router()
let contact_routes = require('./contacts.routes')
let company_routes = require('./company.routes')

routes.get('/', (req, res) => res.status(200).json({"messsage": "Hello World!"}))
routes.use('/contact', contact_routes)
routes.use('/company', company_routes)
routes.use('*', (req, res) => res.status(404).json({"message": "Not found"}).end())

module.exports = routes