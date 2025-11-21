<template>
    <div class="requisite-login">
        <HeaderNavigation
            @system-error="handleSystemErrorChange"
        />
        <r-grid>
            <r-grid-row>
                <r-grid-col>
                    <SystemErrorAlert
                        :display="systemError"
                    />
                </r-grid-col>
            </r-grid-row>
            <r-grid-row>
                <r-grid-col
                    size-xs="10"
                    size-sm="9"
                    size-md="8"
                    size-lg="7"
                    size-xl="6"
                    size-xxl="5"
                >
                    <Authentication
                        @authenticated="authenticated"
                        @system-error="handleSystemErrorChange"
                    />
                </r-grid-col>
            </r-grid-row>
            <r-grid-row>
                <r-grid-col
                    size-xs="12"
                    size-sm="10"
                    size-md="9"
                    size-lg="8"
                    size-xl="7"
                    size-xxl="6"
                >
                    <r-alert type="info">
                        Not signed up yet?  Go to the
                        <r-router-link name="sign-up" to="/sign-up" inline>
                            Sign Up
                        </r-router-link>
                        page and register a profile.
                    </r-alert>
                </r-grid-col>
            </r-grid-row>
        </r-grid>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Authentication from '../components/Authentication.vue';
import HeaderNavigation from '../components/HeaderNavigation.vue';
import SystemErrorAlert from '../components/SystemErrorAlert.vue';
import useRouterUtils from '../router/useRouterUtils';

export default defineComponent({

    components: { Authentication, HeaderNavigation, SystemErrorAlert },
    setup() {
        const systemError = ref(false);
        const { routeByPath } = useRouterUtils();
        const authenticated = () => {
            routeByPath('/home');
        };
        const handleSystemErrorChange = (isSystemError: boolean): void => {
            systemError.value = isSystemError;
        };
        return {
            systemError,
            authenticated,
            handleSystemErrorChange,
            routeByPath
        };
    }

});
</script>
