<template>
    <div :class="chkClass" :data-name="chkName">
        <input
            v-model="chkValue"
            :id="chkId"
            :name="chkName"
            type="checkbox"
            class="form-check-input"
        />
        <label
            :for="chkId"
            class="form-check-label"
        >
            {{ chkLabel }}
        </label>
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
            type: Boolean,
            required: false,
            default: null
        }
    },
    emits: ['update:modelValue'],
    setup(props, ctx) {
        const id = uid();
        const {
            name: chkName,
            class: className,
            label: chkLabel,
            modelValue
        } = toRefs(props);
        const chkId = computed((): string => `${chkName.value}-${id}`);
        const chkClass = computed((): string => ['form-check', className.value].join(' '));
        const chkValue = ref(`${modelValue.value}`);
        watch(chkValue, (newChkValue) => {
            ctx.emit('update:modelValue', newChkValue);
        });
        return {
            chkId,
            chkName,
            chkClass,
            chkLabel,
            chkValue
        };
    }
});
</script>
