<template>
    <div
        :data-name="alertMessageName"
        class="r-alert-message my-2"
    >
        <span
            v-if="alertMessageLabel"
            class="r-alert-message-label fw-bold"
        >
            {{ alertMessageLabel }}:
        </span>
        <slot />
    </div>
</template>

<script setup lang="ts">

import { toRefs } from 'vue';

const props = defineProps({
    name: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        required: false,
        default: undefined
    }
});

const { name: alertMessageName, label: alertMessageLabel } = toRefs(props);

</script>
