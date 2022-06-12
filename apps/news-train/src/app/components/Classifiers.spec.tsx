import { render } from '@testing-library/react';

import Classifiers from './Classifiers';

describe('Classifiers', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Classifiers />);

    expect(baseElement).toBeTruthy();
  });
});
