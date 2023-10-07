<template>
    <div class="requisite-system-error">
        <r-alert
            v-if="display"
            type="error"
            name="system-error"
        >
            The system is experiencing technical difficulties.
        </r-alert>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        display: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    setup(props) {
        return props;
    }
});
</script>
