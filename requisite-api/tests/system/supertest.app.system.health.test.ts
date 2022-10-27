import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';

configure('ERROR');

describe('GET /system/health', () => {
    test('returns a 200 response', async () => {
        return request(getApp())
            .get('/system/health')
            .expect(200, 'true');
    });
});
