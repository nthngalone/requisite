<template>
    <form :class="className" :data-name="formName">
        <slot />
    </form>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';

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
        }
    },
    setup(props) {
        const { name: formName, class: className } = toRefs(props);
        return { formName, className };
    }
});
</script>
