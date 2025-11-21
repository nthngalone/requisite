import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RequisiteCard from './RequisiteCard.vue';
import RequisiteCardBlock from './RequisiteCardBlock.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Requisite/Card',
    component: RequisiteCard,
    // This component will have an automatically generated docsPage entry:
    // https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    argTypes: {
        name: { control: 'text' },
        header: { control: 'text' }
    },
    args: {
        name: 'card',
        header: 'Card Header'
    },
} satisfies Meta<typeof RequisiteCard>;

export default meta;

type Story = StoryObj<typeof meta>;
/*
 * Render functions are a framework specific feature to allow you
 * control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const BasicCardAndBlock: Story = {
    render: () => ({
        components: { RequisiteCard, RequisiteCardBlock },
        template: `
            <RequisiteCard>
                <RequisiteCardBlock>
                    This is a basic card with a element block and content.
                </RequisiteCardBlock>
            </RequisiteCard>
        `,
    })
};

export const CardAndBlockWithHeader: Story = {
    render: () => ({
        components: { RequisiteCard, RequisiteCardBlock },
        template: `
            <RequisiteCard header="Card Header">
                <RequisiteCardBlock>
                    This is a card with a header.
                </RequisiteCardBlock>
            </RequisiteCard>
        `,
    })
};

export const CardAndBlockWithHeaderTitleAndSubtitle: Story = {
    render: () => ({
        components: { RequisiteCard, RequisiteCardBlock },
        template: `
            <RequisiteCard header="Card Header">
                <RequisiteCardBlock title="Card Block Title" subtitle="Card Block Subtitle">
                    This is a card with a header and a block with a title, subtitle, and some content.
                </RequisiteCardBlock>
            </RequisiteCard>
        `,
    })
};

export const CardWithMultipleBlocks: Story = {
    render: () => ({
        components: { RequisiteCard, RequisiteCardBlock },
        template: `
            <RequisiteCard header="Card Header">
                <RequisiteCardBlock title="Card Block 1">
                    This is card block 1.
                </RequisiteCardBlock>
                <RequisiteCardBlock title="Card Block 2">
                    This is card block 2.
                </RequisiteCardBlock>
            </RequisiteCard>
        `,
    })
};
