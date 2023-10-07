<template>
    <IFormGroup
        :data-name="controlsName"
        class="r-form-controls"
    >
        <slot />
    </IFormGroup>
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
        const { name: controlsName } = toRefs(props);
        return { controlsName };
    }
});
</script>
