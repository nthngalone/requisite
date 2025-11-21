import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RequisiteAvatar from './RequisiteAvatar.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Requisite/Avatar',
    component: RequisiteAvatar,
    // This component will have an automatically generated docsPage entry:
    // https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    argTypes: {
        name: { control: 'text' },
        text: { control: 'text' }
    },
    args: {
        name: 'avatar',
        text: 'DW'
    },
} satisfies Meta<typeof RequisiteAvatar>;

export default meta;

type Story = StoryObj<typeof meta>;
/*
 * Render functions are a framework specific feature to allow you
 * control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const BasicAvatar: Story = {
    args: {
        name: 'avatar',
        text: 'DW'
    },
};
