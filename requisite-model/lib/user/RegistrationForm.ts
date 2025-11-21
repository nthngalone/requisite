import type RegistrationRequest from './RegistrationRequest';
import { RegistrationRequestSchema } from './RegistrationRequest';

export default interface RegistrationForm extends RegistrationRequest {
    passwordConfirmation: string;
}

const schema = {
    ...RegistrationRequestSchema as Record<string, unknown>
};
(schema.properties as Record<string, unknown>).passwordConfirmation = {
    type: 'string',
    isNotBlank: true,
    matchesProperty: {
        property: 'password'
    }
};
export const RegistrationFormSchema = schema;
