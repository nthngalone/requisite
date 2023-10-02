import type ServiceError from '../services/ServiceError';
import type RegistrationForm from '@requisite/model/lib/user/RegistrationForm';
import { RegistrationFormSchema } from '@requisite/model/lib/user/RegistrationForm';
import { validate, type ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import SecurityService from '../services/SecurityService';

export default class RegistrationStateManager {

    private securityService: SecurityService = new SecurityService();

    public registered = false;
    public validationResult: ValidationResult = { valid: true };
    public userNameConflict = false;
    public emailAddressConflict = false;
    public systemError = false;

    async validate(request: RegistrationForm): Promise<ValidationResult> {
        return validate(request, RegistrationFormSchema);
    }

    async register(request: RegistrationForm): Promise<void> {
        try {
            this.validationResult = await this.validate(request);
            if (this.validationResult.valid) {
                const regResponse = await this.securityService.register(request);
                const { message } = regResponse;
                this.registered = (message === 'Registered');
                this.systemError = !this.registered;
                if (this.systemError) {
                    console.error('unknown registration response received: ', regResponse);
                }
            }
        } catch (error) {
            const { message, data } = (error as ServiceError);
            this.userNameConflict = (message === 'conflict') && (data.conflictReason === 'userName');
            this.emailAddressConflict = (message === 'conflict') && (data.conflictReason === 'emailAddress');
            this.systemError = (
                !this.registered &&
                !this.userNameConflict &&
                !this.emailAddressConflict
            );
            if (this.systemError) {
                console.error('A unexpected error was encountered.', error);
            }
        }
    }

    reset(): void {
        this.validationResult = { valid: true };
        this.registered = false;
        this.userNameConflict = false;
        this.emailAddressConflict = false;
        this.systemError = false;
    }
}
