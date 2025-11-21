<template>
    <button
        :data-name="lnkName"
        color="primary"
        :class="['r-link', 'btn', 'btn-link', inlineStyle].join(' ')"
        @click="clickHandler">
        <slot />
    </button>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: false,
        default: ''
    },
    action: {
        type: Function,
        required: false,
        default: null
    },
    inline: {
        type: Boolean,
        required: false,
        default: false
    }
});
const { name: lnkName, action, inline } = toRefs(props);
const inlineStyle = ref(inline.value ? 'inline' : undefined);
const clickHandler = () => {
    if (action.value) {
        action.value();
    }
};
</script>

<style scoped>
    .r-link.inline {
        padding: 0px;
        border-width: 0px;
        vertical-align: baseline;
    }
</style>
