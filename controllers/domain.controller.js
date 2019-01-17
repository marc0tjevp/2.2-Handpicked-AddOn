const request = require('../utils/request.util').doRequest
const Company = require('../models/company.schema').Company


let post = (req, res) => {

    let domain = req.body.domain || ''
    let companyId = req.body.companyid || ''

    if (domain == '' || companyId == '') {
        res.status(412).send({
            "Domain Controller": "Please provide parameters domain, companyId"
        })
        return;
    }

    Company.findOne({
        companyId: companyId
    }, (err, c) => {

        if (err) {
            res.status(200).json(err).end()
            return;
        }

        if (c && c.domains) {

            domain = req.body.domain;

            if (!c.domains.includes(req.body.domain)) {
                c.domains.push(req.body.domain);
                c.save();
            }
            res.status(200).json(c).end();
            return;
        }

        // Else
        else {

            c = new Company({
                companyId: req.body.companyid,
                domains: [req.body.domain]
            })

            c.save();

            res.status(200).json(c).end()
            return;
        }

    })
}
module.exports = {
    post
}