<template>
    <ICard
        :data-name="cardName"
        class="r-card"
    >
        <slot />
    </ICard>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
export default defineComponent({
    props: {
        name: {
            type: String,
            required: false,
            default: ''
        }
    },
    setup(props) {
        const { name: cardName } = toRefs(props);
        return { cardName };
    }
});
</script>
