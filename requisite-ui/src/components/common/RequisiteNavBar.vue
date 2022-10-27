<template>
    <nav class="navbar navbar-expand navbar-dark bg-info" :data-name="name">
        <div class="navbar-brand" data-name="title">{{ navBarTitle }}</div>
        <div class="navbar-text" data-name="subtitle">{{ navBarSubtitle }}</div>
        <ul class="navbar-nav justify-content-end" data-name="nav">
            <slot />
        </ul>
    </nav>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
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
        const userName = ref('NthngAlone');
        const initials = ref('DW');
        return {
            navBarName,
            navBarTitle,
            navBarSubtitle,
            userName,
            initials
        };
    }
});
</script>

<style>
.navbar {
    padding-left: 10px;
    padding-right: 10px;
}
.navbar-expand .navbar-nav {
    width: 100%;
}
.dropdown-toggle::after {
    content: none;
}
</style>
