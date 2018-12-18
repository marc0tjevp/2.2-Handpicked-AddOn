// Express
const express = require('express')
var app = module.exports = express();

// Configuration
const config = require('./config/config.json')
const port = process.env.PORT || config.port;

// Utils
require('./utils/database.util')
require('./utils/extension.util')

// Routing
let example_routes = require('./routes/example.routes')

app.get('/', (req, res) => res.status(200).json({"messsage": "Hello World!"}))
app.use('/example', example_routes)
app.use('*', (req, res) => res.status(404).json({"message": "Not found"}).end())

// Listen on port
var server = app.listen(port, function () {
    var port = server.address().port
    console.log("Express: Port " + port)
})
