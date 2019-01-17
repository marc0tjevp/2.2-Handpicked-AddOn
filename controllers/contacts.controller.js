const request = require('../utils/request.util').doRequest
const Company = require('../models/company.schema').Company

let get = (req, res) => {

    let email = req.params.email || ''

    request('get', 'http://handpicked.post-tech.nl:5000/api/Contacts?email=' + email, {}, (result) => {


        // If there's a company with this contact
        if (result && result.company) {
            Company.findOne({
                companyId: result.company.companyId
            }, (err, c) => {

                let channel = ''
                let domains = []

                if (c && c.slack) {
                    channel = c.slack
                }

                if (c && c.domains) {
                    domains = c.domains
                }

                if (err) {
                    res.status(200).json(err).end()
                    return
                }

                request('get', 'http://handpicked.post-tech.nl:5000/api/Companies/' + result.company.originalId, {}, (data) => {

                    formattedContacts = []

                    data.contacts.forEach(contact => {
                        if (contact.name != "Verwijderd contact") {
                            formattedContacts.push({
                                id: contact.contactId,
                                originalId: contact.originalId,
                                name: contact.name,
                                email: contact.email,
                                phone: contact.phoneNr,
                                department: contact.department
                            })
                        }
                    })

                    res.status(200).json({
                        company: {
                            id: result.company.companyId,
                            name: result.company.name,
                            slack: channel,
                            domains: domains,
                            originalId: result.company.originalId,
                            label: result.company.label
                        },
                        contacts: formattedContacts,
                        deals: result.deals
                    }).end()

                })
            })
        }

        // If no result
        else {

            // Try to find domain
            var domain = email.replace(/.*@/, "");

            Company.findOne({
                domains: domain
            }, (err, c) => {

                // Check for Mongo errors
                if (err) {
                    res.status(200).json(err).end()
                    return
                }

                // If the company is found
                if (c) {

                    // Get all companies, because we can't check by companyId
                    request('get', 'http://handpicked.post-tech.nl:5000/api/Companies/', {}, (data) => {

                        // If the result contains companies object
                        if (data && data.companies) {

                            // Find the company in the results with the given companyId
                            result = data.companies.find(comp => comp.companyId == c.companyId)

                            // Format contacts
                            formattedContacts = []
                            slackchannel = c.slack || ''

                            result.contacts.forEach(contact => {
                                if (contact.name != "Verwijderd contact") {
                                    formattedContacts.push({
                                        id: contact.contactId,
                                        originalId: contact.originalId,
                                        name: contact.name,
                                        email: contact.email,
                                        phone: contact.phoneNr,
                                        department: contact.department
                                    })
                                }
                            })

                            // Return JSON
                            res.status(200).json({
                                company: {
                                    id: result.companyId,
                                    name: result.name,
                                    slack: slackchannel,
                                    domains: c.domains,
                                    originalId: result.originalId,
                                    label: result.label
                                },
                                contacts: formattedContacts,
                                deals: result.deals
                            }).end()
                        }

                        // If there are no results
                        else {
                            res.status(404).json({
                                "Contacts Controller": "No Contact/Company found for " + email
                            }).end()
                        }
                    })

                } 
                
                // If there is no result in the database
                else {
                    res.status(404).json({
                        "Contacts Controller": "No Contact/Company found for " + email
                    }).end()
                }
            })

        }
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

let post = (req, res) => {
    request('post', 'http://handpicked.post-tech.nl:5000/api/Contacts', {
        OriginalId: req.body.originalId,
        CompanyId: req.body.companyId,
        Name: req.body.name,
        Email: req.body.email,
        PhoneNr: req.body.phoneNr,
        Department: req.body.department
    }, (data) => {
        (res.status(200).json(data).end())
    })
}

module.exports = {
    get,
    post,
    mock
}