<template>
    <div :class="txtClass" :data-name="txtName">
        <label :for="txtId" class="form-label">{{ txtLabel }}</label>
        <input
            v-model="txtValue"
            :id="txtId"
            :name="txtName"
            class="form-control"
            :type="txtType"
            :placeholder="placeholder"
        />
    </div>
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
        class: {
            type: String,
            required: false,
            default: ''
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
            class: className,
            label: txtLabel,
            modelValue,
            type: txtType,
            placeholder: txtPlaceholder
        } = toRefs(props);
        const txtClass = computed((): string => ['mb-3', className.value].join(' '));
        const id = uid();
        const txtId = computed((): string => `${txtName.value}-${id}`);
        // TODO what is mb-3 boostrap style?
        const txtValue = ref(`${modelValue.value}`);
        watch(txtValue, (newTxtValue) => {
            ctx.emit('update:modelValue', newTxtValue);
        });
        return {
            txtId,
            txtName,
            txtClass,
            txtLabel,
            txtValue,
            txtType,
            txtPlaceholder
        };
    }
});
</script>
