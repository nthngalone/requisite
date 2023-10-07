<template>
    <IButton
        :data-name="avatarName"
        color="primary"
        class="r-avatar"
        circle
    >
        {{ displayTxt }}
    </IButton>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
export default defineComponent({
    props: {
        name: {
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
        const { name: avatarName, text: displayTxt } = toRefs(props);
        return {
            avatarName,
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
