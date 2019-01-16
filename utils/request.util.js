// ==================================================================
// PLEASE DO NOT ATTEMPT TO SIMPLIFY THIS CODE.
// KEEP THE SPACE SHUTTLE FLYING.
// ==================================================================
//
// This controller is intentionally written in a very verbose style.  You will
// notice:
//
// 1.  Every 'if' statement has a matching 'else' (exception: simple error
//     checks for a client API call)
// 2.  Things that may seem obvious are commented explicitly
//
// We call this style 'space shuttle style'.  Space shuttle style is meant to
// ensure that every branch and condition is considered and accounted for -
// the same way code is written at NASA for applications like the space
// shuttle.
//
// ==================================================================
// PLEASE DO NOT ATTEMPT TO SIMPLIFY THIS CODE.
// KEEP THE SPACE SHUTTLE FLYING.
// ==================================================================


// TODO: Fix up other DELETE's error handling and api-key usage.

// Import Axios to make requests
const axios = require('axios')

// Config file for api key
const config = require('../config/config.json')

/**
 * Request Handler to call other API's
 * @param string verb
 * @param string endpoint
 * @param { object } data
 * @returns { object }
 */

var doRequest = (verb, endpoint, data, callback) => {

    // Log Request
    console.log('\nRequest Handler \n-------- \nVerb: ' + verb + ' \nEndpoint: ' + endpoint + ' \nData: ' + JSON.stringify(data))

    // Check the verb
    if (verb == 'get' || verb == 'post' || verb == 'put' || verb == 'delete') {

        // If the verb is a GET
        if (verb == 'get') {

            // Do a get request to said endpoint
            axios({
                    method: 'get',
                    url: endpoint,
                    headers: {
                        'x-api-key': config.apikey
                    }
                })

                // Handle the Response
                .then((response) => {

                    // Check if there was a response from the server
                    if (response) {

                        // On status 200, return data
                        if (response.status == 200) {
                            callback(response.data)
                            return
                        }

                        // Axios should filter out error 500 to the catch block, just to be sure.
                        if (response.status == 500) {
                            callback({
                                "Request Handler": "Server returned error code 500"
                            })
                            return
                        }

                        // All Other cases
                        callback({
                            "Request Handler": "The server returned an unexpected statuscode, but it didn't end up in the catch block"
                        })
                        return

                    }

                    // The server might be down
                    else {
                        callback({
                            "Request Handler": "The server returned no response object",
                        })
                    }

                })

                // Catch errors from Axios
                .catch((error) => {

                    // Check if there was a response from the server
                    if (error.response) {

                        // On status 500, return an error
                        if (error.response.status == 500) {
                            callback({
                                "Request Handler": "Server returned error code 500"
                            })
                            return
                        }

                        // On status 401, return not authorized
                        if (error.response.status == 401) {
                            callback({
                                "Request Handler": "Server returned error code 401"
                            })
                            return
                        }

                        // On status 404, return not found
                        if (error.response.status == 404) {
                            callback({
                                "Request Handler": "Server returned error code 404"
                            })
                            return
                        }

                        // In all other cases
                        callback({
                            "Request Handler": "The server returned an unexpected error",
                            "Error": error.toString()
                        })
                        return

                    }

                    // The server might be down
                    else {
                        callback({
                            "Request Handler": "The server returned no response object",
                            "Error": error.toString()
                        })
                    }

                })

        }

        // If the verb is a POST
        else if (verb == 'post') {

            // Do a POST request to said endpoint
            axios({
                    method: 'post',
                    url: endpoint,
                    data: JSON.stringify(data),
                    headers: {
                        'x-api-key': config.apikey,
                        'Content-Type': 'application/json'
                    }
                })

                // Handle the Response
                .then((response) => {

                    // Check if there was a response from the server
                    if (response) {

                        // On status 200, return data
                        if (response.status == 200 || response.status == 201) {
                            callback(response.data)
                            return
                        }

                        // Axios should filter out error 500 to the catch block, just to be sure.
                        if (response.status == 500) {
                            callback({
                                "Request Handler": "Server returned error code 500"
                            })
                            return
                        }

                        // In all other cases
                        callback({
                            "Request Handler": "The server returned an unexpected statuscode, but it didn't end up in the catch block"
                        })
                        return

                    }

                    // The server might be down
                    else {
                        callback({
                            "Request Handler": "The server returned no response object",
                        })
                    }

                })

                // Catch errors from Axios
                .catch((error) => {

                    // Check if there was a response from the server
                    if (error.response) {

                        // On status 500, return an error
                        if (error.response.status == 500) {
                            callback({
                                "Request Handler": "Server returned error code 500"
                            })
                            return
                        }

                        // On status 401, return not authorized
                        if (error.response.status == 401) {
                            callback({
                                "Request Handler": "Server returned error code 401"
                            })
                            return
                        }

                        // On status 404, return not found
                        if (error.response.status == 404) {
                            callback({
                                "Request Handler": "Server returned error code 404"
                            })
                            return
                        }

                        // In all other cases
                        callback({
                            "Request Handler": "The server returned an unexpected error",
                            "Error": error.toString()
                        })
                        return

                    }

                    // The server might be down
                    else {
                        callback({
                            "Request Handler": "The server returned no response object",
                            "Error": error.toString()
                        })
                    }

                })

        }

        // If the verb is a PUT
        else if (verb == 'put') {

            // Do a PUT request to said endpoint
            axios({
                    method: 'put',
                    url: endpoint,
                    data: JSON.stringify(data),
                    headers: {
                        'x-api-key': config.apikey
                    }
                })

                // Handle the Response
                .then((response) => {

                    // Check if there was a response from the server
                    if (response) {

                        // On status 200, return data
                        if (response.status == 200) {
                            callback(response.data)
                            return
                        }

                        // Axios should filter out error 500 to the catch block, just to be sure.
                        if (response.status == 500) {
                            callback({
                                "Request Handler": "Server returned error code 500"
                            })
                            return
                        }

                        // In all other cases
                        callback({
                            "Request Handler": "The server returned an unexpected statuscode, but it didn't end up in the catch block"
                        })

                    }

                    // The server might be down
                    else {
                        callback({
                            "Request Handler": "The server returned no response object",
                        })
                    }

                })

                // Catch errors from Axios
                .catch((error) => {


                    // Check if there was a response from the server
                    if (error.response) {

                        // On status 500, return an error
                        if (error.response.status == 500) {
                            callback({
                                "Request Handler": "Server returned error code 500"
                            })
                            return
                        }

                        // On status 401, return not authorized
                        if (error.response.status == 401) {
                            callback({
                                "Request Handler": "Server returned error code 401"
                            })
                            return
                        }

                        // On status 404, return not found
                        if (error.response.status == 404) {
                            callback({
                                "Request Handler": "Server returned error code 404"
                            })
                            return
                        }

                        // In all other cases
                        callback({
                            "Request Handler": "The server returned an unexpected error",
                            "Error": error.toString()
                        })

                    }

                    // The server might be down
                    else {
                        callback({
                            "Request Handler": "The server returned no response object",
                            "Error": error.toString()
                        })
                    }

                })

        }

        // If the verb is a DELETE
        else if (verb == 'delete') {

            // Do a DELETE request to said endpoint
            axios.delete(endpoint)

                // Handle the Response
                .then((response) => {

                    // On status 200, return data
                    if (response.status == 200) {
                        callback(response.data)
                        return
                    }

                    // Axios should filter out error 500 to the catch block, just to be sure.
                    if (response.status == 500) {
                        callback({
                            "Request Handler": "Server returned error code 500"
                        })
                        return
                    }

                    // All Other cases
                    callback({
                        "Request Handler": "The server returned an unexpected statuscode, but it didn't end up in the catch block"
                    })

                })

                // Catch errors from Axios
                .catch((error) => {

                    // On status 500, return an error
                    if (error.response.status == 500) {
                        callback({
                            "Request Handler": "Server returned error code 500"
                        })
                        return
                    }

                    // On status 401, return not authorized
                    if (error.response.status == 401) {
                        callback({
                            "Request Handler": "Server returned error code 401"
                        })
                        return
                    }

                    // On status 404, return not found
                    if (error.response.status == 404) {
                        callback({
                            "Request Handler": "Server returned error code 404"
                        })
                        return
                    }

                    // In all other cases
                    callback({
                        "Request Handler": "The server returned an unexpected error",
                        "Error": error.toString()
                    })

                })
        }

    }

    // If the verb is wrong, return an error message
    else {
        callback({
            "Request Handler": "Please provide one of the following verbs: 'get', 'post', 'put' or 'delete'"
        })
    }

}

module.exports = {
    doRequest
}