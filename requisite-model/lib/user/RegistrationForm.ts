import type RegistrationRequest from './RegistrationRequest';
import { RegistrationRequestSchema } from './RegistrationRequest';

export default interface RegistrationForm extends RegistrationRequest {
    passwordConfirmation: string;
}

const schema = {
    ...RegistrationRequestSchema as { [key: string]: unknown }
};
(schema.properties as { [key: string]: unknown }).passwordConfirmation = {
    type: 'string',
    isNotBlank: true,
    matchesProperty: {
        property: 'password'
    }
};
export const RegistrationFormSchema = schema;
