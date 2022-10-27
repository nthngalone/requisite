<template>
    <div :class="passClass" :data-name="passName">
        <label :for="passId" class="form-label">{{ passLabel }}</label>
        <input
            v-model="passValue"
            :id="passId"
            :name="passName"
            type="password"
            class="form-control"
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
            class: className,
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
        const passClass = computed((): string => ['mb-3', className.value].join(' '));
        return {
            passId,
            passName,
            passClass,
            passLabel,
            passValue,
            passPlaceholder
        };
    }
});
</script>
