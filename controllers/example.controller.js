const request = require('../utils/request.util').doRequest

let get = (req, res) => {
    request('get', 'https://randomuser.me/api/', {}, (data) => {
        res.status(200).json(data).end()
    })
}

let post = (req, res) => {
    request('post', 'https://randomuser.me/api/', {param: "parameter"}, (data) => {
        res.status(200).json(data).end()
    })
}

module.exports = {
    get,
    post
}