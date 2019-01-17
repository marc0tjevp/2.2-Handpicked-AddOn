const request = require('../utils/request.util').doRequest
const Company = require('../models/company.schema').Company

let post = (req, res) => {

    let slack = req.body.slack || ''
    let companyId = req.body.companyId || ''

    if (slack == '' || companyId == '') {
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
            if (c && c.slack) {
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

module.exports = {
    post
}