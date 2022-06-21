import { render } from '@testing-library/react';

import CorsProxiesEdit from './CorsProxiesEdit';

describe('CorsProxiesEdit', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <CorsProxiesEdit />
    );

    expect(baseElement).toBeTruthy();
  });
});
