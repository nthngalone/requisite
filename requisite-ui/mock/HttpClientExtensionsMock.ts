import HttpClient from '../src/utils/HttpClient';
import MockAdapter from 'axios-mock-adapter';
import { extendAdapterForSecurity } from './MockAdapterExtensionsSecurity';

export function extendHttpClient(httpClient: HttpClient) {
    const delayResponse = 750; // 750ms responses
    const mockAdapter = new MockAdapter(httpClient, { delayResponse });
    extendAdapterForSecurity(mockAdapter);
}
