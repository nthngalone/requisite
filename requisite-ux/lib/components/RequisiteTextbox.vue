<template>
    <div class="r-textbox mb-3" :data-name="txtName">
        <label
            :for="txtId"
            class="r-textbox-label form-label"
        >
            {{ txtLabel }}
        </label>
        <input
            :id="txtId"
            :type="txtType"
            :aria-describedby="txtHelpText ? txtId+'-help' : undefined"
            :value="txtValue"
            class="r-textbox-input form-control"
            @input="emitChange('input', $event.target)"
        >
        <div
            v-if="txtHelpText"
            :id="txtId+'-help'"
            class="r-textbox-help form-text"
        >
            {{ txtHelpText }}
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
        type: String,
        required: false,
        default: null
    },
    type: {
        type: String,
        required: false,
        default: 'text'
    },
    helpText: {
        type: String,
        required: false,
        default: null
    }
});

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>();

const {
    name: txtName,
    label: txtLabel,
    modelValue,
    type: txtType,
    helpText: txtHelpText
} = toRefs(props);

const id = uid();
const txtId = computed((): string => `${txtName.value}-${id}`);
const txtValue = ref(`${modelValue.value}`);

function emitChange(name: string, target: EventTarget | null): void {
    const element = target as HTMLInputElement;
    txtValue.value = element.value;
    emit('update:modelValue', element.value);
}

</script>
