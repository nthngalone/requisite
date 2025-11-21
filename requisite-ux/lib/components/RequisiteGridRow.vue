<template>
    <div
        :data-name="gridRowName"
        :class="['r-grid-row', 'row', alignVariant].join(' ')"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: false,
        default: undefined
    },
    align: {
        type: String,
        required: false,
        default: 'center'
    }
});

const { name: gridRowName, align } = toRefs(props);
const alignVariant = computed(() => (`justify-content-${align.value}`));
</script>
