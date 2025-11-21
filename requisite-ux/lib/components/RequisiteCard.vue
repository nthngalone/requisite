<template>
    <div
        :data-name="cardName"
        class="r-card card mb-3"
    >
        <div
            v-if="cardHeader"
            class="r-card-header card-header"
        >
            {{ cardHeader }}
        </div>
        <div class="r-card-body card-body">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">

import { toRefs } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: false,
        default: ''
    },
    header: {
        type: String,
        required: false,
        default: undefined
    }
});

const {
    name: cardName,
    header: cardHeader
} = toRefs(props);

</script>

<style scoped>
    .r-card-header {
        font-size: 1.2rem;
        font-weight: bold;
    }
</style>
