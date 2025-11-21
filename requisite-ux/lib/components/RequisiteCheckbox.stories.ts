import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import RequisiteCheckbox from './RequisiteCheckbox.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Requisite/Checkbox',
    component: RequisiteCheckbox,
    // This component will have an automatically generated docsPage entry:
    // https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    argTypes: {
        name: { control: 'text' },
        label: { control: 'text' },
        modelValue: { control: 'text' },
        helpText: { control: 'text' }
    },
    args: {
        name: 'checkbox',
        label: 'Checkbox Label',
        modelValue: false,
        helpText: undefined
    },
} satisfies Meta<typeof RequisiteCheckbox>;

export default meta;

type Story = StoryObj<typeof meta>;
/*
 * Render functions are a framework specific feature to allow you
 * control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const BasicCheckbox: Story = {
    args: {
        helpText: undefined
    }
};
export const CheckboxWithHelpText: Story = {
    args: {
        helpText: 'This is a help text for the textbox.'
    },
};
export const CheckboxWithModelBinding: Story = {
    render: () => ({
        components: { RequisiteCheckbox },
        setup() {
            const value = ref(true);
            return { value };
        },
        template: `
            <div>
                <RequisiteCheckbox v-model="value" name="checkbox" label="Checkbox Label" />
                <p style="margin-top: 1rem;">Current checked value: {{ value }}</p>
            </div>
        `,
    })
};

