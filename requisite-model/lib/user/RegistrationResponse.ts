import type AuthenticationResponse from './AuthenticationResponse';

export default interface RegistrationResponse extends AuthenticationResponse {
    id?: number;
};
