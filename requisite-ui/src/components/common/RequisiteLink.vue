<template>
    <IButton
        :data-name="btnName"
        color="primary"
        class="r-link"
        link
        @click="clickHandler">
        <slot />
    </IButton>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { $routeByPath } from '../../router';
export default defineComponent({
    props: {
        name: {
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
        const { name: btnName, to: btnTo, action } = toRefs(props);
        const clickHandler = () => {
            if (btnTo.value) {
                $routeByPath(btnTo.value);
            } else if (action.value) {
                action.value();
            }
        };
        return {
            btnName,
            clickHandler
        };
    }
});
</script>
