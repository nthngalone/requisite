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
            <r-form-controls>
                <r-button
                    name="login"
                    @click="login()"
                >
                    Login
                </r-button>
            </r-form-controls>
        </r-form>
    </div>
</template>

<script lang="ts">
import AuthenticationStateManager from '../state-managers/AuthenticationStateManager';
import { reactive, computed, watch, defineComponent } from 'vue';

export default defineComponent({
    setup(props, context) {

        // Reactive data
        const authenticationStateManager = reactive(new AuthenticationStateManager());
        const credentials = reactive({
            domain: 'local',
            userName: '',
            password: ''
        });

        // Computed getters
        const invalidCredentials = computed(() => {
            return authenticationStateManager.invalidCredentials;
        });
        const expiredCredentials = computed(() => {
            return authenticationStateManager.expiredCredentials;
        });
        const validationResult = computed(() => {
            return authenticationStateManager.validationResult;
        });

        // Watchers
        watch(
            () => authenticationStateManager.systemError,
            (isSystemError) => {
                context.emit('system-error', isSystemError);
            }
        );

        // Methods
        const login = async () => {
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
