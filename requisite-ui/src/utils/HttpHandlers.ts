import { getAuthToken, setAuthToken } from './AuthTokenManager';
import type {
    InternalAxiosRequestConfig as Request,
    AxiosResponse as Response
} from 'axios';
import { AxiosError as HttpError } from 'axios';

export function getRequestHandler(): (req: Request<unknown>) => Request<unknown> {
    return (req: Request) => {
        const authToken = getAuthToken();
        if (authToken) {
            req.headers = req.headers || {};
            req.headers.Authorization = `Bearer ${authToken}`;
        }
        return req;
    };
}

export function getResponseSuccessHandler(): (res: Response) => Response {
    return (res: Response) => {
        if (res.headers) {
            const authToken = res.headers['x-authorization'];
            if (authToken) {
                setAuthToken(authToken);
            }
        }
        return res;
    };
}

export function getResponseErrorHandler(): (error: HttpError) => Promise<ResponseError> {
    return ({ config, response, code }: HttpError) => {
        const { method = '', url = '' } = config as Request<unknown>;
        const { status = 999, data = null } =
            (response ? (response as Response) : {});
        let message = null;
        switch (status) {
            case 400: // Bad request response
                message = 'bad request';
                break;
            case 401: // Unauthenticated response
                message = 'unauthenticated';
                break;
            case 403: // Unauthorized response
                message = 'unauthorized';
                break;
            case 409: // Conflict response
                message = 'conflict';
                break;
            default: // All other errors (500, etc)
                message = 'system error';
                break;
        }
        const errDetails = `${code ? code + ': ' : ''}${message}`;
        const respDetails = `${status} - ${method.toUpperCase()} ${url}`;
        console.error(`Request error encountered:\n${errDetails}\n${respDetails}`);
        return Promise.reject(new ResponseError(message, data, code));
    };
}

class ResponseError extends Error {

    public code: string | undefined;
    public data: Record<string, unknown>;

    constructor(message: string, data: Record<string, unknown>, code?: string) {
        super();
        this.code = code;
        this.message = message;
        this.data = data;
    }
}
