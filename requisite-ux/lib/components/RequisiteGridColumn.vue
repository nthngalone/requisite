<template>
    <div
        :data-name="gridColName"
        :class="[
            'r-grid-col',
            colVariant,
            colXsVariant,
            colSmVariant,
            colMdVariant,
            colLgVariant,
            colXlVariant,
            colXxlVariant
        ].join(' ')"
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
    size: {
        type: String,
        required: false,
        default: undefined
    },
    sizeXs: {
        type: String,
        required: false,
        default: undefined
    },
    sizeSm: {
        type: String,
        required: false,
        default: undefined
    },
    sizeMd: {
        type: String,
        required: false,
        default: undefined
    },
    sizeLg: {
        type: String,
        required: false,
        default: undefined
    },
    sizeXl: {
        type: String,
        required: false,
        default: undefined
    },
    sizeXxl: {
        type: String,
        required: false,
        default: undefined
    }
});

const {
    name: gridColName,
    size,
    sizeXs,
    sizeSm,
    sizeMd,
    sizeLg,
    sizeXl,
    sizeXxl
} = toRefs(props);
const colVariant = computed(() => (size?.value ? `col-${size?.value}` : 'col'));
const colXsVariant = computed(() => (sizeXs?.value ? `col-${sizeXs?.value}` : undefined));
const colSmVariant = computed(() => (sizeSm?.value ? `col-sm-${sizeSm?.value}` : undefined));
const colMdVariant = computed(() => (sizeMd?.value ? `col-md-${sizeMd?.value}` : undefined));
const colLgVariant = computed(() => (sizeLg?.value ? `col-lg-${sizeLg?.value}` : undefined));
const colXlVariant = computed(() => (sizeXl?.value ? `col-xl-${sizeXl?.value}` : undefined));
const colXxlVariant = computed(() => (sizeXxl?.value ? `col-xxl-${sizeXxl?.value}` : undefined));

</script>
