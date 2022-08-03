import { render } from '@testing-library/react';

import CategoriesEdit from './CategoriesEdit';

describe('CategoriesEdit', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CategoriesEdit />);

    expect(baseElement).toBeTruthy();
  });
});
