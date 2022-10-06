import {Suspense} from 'react';
import '@testing-library/jest-dom'
import FeedLabel from './FeedLabel'
import { render, screen, act} from '@testing-library/react';

describe('FeedLabel', () => {
  describe('feed label placeholder text', () => {
    beforeEach(async () => {
      await act(async () => await render(<Suspense fallback={'loading'}><FeedLabel text='science' /></Suspense>))
    })
    it ('renders reset feeds', async () => {
      const target = screen.getByPlaceholderText('Add feed label here (optional)');
      expect(target).toBeInTheDocument()
    })
  });
});