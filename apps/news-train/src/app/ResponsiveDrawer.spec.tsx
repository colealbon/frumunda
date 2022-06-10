import { render } from '@testing-library/react';

import ResponsiveDrawer from './ResponsiveDrawer';

describe('ResponsiveDrawer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ResponsiveDrawer />);

    expect(baseElement).toBeTruthy();
  });
});
