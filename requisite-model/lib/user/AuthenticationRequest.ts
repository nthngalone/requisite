export default interface AuthenticationRequest {
    domain: string;
    userName: string;
    password: string;
}

export const AuthenticationRequestSchema: unknown = {
    title: 'AuthenticationRequest',
    description: 'Request object to login a user',
    type: 'object',
    properties: {
        domain: {
            type: 'string',
            isNotBlank: true
        },
        userName: {
            type: 'string',
            isNotBlank: true
        },
        password: {
            type: 'string',
            isNotBlank: true
        }
    },
    required: ['domain', 'userName', 'password']
};
