<template>
    <div :class="styleClass" :data-name="alertName">
        <slot />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
const typeVariants: Record<string, string> = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'danger'
};
export default defineComponent({
    props: {
        name: {
            type: String,
            required: false,
            default: ''
        },
        class: {
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
        // TODO support individual (and named) alert messages
        const { name: alertName, class: className, type } = toRefs(props);
        const variant = computed((): string => typeVariants[type.value]);
        const styleClass = computed((): string => ['alert', `alert-${variant.value}`, className.value].join(' '));
        return { alertName, styleClass };
    }
});
</script>
