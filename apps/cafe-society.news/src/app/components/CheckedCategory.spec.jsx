import { Suspense, useContext} from 'react';
import '@testing-library/jest-dom'
import Category, {CategoryContext} from './CheckedCategory'
import { render, screen, act, waitFor } from '@testing-library/react';

describe('CheckedCategory', () => {
  describe('CheckedCategory component', () => {
    const DisplayCategory = () => {
      const categoryContext = useContext(CategoryContext);
      const category = `${categoryContext}`;
      return (
        <div>{category}</div>
    )}
    beforeEach(async () => {
      await act(async () => await render(<Suspense fallback={'loading'}><Category><DisplayCategory /></Category></Suspense>))
    })
    it ('skips unchecked category', async () => {
      await waitFor(() => {
        expect(screen.findByText(/maritime/i).toBeUndefined)
      })
    })
    it ('renders checked category', async () => {
      await waitFor(() => {
        const findCategory = screen.getByText(/science/i)
        expect(findCategory).not.toBeNull()
      })
    })
  })
});


