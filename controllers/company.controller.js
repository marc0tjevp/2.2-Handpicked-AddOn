const request = require('../utils/request.util').doRequest
const Company = require('../models/company.schema').Company

let post = (req, res) => {

    let slack = req.body.slack || ''
    let companyId = req.body.companyId || ''

    if (companyId == '') {
        res.status(412).json({
            "Company Controller: ": "Please provide parameters slack and companyId"
        }).end()
        return;
    }

    Company.findOne({
        companyId: companyId
    }, (err, c) => {

        // Check for Mono errors
        if (err) {
            res.status(500).json(err).end()
        } else {

            // If company exists, edit the slack channel
            if (c && c.slack || c && c.slack == "") {
                c.slack = slack
                c.save()
                res.status(200).json(c).end()
                return;
            }

            // Else insert new company
            else {

                // New Company Object
                const company = new Company({
                    companyId: companyId,
                    slack: slack
                })

                // Save the company
                company.save(function (err) {
                    if (err) {
                        res.status(500).json(err).end()
                    } else {
                        res.status(200).json(company).end()
                    }
                })
            }
        }
    })

}

let get = (req, res) => {
    request('get', 'http://handpicked.post-tech.nl:5000/api/Companies/', {}, (data) => {

        if (data && data.companies) {

            formattedCompanies = []

            data.companies.forEach(company => {
                if (company.name != "Verwijderd bedrijf") {
                    formattedCompanies.push({
                        companyId: company.companyId,
                        originalId: company.originalId,
                        name: company.name
                    })
                }
            })

            res.status(200).json(formattedCompanies).end()
        } else {
            res.status(404).json({
                "Company Controller": "Couldn't find any companies"
            }).end()
        }

    })
}

module.exports = {
    post,
    get
}