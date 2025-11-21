<template>
    <div class="r-textbox-sensitive mb-3" :data-name="txtName">
        <label
            :for="txtId"
            class="r-textbox-sensitive-label form-label"
        >
            {{ txtLabel }}
        </label>
        <div class="input-group mb-3">
            <input
                :id="txtId"
                :name="txtName"
                :type="txtType"
                :aria-describedby="txtHelpText ? txtId+'-help' : undefined"
                :value="txtValue"
                class="r-textbox-sensitive-input form-control"
                @input="emitChange('input', $event.target)"
            >
            <span class="input-group-text" v-if="txtReveal">
                <requisite-button
                    :iconName="revealIconName"
                    :label="revealIconLabel"
                    @click="toggleReveal()"
                />
            </span>
        </div>
        <div
            v-if="txtHelpText"
            :id="txtId+'-help'"
            class="r-textbox-sensitive-help form-text"
        >
            {{ txtHelpText }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import { uid } from './RequisiteComponentUidGenerator';
import RequisiteButton from './RequisiteButton.vue';

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
    helpText: {
        type: String,
        required: false,
        default: null
    },
    reveal: {
        type: Boolean,
        required: false,
        default: false
    }
});

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>();

const {
    name: txtName,
    label: txtLabel,
    modelValue,
    helpText: txtHelpText,
    reveal: txtReveal
} = toRefs(props);

const txtType = ref('password'); // Default type for sensitive textboxes
// const txtConfirmType = ref('password'); // Type for sensitive textboxes

const id = uid();
const txtId = computed((): string => `${txtName.value}-${id}`);
const txtValue = ref(`${modelValue.value}`);
const txtRevealState = ref(false);

const REVEAL_ICON_NAME_REVEAL = 'eye';
const REVEAL_ICON_LABEL_REVEAL = 'Reveal Sensitive Information';

const REVEAL_ICON_NAME_HIDE = 'eye-slash';
const REVEAL_ICON_LABEL_HIDE = 'Hide Sensitive Information';

const revealIconName = ref('eye');
const revealIconLabel = ref(REVEAL_ICON_LABEL_REVEAL);

function emitChange(name: string, target: EventTarget | null): void {
    const element = target as HTMLInputElement;
    txtValue.value = element.value;
    emit('update:modelValue', element.value);
}

function toggleReveal(): void {
    txtRevealState.value = !txtRevealState.value;
    txtType.value = txtRevealState.value ? 'text' : 'password';
    revealIconName.value = txtRevealState.value
        ? REVEAL_ICON_NAME_HIDE
        : REVEAL_ICON_NAME_REVEAL;
    revealIconLabel.value = txtRevealState.value
        ? REVEAL_ICON_LABEL_HIDE
        : REVEAL_ICON_LABEL_REVEAL;
}

</script>

<style scoped>
.r-button {
    background: inherit;
    color: inherit;
    border: 0px solid #FFF;
    padding: 0px;
}
</style>
