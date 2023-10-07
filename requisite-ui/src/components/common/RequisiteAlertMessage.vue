<template>
    <div
        :data-name="alertMessageName"
        class="r-alert-message"
    >
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
export default defineComponent({
    props: {
        name: {
            type: String,
            required: false,
            default: ''
        }
    },
    setup(props) {
        const { name: alertMessageName } = toRefs(props);
        return { alertMessageName };
    }
});
</script>
