import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import Contribute from './Contribute';

describe('Contribute', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Contribute />);
    expect(baseElement).toBeTruthy();
  });
});
