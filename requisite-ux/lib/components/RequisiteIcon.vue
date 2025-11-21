<template>
    <i
        :data-name="iconName"
        :class="['r-icon', 'bi', `bi-${iconName}`, iconType, iconSize].join(' ')"
    />
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

const iconTypeVariants: Record<string, string> = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    info: 'text-info',
    warning: 'text-warning',
    error: 'text-danger',
    danger: 'text-danger'
};

const iconSizeVariants: Record<string, string> = {
    xs: 'fs-6',
    sm: 'fs-5',
    md: 'fs-3',
    lg: 'fs-1'
};

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: false,
        default: ''
    },
    size: {
        type: String,
        required: false,
        default: 'sm'
    }
});

const { name: iconName, type, size } = toRefs(props);
const iconType = computed((): string => iconTypeVariants[type.value]);
const iconSize = computed((): string => iconSizeVariants[size.value]);

</script>
