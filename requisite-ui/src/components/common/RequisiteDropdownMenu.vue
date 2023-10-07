<template>
    <IDropdown
        :data-name="dropdownMenuName"
        class="r-dropdown-menu"
    >
        <r-avatar
            v-if="useAvatar"
            :name="dropdownMenuName+'-avatar'"
            :text="dropdownMenuText"
        />
        <r-button
            v-else
            :name="dropdownMenuName+'-button'"
        >
            {{ dropdownMenuText }}
        </r-button>
        <template v-if="menuOptions && menuOptions.length > 0" #body>
            <template
                v-for="(option, index) in dropdownMenuOptions"
                :key="index"
            >
                <IDropdownDivider
                    v-if="option.separator"
                    class="r-dropdown-menu-separator"
                />
                <IDropdownItem
                    v-else
                    :data-name="option.name"
                    class="r-dropdown-menu-item"
                >
                    <r-link
                        v-if="option.path"
                        :to="option.path"
                    >
                        {{ option.text }}
                    </r-link>
                    <r-link
                        v-if="option.method"
                        :action="option.method"
                    >
                        {{ option.text }}
                    </r-link>
                    <template v-if="!option.path && !option.method">
                        <span>
                            {{ option.text }}
                        </span>
                    </template>
                </IDropdownItem>
            </template>
        </template>
    </IDropdown>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
import type { Ref } from 'vue';

interface MenuOptions {
    name: string,
    text: string,
    separator: boolean;
    path: string,
    method: () => void
}

export default defineComponent({
    props: {
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
        }
    },
    setup(props) {
        const {
            name: dropdownMenuName,
            buttonText: dropdownMenuText,
            avatar: useAvatar
        } = toRefs(props);
        const dropdownMenuOptions = ref(props.menuOptions) as Ref<MenuOptions[]>;
        return {
            dropdownMenuName,
            dropdownMenuOptions,
            dropdownMenuText,
            useAvatar
        };
    }
});
</script>
