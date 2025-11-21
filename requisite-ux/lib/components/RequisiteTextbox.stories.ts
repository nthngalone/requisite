import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import RequisiteTextbox from './RequisiteTextbox.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Requisite/Textbox',
    component: RequisiteTextbox,
    // This component will have an automatically generated docsPage entry:
    // https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    argTypes: {
        name: { control: 'text' },
        label: { control: 'text' },
        type: { control: 'select', options: ['text', 'password', 'email', 'number'] },
        modelValue: { control: 'text' },
        helpText: { control: 'text' }
    },
    args: {
        name: 'textbox',
        label: 'Textbox Label',
        type: 'text',
        modelValue: '',
        helpText: undefined
    },
} satisfies Meta<typeof RequisiteTextbox>;

export default meta;

type Story = StoryObj<typeof meta>;
/*
 * Render functions are a framework specific feature to allow you
 * control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const BasicTextbox: Story = {
    args: {
        helpText: undefined
    }
};
export const TextboxWithHelpText: Story = {
    args: {
        helpText: 'This is a help text for the textbox.'
    },
};
export const TextboxWithModelBinding: Story = {
    render: () => ({
        components: { RequisiteTextbox },
        setup() {
            const value = ref('Hello');
            return { value };
        },
        template: `
            <div>
                <RequisiteTextbox v-model="value" name="textbox" label="Textbox Label" />
                <p style="margin-top: 1rem;">Current value: {{ value }}</p>
            </div>
        `,
    })
};

