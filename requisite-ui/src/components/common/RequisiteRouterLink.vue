<template>
    <r-link
        :name="name"
        :inline="inline"
        :action="clickHandler"
    >
        <slot />
    </r-link>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import useRouterUtils from '../../router/useRouterUtils';

const { routeByPath } = useRouterUtils();

const props = defineProps({
    name: {
        type: String,
        required: false,
        default: ''
    },
    action: {
        type: Function,
        required: false,
        default: null
    },
    to: {
        type: String,
        required: false,
        default: undefined
    },
    inline: {
        type: Boolean,
        required: false,
        default: false
    }
});
const { name, action, to, inline } = toRefs(props);

const clickHandler = () => {
    if (action.value) {
        action.value();
    } else if (to?.value) {
        routeByPath(to.value);
    }
};
</script>
