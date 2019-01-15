const request = require('../utils/request.util').doRequest
const Company = require('../models/company.schema').Company


let post = (req, res) => {
    if(!req.body.domain){
        res.status(412).send({DomainController: 'Missing parameter domain. '})
        return;
    }

    console.log('Domain = ' + req.body.domain);
    if(!req.body.companyid){
        res.status(412).send({DomainController: 'Missing parameter companyid. '})
        return;
    }
    console.log('companyid = ' + req.body.companyid);


    Company.findOne({
        companyId: req.body.companyid
    }, (err, c) => {

        if (c && c.domains) {

            domain = req.body.domain;

            if(!c.domains.includes(req.body.domain)){
            c.domains.push(req.body.domain);
            c.save();
        }
            res.status(200).json(c).end();
            return;
        }

        if (!c){
            message = {message: "Contacts Controller : No Company found for " + req.body.companyid};
            res.status(200).json(message).end();
            return;
        }

        if (err) {
            res.status(200).json(err).end()
            return;
        }

        c = new Company({
            companyId : req.body.companyid,
            domains : [req.body.domain]
        });
        c.save();

        res.status(200).json(c).end();
        return;
    })

}
module.exports = {
    post
}