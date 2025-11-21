<template>
    <div
        :data-name="gridName"
        :class="['r-grid', containerVariant].join(' ')"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

const containerVariants: Record<string, string> = {
    small: 'container-sm',
    medium: 'container-md',
    large: 'container-lg',
    xlarge: 'container-xl',
    xxlarge: 'container-xxl',
    full: 'container-fluid',
    default: 'container'
};

const props = defineProps({
    name: {
        type: String,
        required: false,
        default: ''
    },
    size: {
        type: String,
        required: false,
        default: ''
    }
});

const { name: gridName, size } = toRefs(props);
const containerVariant = computed(
    (): string => containerVariants[size.value] || containerVariants.default
);

</script>
