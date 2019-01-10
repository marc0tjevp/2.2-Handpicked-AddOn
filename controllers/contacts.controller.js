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

let mock = (req, res) => {

    let email = req.params.email || ''

    let result = {
        "company": {
            "name": "Avans Hogeschool",
            "domains": [
                "avans.nl",
                "student.avans.nl"
            ]
        },
        "contacts": [
            {
                "email": "rschellius@avans.nl",
                "name": "Robin Schellius"
            },
            {
                "email": "gdevaan@avans.nl",
                "name": "Gitta de Vaan"
            }
        ]
    }

    res.status(200).json({
        query: email,
        result,
    }).end()

}

module.exports = {
    get,
    mock
}