<template>
    <INavbar
        :data-name="name"
        class="r-navbar"
    >
        <INavbarBrand>
            <span class="r-nav-element" data-name="title">{{ navBarTitle }}</span>
        </INavbarBrand>
        <span class="r-nav-element" data-name="subtitle">{{ navBarSubtitle }}</span>
        <INavbarCollapsible class="_justify-content:flex-end">
            <INav>
                <slot />
            </INav>
        </INavbarCollapsible>
    </INavbar>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
export default defineComponent({
    props: {
        name: {
            type: String,
            required: false,
            default: ''
        },
        title: {
            type: String,
            required: false,
            default: ''
        },
        subtitle: {
            type: String,
            required: false,
            default: ''
        }
    },
    setup(props) {
        // TODO... lots
        const {
            name: navBarName,
            title: navBarTitle,
            subtitle: navBarSubtitle
        } = toRefs(props);
        return {
            navBarName,
            navBarTitle,
            navBarSubtitle
        };
    }
});
</script>
