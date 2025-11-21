<template>
    <div
        :data-name="cardBlockName"
        class="r-card-block card-body"
    >
        <h5
            v-if="cardBlockTitle"
            class="r-card-block-title card-title"
        >
            {{ cardBlockTitle }}
        </h5>
        <h6
            v-if="cardBlockSubtitle"
            class="r-card-block-subtitle card-subtitle mb-2 text-muted"
        >
            {{ cardBlockSubtitle }}
        </h6>
        <div class="r-card-text card-text">
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
    title: {
        type: String,
        required: false,
        default: undefined
    },
    subtitle: {
        type: String,
        required: false,
        default: undefined
    }
});

const {
    name: cardBlockName,
    title: cardBlockTitle,
    subtitle: cardBlockSubtitle
} = toRefs(props);

</script>

<style scoped>
    .r-card-block-title {
        font-size: 1.1rem;
        font-weight: bold;
    }
</style>
