<template>
    <div class="nav-item dropdown" :data-name="avatarMenuName">
        <a
            class="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
        >
            <r-avatar :name="avatarMenuName+'-avatar'" :text="avatarMenuText" />
        </a>
        <ul
            v-if="menuOptions && menuOptions.length > 0"
            class="dropdown-menu dropdown-menu-right dropdown-menu-primary"
            aria-labelledby="navbarDarkDropdownMenuLink"
        >
            <template
                v-for="(option, index) in avatarMenuOptions"
                :key="index"
            >
                <li :data-name="avatarMenuName+'-option-'+option.name">
                    <hr v-if="option.separator" />
                    <span v-else>
                        <r-link v-if="option.path" :to="option.path">
                            {{ option.text }}
                        </r-link>
                        <r-link v-if="option.method" :action="option.method">
                            {{ option.text }}
                        </r-link>
                        <template v-if="!option.path && !option.method">
                            {{ option.text }}
                        </template>
                    </span>
                </li>
            </template>
        </ul>
    </div>
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
        avatarText: {
            type: String,
            required: false,
            default: ''
        },
        menuOptions: {
            type: Array,
            required: false,
            default: null
        }
    },
    setup(props) {
        // TODO... lots
        const {
            name: avatarMenuName,
            menuOptions: avatarMenuOptions,
            avatarText: avatarMenuText
        } = toRefs(props);
        return {
            avatarMenuName,
            avatarMenuOptions,
            avatarMenuText
        };
    }
});
</script>

<style>
.dropdown {
    margin-right: 80px;
}
.dropdown-menu {
    padding: 10px;
}
.dropdown-toggle::after {
    content: none;
}
</style>
