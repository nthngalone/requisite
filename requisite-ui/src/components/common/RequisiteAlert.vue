<template>
    <IAlert
        :color="alertType"
        :data-name="alertName"
        class="r-alert"
    >
        <slot />
    </IAlert>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
const typeVariants: Record<string, string> = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'danger'
};
// TODO add icon support
export default defineComponent({
    props: {
        name: {
            type: String,
            required: false,
            default: ''
        },
        type: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const { name: alertName, type } = toRefs(props);
        const alertType = computed((): string => typeVariants[type.value]);
        return { alertName, alertType };
    }
});
</script>
