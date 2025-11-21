import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RequisiteIcon from './RequisiteIcon.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Requisite/Icon',
    component: RequisiteIcon,
    // This component will have an automatically generated docsPage entry:
    // https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    argTypes: {
        name: { control: 'text' },
        type: { control: 'select', options: ['', 'primary', 'secondary', 'success', 'info', 'warning', 'danger', 'error'] },
        size: { control: 'select', options: ['', 'sm', 'md', 'lg'] }
    },
    args: {
        name: 'info-circle'
    },
} satisfies Meta<typeof RequisiteIcon>;

export default meta;

type Story = StoryObj<typeof meta>;
/*
 * Render functions are a framework specific feature to allow you
 * control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const InfoIcon: Story = {
    args: {}
};
export const PrimaryLockIcon: Story = {
    args: {
        name: 'lock',
        type: 'primary'
    },
};
export const SecondaryHourglassIcon: Story = {
    args: {
        name: 'hourglass',
        type: 'secondary'
    },
};
export const SuccessCheckIcon: Story = {
    args: {
        name: 'check-circle',
        type: 'success'
    },
};
export const InfoInfoCircleFillIcon: Story = {
    args: {
        name: 'info-circle-fill',
        type: 'info'
    },
};
export const WarningExclamationTriangleIcon: Story = {
    args: {
        name: 'exclamation-triangle-fill',
        type: 'warning'
    },
};
export const DangerXCircleIcon: Story = {
    args: {
        name: 'x-circle-fill',
        type: 'danger'
    },
};
export const ErrorXOctagonIcon: Story = {
    args: {
        name: 'x-octagon-fill',
        type: 'error'
    },
};
export const SmallIcon: Story = {
    args: {
        size: 'sm'
    }
};
export const MediumIcon: Story = {
    args: {
        size: 'md'
    }
};
export const LargeIcon: Story = {
    args: {
        size: 'lg'
    }
};
