<template>
    <div
        :color="alertType"
        :data-name="alertName"
        :class="['r-alert', 'alert', alertType].join(' ')"
        role="alert"
    >
        <h4 v-if="heading" class="alert-heading">
            <requisite-icon
                v-if="showIcon"
                :name="iconName"
                :type="type"
                size="sm"
            />
            {{ heading }}
        </h4>
        <requisite-icon
            v-if="!heading && showIcon"
            :name="iconName"
            :type="type"
            size="xs"
        />
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import RequisiteIcon from './RequisiteIcon.vue';

const typeVariants: Record<string, string> = {
    success: 'alert-success',
    info: 'alert-info',
    warning: 'alert-warning',
    error: 'alert-danger',
    danger: 'alert-danger'
};
const defaultIcons: Record<string, string> = {
    success: 'check-circle-fill',
    info: 'info-circle-fill',
    warning: 'exclamation-triangle-fill',
    error: 'x-octagon-fill',
    danger: 'x-octagon-fill'
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
        default: 'info'
    },
    heading: {
        type: String,
        required: false,
        default: undefined
    },
    icon: {
        type: Boolean,
        required: false,
        default: false
    }
});

const { name: alertName, type, icon: showIcon } = toRefs(props);
const alertType = computed((): string => typeVariants[type.value]);
const iconName = computed((): string => defaultIcons[type.value]);

</script>

<style scoped>
.r-alert h4.alert-heading {
    font-size: 1.2rem;
    font-weight: bold;
}
.r-alert.alert-warning .r-icon {
    color: #dba400 !important;
}
.r-alert.alert-info .r-icon {
    color: #0ba7c7 !important;
}
</style>
