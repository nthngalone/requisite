<template>
    <IFormGroup
        :data-name="txtName"
        class="r-textbox"
    >
        <IFormLabel :for="txtId">{{ txtLabel }}</IFormLabel>
        <IInput
            v-model="txtValue"
            :id="txtId"
            :name="txtName"
            :type="txtType"
            :placeholder="txtPlaceholder"
        />
    </IFormGroup>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, watch } from 'vue';
import { uid } from './RequisiteComponentUidGenerator';

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
            type: String,
            required: false,
            default: null
        },
        type: {
            type: String,
            required: false,
            default: 'text'
        },
        placeholder: {
            type: String,
            required: false,
            default: ''
        }
    },
    emits: ['update:modelValue'],
    setup(props, ctx) {
        const {
            name: txtName,
            label: txtLabel,
            modelValue,
            type: txtType,
            placeholder: txtPlaceholder
        } = toRefs(props);
        const id = uid();
        const txtId = computed((): string => `${txtName.value}-${id}`);
        const txtValue = ref(`${modelValue.value}`);
        watch(txtValue, (newTxtValue) => {
            ctx.emit('update:modelValue', newTxtValue);
        });
        return {
            txtId,
            txtName,
            txtLabel,
            txtValue,
            txtType,
            txtPlaceholder
        };
    }
});
</script>
