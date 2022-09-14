import {Suspense} from 'react';
import '@testing-library/jest-dom'
import DispatchersAdd from './DispatchersAdd'
import { render, screen, act} from '@testing-library/react';

describe('DispatchersAdd', () => {
  describe('textbox placeholder text', () => {
    beforeEach(async () => {
      await act(async () => await render(<Suspense fallback={'loading'}><DispatchersAdd /></Suspense>))
    })
    it ('renders reset feeds', async () => {
      const target = screen.getByPlaceholderText('add dispatcher name here');
      expect(target).toBeInTheDocument()
    })
  });
});