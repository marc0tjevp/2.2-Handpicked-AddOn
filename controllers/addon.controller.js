const request = require('../utils/request.util').doRequest

let get = (req, res) => {

    let email = req.params.email || ''

    // FIXME: Get all contacts OR get contacts by email?

    // Get All companies, poc
    request('get', 'http://handpicked.post-tech.nl:5000/api/Companies', {}, (companies) => {
        res.status(200).json({
            query: email,
            companies,
        }).end()
    })

}

module.exports = {
    get
}