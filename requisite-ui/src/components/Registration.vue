<template>
    <div class="requisite-registration">
        <r-alert
            v-if="!validationResult.valid"
            type="warning"
            name="validation-warnings"
        >
            <div
                v-if="validationResult.errors['userName']"
                class="user-name-warning"
            >
                Please enter a valid user name.
            </div>
            <div
                v-if="validationResult.errors['emailAddress']"
                class="email-address-warning"
            >
                Please enter a valid email address.
            </div>
            <div
                v-if="validationResult.errors['name.firstName']"
                class="first-name-warning"
            >
                Please enter a valid first name.
            </div>
            <div
                v-if="validationResult.errors['name.lastName']"
                class="last-name-warning"
            >
                Please enter a valid last name.
            </div>
            <div
                v-if="validationResult.errors['password']"
                class="password-warning"
            >
                Please enter a valid password.
            </div>
            <div
                v-if="validationResult.errors['passwordConfirmation']"
                class="password-confirmation-warning"
            >
                The password confirmation must match the password.
            </div>
            <div
                v-if="validationResult.errors['termsAgreement']"
                class="terms-agreement-warning"
            >
                Please accept the terms and conditions.
            </div>
        </r-alert>
        <r-alert
            v-if="userNameConflict"
            type="warning"
            name="user-name-conflict-warning"
        >
            The chosen user name is already in use.  Please choose a different user name.
        </r-alert>
        <r-alert
            v-if="emailAddressConflict"
            type="warning"
            name="email-address-conflict-warning"
        >
            There is already a profile registered for this email address.
        </r-alert>
        <r-form name="registration-form">
            <r-textbox
                v-model="request.userName"
                label="User Name"
                placeholder="Enter user name"
                name="user-name"
            ></r-textbox>
            <r-textbox
                v-model="request.emailAddress"
                label="Email Address"
                placeholder="Enter email address"
                name="email-address"
            ></r-textbox>
            <r-textbox
                v-model="request.name.firstName"
                label="First Name"
                placeholder="Enter first name"
                name="first-name"
            ></r-textbox>
            <r-textbox
                v-model="request.name.lastName"
                label="Last Name"
                placeholder="Enter last name"
                name="last-name"
            ></r-textbox>
            <r-password
                v-model="request.password"
                label="Password"
                placeholder="Enter password"
                name="password"
                :strengthMeter="true"
            ></r-password>
            <r-password
                v-model="request.passwordConfirmation"
                label="Confirm Password"
                placeholder="Confirm password"
                name="password-confirmation"
            ></r-password>
            <r-checkbox
                v-model="request.termsAgreement"
                name="terms-agreement"
                label="I accept the terms and conditions."
            />
            <r-button
                name="register"
                @click="register()"
            >
                Register
            </r-button>
        </r-form>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from 'vue';
import RegistrationForm from '@requisite/model/lib/user/RegistrationForm';
import RegistrationStateManager from '../state-managers/RegistrationStateManager';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';

export default defineComponent({

    setup(props, context) {

        // Reactive data
        const registrationStateManager = reactive(new RegistrationStateManager());
        const request: RegistrationForm = reactive({
            domain: 'local',
            userName: '',
            emailAddress: '',
            password: '',
            passwordConfirmation: '',
            name: {
                firstName: '',
                lastName: ''
            },
            termsAgreement: false
        });

        // Computed getters
        const userNameConflict = computed((): boolean => {
            return registrationStateManager.userNameConflict;
        });

        const emailAddressConflict = computed((): boolean => {
            return registrationStateManager.emailAddressConflict;
        });

        const validationResult = computed((): ValidationResult => {
            return registrationStateManager.validationResult;
        });

        // Watchers
        watch(
            () => registrationStateManager.systemError,
            (isSystemError: boolean): void => {
                context.emit('system-error', isSystemError);
            }
        );

        // Methods
        const register = async () => {
            registrationStateManager.reset();
            await registrationStateManager.register(request);
            const { registered } = registrationStateManager;
            if (registered) {
                context.emit('registered');
            }
        };

        return {
            registrationStateManager,
            request,
            userNameConflict,
            emailAddressConflict,
            validationResult,
            register
        };
    }

});
</script>

<style lang="scss">

.requisite-registration {
    width: 350px;
    margin-top: 25px;
    margin-left: auto;
    margin-right: auto;

    fieldset legend {
        text-align: left;
    }
}

</style>
