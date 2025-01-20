import { render, screen } from '@testing-library/react';
import { JetsButton } from "./index";

const setup = ({ content }) => {
    render(
        <JetsButton
            content={content}
        />
    )
}

describe('JetsButton', () => {
    it('should render the button content correctly', () => {
        setup({ content: 'Cancel' })
        expect(screen.getByText('Cancel')).toBeInTheDocument()
    })
})