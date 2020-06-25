const assert = require('assert');

const Requester = require('requester');

describe('test DELETE /events/:id API', function() {
    const baseURL = 'http://localhost:3000/events';

    let requester = null;

    before(function() {
        // console.log('call before()');

        requester = new Requester();
    });

    it('delete an event that is in the database', function(done) {
        const id = 10;
        const url = baseURL + '/' + id;

        requester.del(url, function(response) {
            // console.log(this.statusCode, response);
            const event = JSON.parse(response);
            assert.equal(this.statusCode, 200);

            requester.get(url, function(response) {
                const err_message = JSON.parse(response);

                assert.equal(err_message.hasOwnProperty('error'), true);
                assert.equal(err_message['error'], 'Id not found');
                done();
            });
        });
    });

    it('try deleting an event that is NOT in the database', function(done) {
        const id = 50;
        const url = baseURL + '/' + id;

        requester.del(url, function(response) {
            const err_message = JSON.parse(response);

            assert.equal(err_message.hasOwnProperty('error'), true);
            assert.equal(err_message['error'], 'Id not found');
            done();
        });
    });

    after(function() {
        // console.log('call after()');
        requester = null;
    });
});
