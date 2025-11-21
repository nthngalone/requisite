<template>
    <form
        :data-name="formName"
        class="r-form"
    >
        <slot />
    </form>
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

const { name: formName } = toRefs(props);

</script>
