<template>
    <IFormGroup
        :data-name="chkName"
        class="r-checkbox"
    >
        <ICheckbox
            v-model="chkValue"
            :name="chkName"
        >
            {{ chkLabel }}
        </ICheckbox>
    </IFormGroup>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch } from 'vue';

export default defineComponent({
    props: {
        name: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: false,
            default: ''
        },
        modelValue: {
            type: Boolean,
            required: false,
            default: null
        }
    },
    emits: ['update:modelValue'],
    setup(props, ctx) {
        const {
            name: chkName,
            label: chkLabel,
            modelValue
        } = toRefs(props);
        const chkValue = ref(modelValue.value);
        watch(chkValue, (newChkValue) => {
            ctx.emit('update:modelValue', newChkValue);
        });
        return {
            chkName,
            chkLabel,
            chkValue
        };
    }
});
</script>
