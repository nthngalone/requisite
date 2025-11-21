<template>
    <Menu as="div" class="r-dropdown-menu dropdown" :data-name="dropdownMenuName">
        <MenuButton class="border-0 bg-transparent p-0 dropdown-toggle">
            <requisite-avatar
                v-if="useAvatar"
                :name="dropdownMenuName+'-avatar'"
                :text="dropdownMenuText"
            />
            <span v-else>
                {{ dropdownMenuText }}
            </span>
        </MenuButton>

        <MenuItems
            v-if="dropdownMenuOptions && dropdownMenuOptions.length > 0"
            :class="['dropdown-menu', 'show', 'mt-2', justifiedClass].join(' ')"
        >
            <template v-for="(option, index) in dropdownMenuOptions" :key="index">
                <div
                    v-if="option.type === 'separator'"
                    class="r-dropdown-menu-item dropdown-divider"
                    :data-name="option.name"
                ></div>
                <div
                    v-if="option.type === 'text'"
                    class="r-dropdown-menu-item dropdown-item"
                    :data-name="option.name"
                >
                    {{ option.label }}
                </div>
                <MenuItem v-if="option.type === 'link'">
                    <requisite-link
                        class="r-dropdown-menu-item dropdown-item"
                        :action="option.method"
                        :data-name="option.name"
                    >
                        {{ option.label }}
                    </requisite-link>
                </MenuItem>
            </template>
        </MenuItems>
    </Menu>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
import type { Ref } from 'vue';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import RequisiteAvatar from './RequisiteAvatar.vue';
import RequisiteLink from './RequisiteLink.vue';

interface MenuOptions {
    name: string,
    label: string,
    type: string;
    path: string,
    method: () => void
}

const props = defineProps({
    name: {
        type: String,
        required: false,
        default: ''
    },
    buttonText: {
        type: String,
        required: false,
        default: ''
    },
    avatar: {
        type: Boolean,
        required: false,
        default: false
    },
    menuOptions: {
        type: Array,
        required: false,
        default: null
    },
    rightJustified: {
        type: Boolean,
        required: false,
        default: false
    }
});

const {
    name: dropdownMenuName,
    buttonText: dropdownMenuText,
    avatar: useAvatar,
    rightJustified
} = toRefs(props);

const dropdownMenuOptions = ref(props.menuOptions) as Ref<MenuOptions[]>;
const justifiedClass = ref(rightJustified.value ? 'right-justified' : 'left-justified');
</script>

<style scoped>
.dropdown-menu.left-justified {
    left: 0;
}
.dropdown-menu.right-justified {
    right: 0;
}
</style>
