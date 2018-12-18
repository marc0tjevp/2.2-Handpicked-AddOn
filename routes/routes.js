let routes = require('express').Router()
let example_routes = require('./example.routes')

routes.get('/', (req, res) => res.status(200).json({"messsage": "Hello World!"}))
routes.use('/example', example_routes)
routes.use('*', (req, res) => res.status(404).json({"message": "Not found"}).end())

module.exports = routes