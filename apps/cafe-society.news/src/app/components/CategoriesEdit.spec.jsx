import { Suspense } from 'react';
import '@testing-library/jest-dom'
import CategoriesEdit from './CategoriesEdit'
import { render, screen, act, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event'

describe('CategoriesEdit', () => {
  describe('CategoriesEdit component', () => {
    beforeEach(async () => {
      await act(async () => await render(<Suspense fallback={'loading'}><CategoriesEdit /></Suspense>))
    })
    it ('renders add category control', () => {
      const target = screen.getByPlaceholderText('add category here');
      expect(target).toBeInTheDocument()
    })

    it ('categories add control adds a category', async () => {
      const addBanana = screen.getByPlaceholderText('add category here');
      user.type(addBanana, 'banana{enter}')
      await waitFor(() => {
        const bananaCategory = screen.getByText(/banana/i)
        expect(bananaCategory).not.toBeNull()
      })
    })
    it ('reset button removes spurious category', async () => {
      const addBanana = screen.getByPlaceholderText('add category here');
      user.type(addBanana, 'banana{enter}')
      await waitFor(() => {
        const bananaCategory = screen.getByText(/banana/i)
        expect(bananaCategory).not.toBeNull()
      })
      const resetButton = screen.getByRole('button', {
        name: /reset categories/i
      })
      user.click(resetButton)
      await waitFor(() => {
        expect(screen.findByText(/banana/i).toBeUndefined)
      })
    })
  })
});

