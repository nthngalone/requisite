import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RequisiteLink from './RequisiteLink.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Requisite/Link',
    component: RequisiteLink,
    // This component will have an automatically generated docsPage entry:
    // https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    argTypes: {
        name: { control: 'text' }
    },
    args: {
        name: 'textbox',
        action: function(){/* do nothing */}
    },
} satisfies Meta<typeof RequisiteLink>;

export default meta;

type Story = StoryObj<typeof meta>;
/*
 * Render functions are a framework specific feature to allow you
 * control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const BasicLink: Story = {
    render: () => ({
        components: { RequisiteLink },
        template: `
            <div>
                <RequisiteLink>Link 1</RequisiteLink>
                It is a block element/button useful for menus.
            </div>
        `,
    })
};

export const InlineLink: Story = {
    render: () => ({
        components: { RequisiteLink },
        template: `
            <div>
                This is an inline <RequisiteLink inline>link</RequisiteLink>.  It removes padding, border width, and resets the baseline so that it can appear line with other text.
            </div>
        `,
    })
};

