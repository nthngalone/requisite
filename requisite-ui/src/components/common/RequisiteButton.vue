<template>
    <button type="button" :class="styleClass" :data-name="btnName">
        <slot />
    </button>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

const typeVariants: Record<string, string> = {
    primary: 'primary',
    secondary: 'secondary',
    success: 'success',
    info: 'info',
    warning: 'warning',
    danger: 'danger'
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
            required: false,
            default: 'primary'
        },
        rounded: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    setup(props) {
        const { name: btnName, class: className, type, rounded } = toRefs(props);
        const variant = computed((): string => typeVariants[type.value]);
        const pill = computed((): string => rounded.value ? 'rounded-pill' : '');
        const styleClass = computed((): string => ['btn', `btn-${variant.value}`, pill.value, className.value].join(' '));
        return { btnName, styleClass };
    }
});
</script>
