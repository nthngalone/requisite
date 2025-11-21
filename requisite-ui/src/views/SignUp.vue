<template>
    <div class="requisite-sign-up">
        <HeaderNavigation
            @system-error="handleSystemErrorChange"
        />
        <r-card>
            <r-alert type="info" icon>
                Fill out the following form and click 'Register'.
            </r-alert>
            <SystemErrorAlert
                :display="systemError"
            />
            <Registration
                @registered="registered()"
                @system-error="handleSystemErrorChange"
            />
            <r-alert type="warning">
                Already registered?
                Click <r-router-link to="/" inline>here</r-router-link> to login instead.
            </r-alert>
        </r-card>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Registration from '../components/Registration.vue';
import HeaderNavigation from '../components/HeaderNavigation.vue';
import SystemErrorAlert from '../components/SystemErrorAlert.vue';
import useRouterUtils from '../router/useRouterUtils';

export default defineComponent({

    components: { Registration, HeaderNavigation, SystemErrorAlert },
    setup() {
        const systemError = ref(false);
        const { routeByPath } = useRouterUtils();

        const registered = () => {
            routeByPath('/home');
        };

        const handleSystemErrorChange = (isSystemError: boolean): void => {
            systemError.value = isSystemError;
        };

        return {
            systemError,
            registered,
            handleSystemErrorChange,
            routeByPath
        };
    }

});

</script>
