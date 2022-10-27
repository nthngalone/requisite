<template>
    <div class="requisite-authentication">
        <r-alert
            v-if="!validationResult.valid"
            type="warning"
            name="required-fields-warning"
        >
            Please enter all required fields.
        </r-alert>
        <r-alert
            v-if="invalidCredentials"
            type="warning"
            name="invalid-credentials-warning"
        >
            Please provide valid credentials.
        </r-alert>
        <r-alert
            v-if="expiredCredentials"
            type="warning"
            name="expired-credentials-warning"
        >
            Your credentials are expired.
        </r-alert>
        <r-form name="authentication-form">
            <r-textbox
                v-model="credentials.userName"
                label="User Name"
                placeholder="Enter user name"
                name="user-name"
            ></r-textbox>
            <r-password
                v-model="credentials.password"
                label="Password"
                placeholder="Enter password"
                name="password"
            ></r-password>
            <r-button
                name="login"
                @click="login()"
            >
                Login
            </r-button>
        </r-form>
    </div>
</template>

<script lang="ts">
import AuthenticationRequest from '@requisite/model/lib/user/AuthenticationRequest';
import AuthenticationStateManager from '../state-managers/AuthenticationStateManager';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import { reactive, computed, SetupContext, watch, defineComponent } from 'vue';

export default defineComponent({
    setup(
        props: Record<string, unknown>,
        context: SetupContext
    ): Record<string, unknown> {

        // Reactive data
        const authenticationStateManager = reactive(new AuthenticationStateManager());
        const credentials: AuthenticationRequest = reactive({
            domain: 'local',
            userName: '',
            password: ''
        });

        // Computed getters
        const invalidCredentials = computed((): boolean => {
            return authenticationStateManager.invalidCredentials;
        });
        const expiredCredentials = computed((): boolean => {
            return authenticationStateManager.expiredCredentials;
        });
        const validationResult = computed((): ValidationResult => {
            return authenticationStateManager.validationResult;
        });

        // Watchers
        watch(
            () => authenticationStateManager.systemError,
            (isSystemError: boolean) => {
                context.emit('system-error', isSystemError);
            }
        );

        // Methods
        const login = async (): Promise<void> => {
            authenticationStateManager.reset();
            await authenticationStateManager.authenticate(credentials);
            if (authenticationStateManager.authenticated) {
                context.emit('authenticated');
            }
        };

        return {
            authenticationStateManager,
            credentials,
            invalidCredentials,
            expiredCredentials,
            validationResult,
            login
        };
    }
});
</script>

<style lang="scss">

.requisite-authentication {
    width: 350px;
    margin-top: 25px;
    margin-left: auto;
    margin-right: auto;

    fieldset legend {
        text-align: left;
    }
}

</style>
