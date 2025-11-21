import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RequisiteDropdownMenu from './RequisiteDropdownMenu.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Requisite/DropdownMenu',
    component: RequisiteDropdownMenu,
    // This component will have an automatically generated docsPage entry:
    // https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    argTypes: {
        name: { control: 'text' },
        buttonText: { control: 'text' },
        avatar: { control: 'boolean' },
        rightJustified: { control: 'boolean' }
    },
    args: {
        name: 'menu',
        buttonText: 'Menu',
        avatar: false,
        menuOptions: [],
        rightJustified: false
    },
} satisfies Meta<typeof RequisiteDropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;
/*
 * Render functions are a framework specific feature to allow you
 * control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const BasicDropDown: Story = {
    args: {}
};

export const AvatarDropDown: Story = {
    args: {
        avatar: true
    }
};

export const DropDownWithOptions: Story = {
    args: {
        avatar: true,
        buttonText: 'UN',
        menuOptions: [{
            name: 'user-name',
            type: 'text',
            label: 'User Name'
        }, {
            name: 'separator-1',
            type: 'separator'
        }, {
            name: 'profile-link',
            type: 'link',
            method: function(){/* do nothing */},
            label: 'Profile'
        }, {
            name: 'signout-link',
            type: 'link',
            method: function(){/* do nothing */},
            label: 'Sign Out'
        }]
    }
};

export const DropDownWithOptionsRightJustified: Story = {
    args: {
        avatar: true,
        buttonText: 'UN',
        menuOptions: [{
            name: 'user-name',
            type: 'text',
            label: 'User Name'
        }, {
            name: 'separator-1',
            type: 'separator'
        }, {
            name: 'profile-link',
            type: 'link',
            method: function(){/* do nothing */},
            label: 'Profile'
        }, {
            name: 'signout-link',
            type: 'link',
            method: function(){/* do nothing */},
            label: 'Sign Out'
        }],
        rightJustified: true
    }
};
