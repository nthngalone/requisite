<template>
    <nav
        :data-name="navBarName"
        class="r-navbar navbar"
    >
        <div class="container-fluid">
            <span class="r-nav-element navbar-brand mb-0 h1" data-name="title">
                {{ navBarTitle }}
            </span>
            <span class="r-nav-element text-muted" data-name="subtitle">
                {{ navBarSubtitle }}
            </span>
            <div class="me-auto"></div>
            <slot />
        </div>
    </nav>
</template>

<script setup lang="ts">

import { toRefs } from 'vue';

const props = defineProps({
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
});

const {
    name: navBarName,
    title: navBarTitle,
    subtitle: navBarSubtitle
} = toRefs(props);

</script>
