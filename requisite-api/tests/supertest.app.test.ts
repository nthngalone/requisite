import request from 'supertest';
import { getApp } from '../src/app';
import { configure } from '../src/util/Logger';

configure('OFF');

describe('/ (default path)', () => {
    test('GET returns a 200 response', async () => {
        return request(getApp())
            .get('/')
            .expect(200, 'Hello World from Requisite!');
    });
});
