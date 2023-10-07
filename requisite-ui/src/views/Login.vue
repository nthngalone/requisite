<template>
    <div class="requisite-login">
        <HeaderNavigation
            @system-error="handleSystemErrorChange"
        />
        <r-card>
            <SystemErrorAlert
                :display="systemError"
            />
            <Authentication
                @authenticated="authenticated"
                @system-error="handleSystemErrorChange"
            />
            <r-link name="sign-up" to="/sign-up">Sign Up</r-link>
        </r-card>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Authentication from '../components/Authentication.vue';
import HeaderNavigation from '../components/HeaderNavigation.vue';
import SystemErrorAlert from '../components/SystemErrorAlert.vue';
import { $routeByPath } from '../router';

export default defineComponent({

    components: { Authentication, HeaderNavigation, SystemErrorAlert },
    setup() {
        const systemError = ref(false);
        const authenticated = () => {
            $routeByPath('/home');
        };
        const handleSystemErrorChange = (isSystemError: boolean): void => {
            systemError.value = isSystemError;
        };
        return {
            systemError,
            authenticated,
            handleSystemErrorChange
        };
    }

});
</script>
