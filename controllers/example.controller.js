const request = require('../utils/request.util').doRequest

let get = (req, res) => {

    // Do request to other API
    request('get', 'https://randomuser.me/api/', {}, (data) => {

        res.status(200).json({
            "message": data
        }).end()
    })

}

let post = (req, res) => {

    // Do request to other API
    request('post', 'https://randomuser.me/api/', {}, (data) => {

        res.status(200).json({
            "message": data
        }).end()
    })

}

module.exports = {
    get,
    post
}