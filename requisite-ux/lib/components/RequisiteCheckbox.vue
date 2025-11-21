<template>
    <div
        class="r-checkbox form-check"
        :data-name="chkName"
    >
        <input
            :id="chkId"
            :name="chkName"
            :checked="chkValue"
            class="r-checkbox-input form-check-input"
            type="checkbox"
            @input="emitChange('input', $event.target)"
        >
        <label
            class="r-checkbox-label form-check-label"
            :for="chkId"
        >
            {{ chkLabel }}
        </label>
        <div
            v-if="chkHelpText"
            :id="chkId+'-help'"
            class="r-checkbox-help form-text"
        >
            {{ chkHelpText }}
        </div>
    </div>
</template>

<script setup lang="ts">

import { computed, ref, toRefs } from 'vue';
import { uid } from './RequisiteComponentUidGenerator';

const props = defineProps({
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
    },
    helpText: {
        type: String,
        required: false,
        default: null
    }
});
const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>();

const {
    name: chkName,
    label: chkLabel,
    modelValue,
    helpText: chkHelpText
} = toRefs(props);

const id = uid();
const chkId = computed((): string => `${chkName.value}-${id}`);
const chkValue = ref(modelValue.value);

function emitChange(name: string, target: EventTarget | null): void {
    const element = target as HTMLInputElement;
    chkValue.value = element.checked;
    emit('update:modelValue', element.checked);
}

</script>
