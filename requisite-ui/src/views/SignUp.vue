<template>
    <div class="requisite-sign-up">
        <HeaderNavigation
            @system-error="handleSystemErrorChange"
        />
        <SystemErrorAlert
            :display="systemError"
        />
        <Registration
            @registered="registered()"
            @system-error="handleSystemErrorChange"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Registration from '../components/Registration.vue';
import HeaderNavigation from '../components/HeaderNavigation.vue';
import SystemErrorAlert from '../components/SystemErrorAlert.vue';
import { $routeByPath } from '../router';

export default defineComponent({

    components: { Registration, HeaderNavigation, SystemErrorAlert },
    setup() {
        const systemError = ref(false);

        const registered = () => {
            $routeByPath('/home');
        };

        const handleSystemErrorChange = (isSystemError: boolean): void => {
            systemError.value = isSystemError;
        };

        return {
            systemError,
            registered,
            handleSystemErrorChange
        };
    }

});

</script>
