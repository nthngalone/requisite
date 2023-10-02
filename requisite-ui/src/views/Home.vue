<template>
    <div class="requisite-home">
        <HeaderNavigation
            :secured="true"
            @system-error="handleSystemErrorChange"
        />
        <SystemErrorAlert
            :display="systemError"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import HeaderNavigation from '../components/HeaderNavigation.vue';
import SystemErrorAlert from '../components/SystemErrorAlert.vue';

export default defineComponent({
    components: {
        HeaderNavigation,
        SystemErrorAlert
    },
    setup() {
        const systemError = ref(false);
        const handleSystemErrorChange = (isSystemError: boolean): void => {
            systemError.value = isSystemError;
        };
        return {
            systemError,
            handleSystemErrorChange
        };
    }
});
</script>
