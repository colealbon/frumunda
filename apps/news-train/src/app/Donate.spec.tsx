import { render } from '@testing-library/react';

import Donate from './Donate';

describe('Donate', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Donate />);
    expect(baseElement).toBeTruthy();
  });
});