import axios, { type AxiosInstance as HttpClient, type AxiosResponse as Response } from 'axios';
import {
    getRequestHandler,
    getResponseSuccessHandler,
    getResponseErrorHandler
} from './HttpHandlers';
import { extendHttpClient } from './HttpClientExtensions';

export function getHttpClient(): HttpClient {
    const axiosInstance = axios.create();
    axiosInstance.interceptors.request.use(
        getRequestHandler()
    );
    axiosInstance.interceptors.response.use(
        getResponseSuccessHandler(),
        getResponseErrorHandler()
    );
    extendHttpClient(axiosInstance);
    return axiosInstance;
}

export function returnData<T>() {
    return ({ data }: Response): T => {
        return data;
    };
}

export type { AxiosInstance as default } from 'axios';
export type { AxiosRequestConfig as Request, AxiosResponse as Response } from 'axios';
