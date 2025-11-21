<template>
    <span
        :data-name="avatarName"
        class="r-avatar avatar rounded-circle text-bg-primary p-2 fw-bold"
    >
        {{ displayTxt }}
    </span>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: false,
        default: ''
    },
    text: {
        type: String,
        required: true
    }
});

const {
    name: avatarName,
    text: displayTxt
} = toRefs(props);

</script>
