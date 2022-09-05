import {Suspense} from 'react';
import '@testing-library/jest-dom'
import FeedsEdit from './FeedsEdit'
import { render, screen, act} from '@testing-library/react';

describe('FeedsEdit', () => {
  describe('FeedsEdit component', () => {
    beforeEach(async () => {
      await act(async () => await render(<Suspense fallback={'loading'}><FeedsEdit /></Suspense>))
    })
    it ('renders reset feeds', async () => {
      const target = screen.getByText('reset feeds');
      expect(target).toBeInTheDocument()
    })
  });
});