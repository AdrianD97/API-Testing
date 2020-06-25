const assert = require('assert');

const Requester = require('requester');

describe('test GET /events API', function() {
    const baseURL = 'http://localhost:3000/events';

    let requester = null;

    before(function() {
        // console.log('call before()');
        requester = new Requester();
    });

    it('the number of events is expected to be 12', function(done) {
        const url = baseURL;

        requester.get(url, function(response) {
            // console.log(this.statusCode, response);
            const events = JSON.parse(response);
            assert.equal(this.statusCode, 200);
            assert.equal(events.length, 12);
            done();
        });
    });

    after(function() {
        // console.log('call after()');
        requester = null;
    });
});
