import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RequisiteAlert from './RequisiteAlert.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Requisite/Alert',
    component: RequisiteAlert,
    // This component will have an automatically generated docsPage entry:
    // https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    argTypes: {
        name: { control: 'text' },
        type: { control: 'select', options: ['success', 'info', 'warning', 'error', 'danger'] },
        heading: { control: 'text' },
        icon: { control: 'boolean' }
    },
    args: {
        name: 'alert',
        type: undefined,
        heading: undefined,
        icon: false
    },
} satisfies Meta<typeof RequisiteAlert>;

export default meta;

type Story = StoryObj<typeof meta>;
/*
 * Render functions are a framework specific feature to allow you
 * control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const BasicAlert: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert>
                    This is a basic alert message with no heading that defaults to 'info'.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const AlertWithHeading: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert heading="Heading">
                    This is a basic alert message with a heading.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const BasicSuccessAlert: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="success">
                    This is a basic success alert.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const SuccessAlertWithIcon: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="success" icon>
                    This is a success alert with the default success icon.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const SuccessAlertWithHeading: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="success" heading="Heading">
                    This is a success alert with a heading.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const SuccessAlertWithHeadingAndIcon: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="success" heading="Heading" icon>
                    This is a success alert with a heading and the default success icon.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const BasicInfoAlert: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="info">
                    This is a basic info alert.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const InfoAlertWithIcon: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="info" icon>
                    This is an info alert with the default info icon.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const InfoAlertWithHeading: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="info" heading="Heading">
                    This is an info alert with a heading.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const InfoAlertWithHeadingAndIcon: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="info" heading="Heading" icon>
                    This is an info alert with a heading and the default info icon.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const BasicWarningAlert: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="warning">
                    This is a basic warning alert.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const WarningAlertWithIcon: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="warning" icon>
                    This is a warning alert with the default warning icon.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const WarningAlertWithHeading: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="warning" heading="Heading">
                    This is a warning alert with a heading.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const WarningAlertWithHeadingAndIcon: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="warning" heading="Heading" icon>
                    This is a warning alert with a heading and the default warning icon.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const BasicDangerAlert: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="danger">
                    This is a basic danger alert.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const DangerAlertWithIcon: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="danger" icon>
                    This is an danger alert with the default danger icon.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const DangerAlertWithHeading: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="danger" heading="Heading">
                    This is an danger alert with a heading.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const DangerAlertWithHeadingAndIcon: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="danger" heading="Heading" icon>
                    This is an danger alert with a heading and the default danger icon.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const BasicErrorAlert: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="error">
                    This is a basic error alert.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const ErrorAlertWithIcon: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="error" icon>
                    This is an error alert with the default error icon.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const ErrorAlertWithHeading: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="error" heading="Heading">
                    This is an error alert with a heading.
                </RequisiteAlert>
            </div>
        `,
    })
};

export const ErrorAlertWithHeadingAndIcon: Story = {
    render: () => ({
        components: { RequisiteAlert },
        template: `
            <div>
                <RequisiteAlert type="error" heading="Heading" icon>
                    This is an error alert with a heading and the default error icon.
                </RequisiteAlert>
            </div>
        `,
    })
};
