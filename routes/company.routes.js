let routes = require('express').Router()
let controller = require('../controllers/company.controller')

routes.post('/', controller.post)

module.exports = routes