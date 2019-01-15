const request = require('../utils/request.util').doRequest
const Company = require('../models/company.schema').Company


let post = (req, res) => {

    let domain = req.body.domain || ''
    let companyId = req.body.companyid || ''
    let email = req.body.email || ''

    if (domain == '' || companyId == '' || email == '') {
        res.status(412).send({
            "Domain Controller": "Please provide parameters domain, companyId, email"
        })
        return;
    }

    request('get', 'http://handpicked.post-tech.nl:5000/api/Contacts?email=' + email, {}, (result) => {

    Company.findOne({
        companyId: companyId
    }, (err, c) => {

        if (c && c.domains) {

            domain = req.body.domain;

            if (!c.domains.includes(req.body.domain)) {
                c.domains.push(req.body.domain);
                c.save();
            }
            res.status(200).json(c).end();
            return;
        }

        if(companyId != result.company.companyId){
            message = {
                message: "Contacts Controller : Invalid company id " + req.body.companyid
            };
            res.status(200).json(message).end();
            return;
        }

        if (!result.company.companyId) {
            console.log(result.company);
            message = {
                message: "Contacts Controller : No Company found for " + req.body.companyid
            };
            res.status(200).json(message).end();
            return;
        }

        if (err) {
            res.status(200).json(err).end()
            return;
        }

        c = new Company({
            companyId: req.body.companyid,
            domains: [req.body.domain]
        });
        c.save();

        res.status(200).json(c).end();
        return;
    })
})

}
module.exports = {
    post
}