import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RequisiteNavBar from './RequisiteNavBar.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Requisite/Navbar',
    component: RequisiteNavBar,
    // This component will have an automatically generated docsPage entry:
    // https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    argTypes: {
        name: { control: 'text' },
        title: { control: 'text' },
        subtitle: { control: 'text' }
    },
    args: {
        name: 'navbar',
        title: 'Title',
        subtitle: 'Subtitle'
    },
} satisfies Meta<typeof RequisiteNavBar>;

export default meta;

type Story = StoryObj<typeof meta>;
/*
 * Render functions are a framework specific feature to allow you
 * control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const BasicNavbar: Story = {
    args: {}
};
