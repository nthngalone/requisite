import '../supertest.mock.bcryptjs';
import '../supertest.mock.jsonwebtoken';
import '../supertest.mock.sqlz';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';

configure('OFF');

describe('GET /security/status', () => {
    test('returns a 401 Unauthorized response', async () => {
        return request(getApp())
            .get('/security/status')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        return request(getApp())
            .get('/security/status')
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        return request(getApp())
            .get('/security/status')
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .get('/security/status')
            .set('Authorization', 'Bearer valid|local|revoked')
            .expect(401, 'Unauthorized');
    });
    test('returns a 200 success response when an valid auth header is present', async () => {
        return request(getApp())
            .get('/security/status')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .expect('X-Authorization', 'im-a-signed-token-for-local-sysadmin')
            .expect(200, 'true');
    });
});
