import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import TextboxSensitive from './RequisiteTextboxSensitive.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Requisite/TextboxSensitive',
    component: TextboxSensitive,
    // This component will have an automatically generated docsPage entry:
    // https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    argTypes: {
        name: { control: 'text' },
        label: { control: 'text' },
        modelValue: { control: 'text' },
        helpText: { control: 'text' },
        reveal: { control: 'boolean' }
    },
    args: {
        name: 'textbox',
        label: 'Textbox Label',
        modelValue: '',
        helpText: undefined,
        reveal: false
    },
} satisfies Meta<typeof TextboxSensitive>;

export default meta;

type Story = StoryObj<typeof meta>;
/*
 * Render functions are a framework specific feature to allow you
 * control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const BasicSensitiveTextbox: Story = {
    args: {
        helpText: undefined
    }
};
export const SensitiveTextboxWithHelpText: Story = {
    args: {
        helpText: 'This is a help text for the sensitive textbox.'
    },
};
export const SensitiveTextboxWithReveal: Story = {
    args: {
        reveal: true
    },
};
export const SensitiveTextboxWithModelBinding: Story = {
    render: () => ({
        components: { TextboxSensitive },
        setup() {
            const value = ref('password123');
            return { value };
        },
        template: `
            <div>
                <TextboxSensitive v-model="value" name="sensitiveTextbox" label="Sensitive Textbox Label" />
                <p style="margin-top: 1rem;">Current value: {{ value }}</p>
            </div>
        `,
    })
};

