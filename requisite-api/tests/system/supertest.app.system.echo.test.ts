import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';

configure('ERROR');

describe('GET /system/echo', () => {
    test('returns a 200 response echoing any headers sent', async () => {
        return request(getApp())
            .get('/system/echo')
            .set('Accept', 'application/json')
            .set('X-Custom-Header', 'custom-value')
            .expect(200)
            .then((res) => {
                expect(res.body.headers).toEqual(expect.objectContaining({
                    'accept': 'application/json',
                    'x-custom-header': 'custom-value'
                }));

            });
    });
});
