var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var companySchema = new Schema({

    // Company ID from .NET API
    companyId: {
        type: Number,
        required: true,
        unique: true,
    },

    // List of accociated domains.
    domains:{
        type: Array,
        required: false
    },

    // Slack channel
    slack: {
        type: String,
        required: false
    },

})

const Company = mongoose.model('company', companySchema)

module.exports = {
    Company,
    companySchema
}