<template>
    <IFormGroup
        :data-name="passName"
        class="r-password"
    >
        <IFormLabel :for="passId">{{ passLabel }}</IFormLabel>
        <IInput
            v-model="passValue"
            :id="passId"
            :name="passName"
            :placeholder="passPlaceholder"
            type="password"
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
        placeholder: {
            type: String,
            required: false,
            default: ''
        },
        strengthMeter: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    setup(props, ctx) {
        const {
            name: passName,
            label: passLabel,
            modelValue,
            placeholder: passPlaceholder
        } = toRefs(props);
        // TODO feedback/strength meter
        // TODO mask ("eye") hide/show
        // TODO what is mb-3 boostrap style?
        const id = uid();
        const passId = computed((): string => `${passName.value}-${id}`);
        const passValue = ref(`${modelValue.value}`);
        watch(passValue, (newPassValue) => {
            ctx.emit('update:modelValue', newPassValue);
        });
        return {
            passId,
            passName,
            passLabel,
            passValue,
            passPlaceholder
        };
    }
});
</script>
