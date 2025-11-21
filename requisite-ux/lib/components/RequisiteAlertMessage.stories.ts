import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RequisiteAlert from './RequisiteAlert.vue';
import RequisiteAlertMessage from './RequisiteAlertMessage.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Requisite/AlertMessage',
    component: RequisiteAlertMessage,
    // This component will have an automatically generated docsPage entry:
    // https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    argTypes: {
        name: { control: 'text' },
        label: { control: 'text' }
    },
    args: {
        name: 'alertMessage',
        label: undefined
    },
} satisfies Meta<typeof RequisiteAlertMessage>;

export default meta;

type Story = StoryObj<typeof meta>;
/*
 * Render functions are a framework specific feature to allow you
 * control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const BasicAlertMessage: Story = {
    render: () => ({
        components: { RequisiteAlert, RequisiteAlertMessage },
        template: `
            <div>
                <RequisiteAlert>
                    <RequisiteAlertMessage>
                        This is a basic alert message inside of a default 'info' alert.
                    </RequisiteAlertMessage>
                </RequisiteAlert>
            </div>
        `,
    })
};

export const MultipleAlertMessages: Story = {
    render: () => ({
        components: { RequisiteAlert, RequisiteAlertMessage },
        template: `
            <div>
                <RequisiteAlert>
                    <RequisiteAlertMessage>
                        This is alert message 1.
                    </RequisiteAlertMessage>
                    <RequisiteAlertMessage>
                        This is alert message 2.
                    </RequisiteAlertMessage>
                </RequisiteAlert>
            </div>
        `,
    })
};

export const AlertMessagesWithLabels: Story = {
    render: () => ({
        components: { RequisiteAlert, RequisiteAlertMessage },
        template: `
            <div>
                <RequisiteAlert>
                    <RequisiteAlertMessage label="Alert 1">
                        This is alert message 1.
                    </RequisiteAlertMessage>
                    <RequisiteAlertMessage label="Alert 2">
                        This is alert message 2.
                    </RequisiteAlertMessage>
                </RequisiteAlert>
            </div>
        `,
    })
};





