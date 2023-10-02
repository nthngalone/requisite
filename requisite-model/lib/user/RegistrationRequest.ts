import type Name from '../common/Name';

export default interface RegistrationRequest {
    domain: string;
    userName: string;
    emailAddress: string;
    password: string;
    name: Name;
    termsAgreement: boolean;
}

export const RegistrationRequestSchema: unknown = {
    title: 'RegistrationRequest',
    description: 'Request object to register a new user',
    type: 'object',
    properties: {
        userName: {
            type: 'string',
            isNotBlank: true
        },
        emailAddress: {
            type: 'string',
            format: 'email',
            isNotBlank: true
        },
        password: {
            type: 'string',
            isNotBlank: true
        },
        name: {
            type: 'object',
            properties: {
                firstName: {
                    type: 'string',
                    isNotBlank: true
                },
                lastName: {
                    type: 'string',
                    isNotBlank: true
                }
            },
            required: ['firstName', 'lastName']
        },
        termsAgreement: {
            type: 'boolean',
            const: true
        }
    },
    required: ['userName', 'emailAddress', 'password', 'name', 'termsAgreement']
};
