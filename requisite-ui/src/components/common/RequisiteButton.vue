<template>
    <IButton
        :color="btnType"
        :data-name="btnName"
        type="button"
        class="r-button"
    >
        <slot />
    </IButton>
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
            required: false,
            default: 'primary'
        }
    },
    setup(props) {
        const { name: btnName, type } = toRefs(props);
        const btnType = computed((): string => typeVariants[type.value]);
        return { btnName, btnType };
    }
});
</script>
