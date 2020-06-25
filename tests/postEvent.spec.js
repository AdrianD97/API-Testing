const assert = require('assert');

const Requester = require('requester');

describe('test POST /events/ API', function() {
    const baseURL = 'http://localhost:3000/events';

    const headers = {
        'Content-Type': 'application/json'
    };

    let requester = null;

    let data = null;

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

    describe('tests that should create a new event', function() {
        it('create a new event for which we provide a custom id', function(done) {
            const id = '100';

            data['data']['id'] = id;
            let url = baseURL;

            requester.post(url, data, function (response) {
                // console.log(response);

                assert.equal(this.statusCode, 201);

                const newEvent = JSON.parse(response);
                assert.equal(newEvent.hasOwnProperty('id'), true);
                assert.equal(newEvent['id'], id);

                url = baseURL + '/' + id;

                requester.get(url, function(response) {
                    // console.log(this.statusCode, response);
                    const event = JSON.parse(response);
                    assert.equal(this.statusCode, 200);
                    assert.equal(event['id'], id);
                    done();
                });
            });
        });

        it('create a new event for which we don\'t provide a custom id', function(done) {
            let url = baseURL;
    
            if (data['data']['id']) {
                delete data['data']['id'];
            }
    
            requester.post(url, data, function (response) {
                // console.log(response);
    
                assert.equal(this.statusCode, 201);
                const newEvent = JSON.parse(response);
                assert.equal(newEvent.hasOwnProperty('id'), true);
    
                url = baseURL + '/' + newEvent['id'];
    
                requester.get(url, function(response) {
                    // console.log(this.statusCode, response);
                    const event = JSON.parse(response);
                    assert.equal(this.statusCode, 200);
                    assert.equal(event.hasOwnProperty('id'), true);
                    done();
                });
            });
        });

        it('create a new event for which we don\'t provide a field', function(done) {
            let url = baseURL;

            if (data['data']['id']) {
                delete data['data']['id'];
            }

            if (data['data']['url']) {
                delete data['data']['url'];
            }

            requester.post(url, data, function (response) {
                // console.log(response);

                assert.equal(this.statusCode, 201);
                const newEvent = JSON.parse(response);
                assert.equal(newEvent.hasOwnProperty('id'), true);

                url = baseURL + '/' + newEvent['id'];

                requester.get(url, function(response) {
                    // console.log(this.statusCode, response);
                    const event = JSON.parse(response);
                    assert.equal(this.statusCode, 200);
                    assert.equal(event.hasOwnProperty('url'), false);
                    done();
                });
            });
        });
    });

    describe('tests that should NOT create a new event', function() {
        it('create a new event for which we provide invalid data', function(done) {
            let url = baseURL;

            if (data['data']['id']) {
                delete data['data']['id'];
            }

            data['data']['thumbnail'] = '/img/invalid';

            requester.post(url, data, function (response) {
                // console.log(response);

                // here we expecte to receive 400 status code, because data object contains invalid value
                // for thumbnail field.
                assert.equal(this.statusCode, 400);

                // but we don't receive 400 => the app doesn't validate client data
                done();
            });
        });

        it('create a new event for which we provide an id which already exists', function(done) {
            let url = baseURL;

            data['data']['id'] = 5;

            requester.post(url, data, function (response) {
                // console.log(response);

                // here we expecte to receive 400 status code, because data object contains an existing id
                assert.equal(this.statusCode, 400);

                // but we don't receive 400 => the app doesn't validate client data
                done();
            });
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
