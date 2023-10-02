import type AuthenticationRequest from '@requisite/model/lib/user/AuthenticationRequest';
import { AuthenticationRequestSchema } from '@requisite/model/lib/user/AuthenticationRequest';
import SecurityService from '../services/SecurityService';
import { validate, type ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';

export default class AuthenticationStateManager {

    private securityService: SecurityService = new SecurityService();

    public authenticated = false;
    public validationResult: ValidationResult = { valid: true };
    public invalidCredentials = false;
    public expiredCredentials = false;
    public systemError = false;

    async validate(authRequest: AuthenticationRequest): Promise<ValidationResult> {
        return validate(authRequest, AuthenticationRequestSchema);
    }

    async authenticate(authRequest: AuthenticationRequest): Promise<void> {
        try {
            this.validationResult = await this.validate(authRequest);
            if (this.validationResult.valid) {
                const authResponse = await this.securityService.login(authRequest);
                const { message } = authResponse;
                if (message === 'Authenticated') {
                    this.authenticated = true;
                } else {
                    this.expiredCredentials = (message === 'Credentials Expired');
                    this.systemError = !this.expiredCredentials;
                    if (this.systemError) {
                        console.error('unknown authentication response received: ', authResponse);
                    }
                }
            }
        } catch (error: unknown) {
            this.invalidCredentials = ((error as Error).message === 'unauthenticated');
            this.systemError = !this.invalidCredentials;
            if (this.systemError) {
                console.error('A unexpected error was encountered.', error);
            }
        }
    }

    reset(): void {
        this.validationResult = { valid: true };
        this.authenticated = false;
        this.invalidCredentials = false;
        this.expiredCredentials = false;
        this.systemError = false;
    }
}
