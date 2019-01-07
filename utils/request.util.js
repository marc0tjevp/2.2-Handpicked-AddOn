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


// Import Axios to make requests
const axios = require('axios');

/**
 * Request Handler to call other API's
 * @param string verb
 * @param string endpoint
 * @param { obj } data
 * @returns { json object }
 */

var doRequest = (verb, endpoint, data, callback) => {

    // Log Request
    console.log('\nRequest Handler \n-------- \nVerb: ' + verb + ' \nEndpoint: ' + endpoint + ' \nData: ' + data)

    // Check the verb
    if (verb == 'get' || verb == 'post' || verb == 'put' || verb == 'delete') {

        // If the verb is a GET
        if (verb == 'get') {

            // Do a get request to said endpoint
            axios.get(endpoint)

                // Handle the Response
                .then((response) => {

                    // On status 200, return data
                    if (response.status == 200) {
                        callback(response.data)
                    }

                    // On status 401, return not authorized
                    if (response.status == 401) {
                        callback({
                            "Request Handler": "Not Authorized"
                        })
                    }

                    // Axios should filter out error 500 to the catch block, just to be sure.
                    if (response.status == 500) {
                        callback({
                            "Request Handler": "Server returned error code 500"
                        })
                    }

                    // All Other cases
                    callback({
                        "Request Handler": "The server returned an unexpected statuscode, but it didn't end up in the catch block"
                    })

                })

                // Catch errors from Axios
                .catch((error) => {

                    // On status 500, return an error message
                    if (error.response.status == 500) {
                        callback({
                            "Request Handler": "Server returned error code 500"
                        })
                    }

                    // All Other cases
                    callback({
                        "Request Handler": "The server returned an unexpected error: " + error
                    })

                })

        }

        // If the verb is a POST
        else if (verb == 'post') {

            // Do a get request to said endpoint
            axios.post(endpoint, data)

                // Handle the Response
                .then((response) => {

                    // On status 200, return data
                    if (response.status == 200) {
                        callback(response.data)
                    }

                    // Axios should filter out error 500 to the catch block, just to be sure.
                    if (response.status == 500) {
                        callback({
                            "Request Handler": "Server returned error code 500"
                        })
                    }

                    // All Other cases
                    callback({
                        "Request Handler": "The server returned an unexpected statuscode, but it didn't end up in the catch block"
                    })

                })

                // Catch errors from Axios
                .catch((error) => {

                    if (error.response.status == 500) {
                        callback({
                            "Request Handler": "Server returned error code 500"
                        })
                    }

                    // On status 401, return not authorized
                    if (error.response.status == 401) {
                        callback({
                            "Request Handler": "Not Authorized"
                        })
                    }

                    if (error.response.status == 404) {
                        callback({
                            "Request Handler": "Server returned error code 404"
                        })
                    }

                    callback({
                        "Request Handler": "The server returned an unexpected error: " + error
                    })

                })


        }

    }

    // If the verb is wrong, return an error message
    else {
        callback({
            "Request Handler": "Please provide one of the following verbs: 'get', 'post', 'put' or 'delete'"
        });
    }

}

module.exports = {
    doRequest
}