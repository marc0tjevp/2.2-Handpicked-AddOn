const request = require('../utils/request.util').doRequest

let get = (req, res) => {

    let email = req.params.email || ''

    // FIXME: Get all contacts OR get contacts by email?

    // Get All companies, poc
    request('get', 'http://handpicked.post-tech.nl:5000/api/Contacts/?email=' + email, {}, (companies) => {
        res.status(200).json({
            query: email,
            companies,
        }).end()
    })

}

let post = (req,res)=>{
    //id
    //company
    //name
    //email
    //phoneNr
    //department

    request('post','http://handpicked.post-tech.nl:5000/api/Contacts',{
        "originalId": "PlaceHolderID",
        "companyId": req.companyId,
        "name": req.name,
        "email": req.email,
        "phoneNr": req.phoneNr,
        "department": req.department
    },(data) => {
        (res.status(200).json(data).end())
    })
}

let mock = (req, res) => {

    let email = req.params.email || ''

    let result = {
        "company": {
            "name": "Avans Hogeschool",
            "slack": "offtopic",
            "domains": [
                "avans.nl",
                "student.avans.nl"
            ]
        },
        "contacts": [{
                "email": "rschellius@avans.nl",
                "name": "Robin Schellius",
                "function": "Leraar",
                "telephone": "0612345678"
            },
            {
                "email": "gdevaan@avans.nl",
                "name": "Gitta de Vaan",
                "function": "Leraar",
                "telephone": "0612345678"
            }
        ],
        "deals": [{
                "name": "Project met Handpicked Agencies",
                "deadline": "17-01-2018",
                "startdate": "24-12-2017",
                "percentage": "50%"
            },
            {
                "name": "Project met CM",
                "deadline": "18-01-2018",
                "startdate": "24-12-2017",
                "percentage": "90%"

            }
        ],
    }

    res.status(200).json({
        query: email,
        result,
    }).end()

}

module.exports = {
    get,
    mock,
    post
}