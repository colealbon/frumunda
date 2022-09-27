import { Suspense, useContext} from 'react';
import '@testing-library/jest-dom'
import Category, {CategoryContext} from './Category'
import { render, screen, act, waitFor } from '@testing-library/react';

describe('Category', () => {
  describe('Category component', () => {
    const DisplayCategory = () => {
      const categoryContext = useContext(CategoryContext);
      const category = `${categoryContext}`;
      return (
        <div>{category}</div>
    )}
    beforeEach(async () => {
      await act(async () => await render(<Suspense fallback={'loading'}><Category><DisplayCategory /></Category></Suspense>))
    })
    it ('renders add category control', async () => {
      await waitFor(() => {
        const findCategory = screen.getByText(/maritime/i)
        expect(findCategory).not.toBeNull()
      })
    })
  })
});

