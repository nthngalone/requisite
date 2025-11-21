<template>
    <button
        :data-name="btnName"
        :class="['r-button', 'btn', btnType].join(' ')"
        :title="btnLabel"
        :aria-label="btnLabel"
        type="button"
    >
        <requisite-icon
            v-if="btnIconName"
            :name="btnIconName"
            aria-hidden="true"
        />
        <slot />
        <span v-if="labelWarning">
            Warning: A label has not been provided for the empty content button.
        </span>
    </button>
</template>

<script setup lang="ts">

import { computed, toRefs, useSlots } from 'vue';
import RequisiteIcon from './RequisiteIcon.vue';

const typeVariants: Record<string, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    warning: 'btn-warning',
    danger: 'btn-danger',
    error: 'btn-danger'
};

const props = defineProps({
    name: {
        type: String,
        required: false,
        default: ''
    },
    type: {
        type: String,
        required: false,
        default: 'primary'
    },
    iconName: {
        type: String,
        required: false,
        default: undefined
    },
    label: {
        type: String,
        required: false,
        default: undefined
    }
});

const {
    name: btnName,
    type,
    iconName: btnIconName,
    label: btnLabel
} = toRefs(props);

const btnType = computed((): string => typeVariants[type.value]);

const slots = useSlots();
const slot = slots.default?.();
const emptySlot = computed(
    () => (!slot || slot.length === 0 || slot.every(vnode => vnode.type === Comment))
);
const labelWarning = computed(() => emptySlot.value && !btnLabel?.value);

</script>
