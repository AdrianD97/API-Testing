const assert = require('assert');

const Requester = require('requester');

describe('test PUT /events/:id API', function() {
    const baseURL = 'http://localhost:3000/events';

    const headers = {
        'Content-Type': 'application/json'
    };

    let requester = null;

    before(function() {
        // console.log('call before()');

        requester = new Requester({
            headers: headers
        });
    });

    beforeEach(function() {
        // console.log('call beforeEach()');

        data = {
            'data': {
                'id': '0',
                'topics': '',
                'thumbnail': '/img/tr-3.jpeg',
                'url': 'index.html',
                'overrideURL': '',
                'linkType': '',
                'title': 'Created by Postman',
                'summary': 'Lorem ipsum dolor sit amet'
            }
        };
    });

    it('try updating an event that is in the database', function(done) {
        const id = 10;
        const url = baseURL + '/' + id;

        data['data']['overrideURL'] = 'update overrideURL';

        requester.put(url, data, function(response) {
            // console.log(this.statusCode, response);

            assert.equal(this.statusCode, 200);

            requester.get(url, function(response) {
                assert.equal(this.statusCode, 200);

                const event = JSON.parse(response);
                assert.equal(event['id'], id);

                assert.equal(event['overrideURL'], data['data']['overrideURL']);

                done();
            }); 
        });
    });

    it('try updating an event that is NOT in the database', function(done) {
        const id = 50;
        const url = baseURL + '/' + id;

        requester.put(url, data, function(response) {
            const err_message = JSON.parse(response);

            assert.equal(err_message.hasOwnProperty('error'), true);
            assert.equal(err_message['error'], 'Id not found');
            done();
        });
    });

    afterEach(function() {
        // console.log('call afterEach()');
        data = null;
    });

    after(function() {
        // console.log('call after()');
        requester = null;
    });
});
