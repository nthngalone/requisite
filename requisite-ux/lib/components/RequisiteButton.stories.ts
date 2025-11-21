import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RequisiteButton from './RequisiteButton.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Requisite/Button',
    component: RequisiteButton,
    // This component will have an automatically generated docsPage entry:
    // https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    argTypes: {
        name: { control: 'text' },
        type: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'danger'] },
        iconName: { control: 'text' },
        label: { control: 'text' }
    },
    args: {
        name: 'button',
        type: undefined,
        iconName: undefined,
        label: undefined
    },
} satisfies Meta<typeof RequisiteButton>;

export default meta;

type Story = StoryObj<typeof meta>;
/*
 * Render functions are a framework specific feature to allow you
 * control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const DefaultButton: Story = {
    render: () => ({
        components: { RequisiteButton },
        template: `
            <div>
                <RequisiteButton>
                    Default Button
                </RequisiteButton>
            </div>
        `,
    })
};

export const PrimaryButton: Story = {
    render: () => ({
        components: { RequisiteButton },
        template: `
            <div>
                <RequisiteButton type="primary" name="primaryButton">
                    Primary Button
                </RequisiteButton>
            </div>
        `,
    })
};

export const SecondaryButton: Story = {
    render: () => ({
        components: { RequisiteButton },
        template: `
            <div>
                <RequisiteButton type="secondary" name="secondaryButton">
                    Secondary Button
                </RequisiteButton>
            </div>
        `,
    })
};

export const WarningButton: Story = {
    render: () => ({
        components: { RequisiteButton },
        template: `
            <div>
                <RequisiteButton type="warning" name="warningButton">
                    Warning Button
                </RequisiteButton>
            </div>
        `,
    })
};

export const DangerButton: Story = {
    render: () => ({
        components: { RequisiteButton },
        template: `
            <div>
                <RequisiteButton type="danger" name="errorButton">
                    Danger Button
                </RequisiteButton>
            </div>
        `,
    })
};

export const ButtonWithIcon: Story = {
    render: () => ({
        components: { RequisiteButton },
        template: `
            <div>
                <RequisiteButton name="errorButton" iconName="check-circle">
                    Icon Button
                </RequisiteButton>
            </div>
        `,
    })
};

export const ButtonWithIconOnlyWithLabel: Story = {
    render: () => ({
        components: { RequisiteButton },
        template: `
            <div>
                <RequisiteButton name="errorButton" iconName="check-circle" label="Confirm" />
            </div>
        `,
    })
};

export const ButtonWithIconOnlyWithoutLabel: Story = {
    render: () => ({
        components: { RequisiteButton },
        template: `
            <div>
                <RequisiteButton name="errorButton" iconName="check-circle" />
            </div>
        `,
    })
};
