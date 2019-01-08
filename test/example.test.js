const chai = require('chai')
var chaiHttp = require('chai-http')

chai.use(chaiHttp)
chai.should()


describe('Example', () => {

    var server

    beforeEach(function () {
        server = require('../server').server
    })

    afterEach(function () {
        server.close()
    })

    after(function() {
        process.exit(0)
    })

    it('Should get status 200 when getting data', done => {
        chai.request(server)
            .get('/api/example')
            .end((err, res) => {
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.a('object')
                done()
            })
    })

})