<template>
    <div
        :data-name="controlsName"
        class="r-form-controls my-2"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">

import { toRefs } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: false,
        default: ''
    }
});
const { name: controlsName } = toRefs(props);

</script>
