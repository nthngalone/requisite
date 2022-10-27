<!--
TODO what should be the bootstrap 5 equivalent of this?

bootstrap-vue version
<template>
    <b-avatar :class="className" :text="displayText" variant="primary" />
</template>

prime vue version
<template>
    <Avatar :class="className" :label="displayTxt" />
</template>
-->

<template>
    <div :class="styleClass" :data-name="avatarName">
        {{ displayTxt }}
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
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
        text: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const { name: avatarName, class: className, text: displayTxt } = toRefs(props);
        const styleClass = computed((): string => ['avatar', 'bg-primary', 'rounded-circle', className.value].join(' '));
        return {
            avatarName,
            styleClass,
            displayTxt
        };
    }
});
</script>
<style>
.avatar {
    padding: 5px;
    font-weight: bold;
}
</style>
