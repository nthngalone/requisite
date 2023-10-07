<template>
    <IForm
        :data-name="formName"
        class="r-form"
    >
        <slot />
    </IForm>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';

export default defineComponent({
    props: {
        name: {
            type: String,
            required: false,
            default: ''
        }
    },
    setup(props) {
        const { name: formName } = toRefs(props);
        return { formName };
    }
});
</script>
