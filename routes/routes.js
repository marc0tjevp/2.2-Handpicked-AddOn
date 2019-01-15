let routes = require('express').Router()
let contact_routes = require('./contacts.routes')
let company_routes = require('./company.routes')
let domain_routes = require('./domain.routes')

routes.get('/', (req, res) => res.status(200).json({"messsage": "Hello World!"}))
routes.use('/contacts', contact_routes)
routes.use('/companies', company_routes)
routes.use('/domains', domain_routes)
routes.use('*', (req, res) => res.status(404).json({"message": "Not found"}).end())

module.exports = routes