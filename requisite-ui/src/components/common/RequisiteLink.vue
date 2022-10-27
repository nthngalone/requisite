<template>
    <a
        href="javascript:void(0);"
        :class="btnClass"
        :data-name="btnName"
        @click="clickHandler()"
    >
        <slot />
    </a>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { $routeByPath } from '../../router';
export default defineComponent({
    props: {
        name: {
            type: String,
            required: false,
            default: ''
        },
        class: {
            type: String,
            required: false,
            default: ''
        },
        to: {
            type: String,
            required: false,
            default: null
        },
        action: {
            type: Function,
            required: false,
            default: null
        }
    },
    setup(props) {
        const { name: btnName, class: className, to: btnTo, action } = toRefs(props);
        const btnClass = computed(() => ['link', className.value].join(' '));
        const clickHandler = () => {
            if (btnTo.value) {
                $routeByPath(btnTo.value);
            } else if (action.value) {
                action.value();
            }
        };
        return {
            btnName,
            className,
            btnClass,
            clickHandler
        };
    }
});
</script>
