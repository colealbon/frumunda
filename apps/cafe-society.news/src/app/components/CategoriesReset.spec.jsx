import { Suspense } from 'react';
import '@testing-library/jest-dom'
import CategoriesReset from './CategoriesReset'
import { render, screen, act } from '@testing-library/react';
import user from '@testing-library/user-event'

describe('CategoriesReset', () => {
  describe('CategoriesReset - reset app settings button', () => {
    const handleOnClick = jest.fn()
    beforeEach(async () => {
      await act(async () => await render(<Suspense fallback={'loading'}><CategoriesReset onClick={handleOnClick}/></Suspense>))
    })
    it ('renders clickable reset app settings button', () => {
      const target = screen.getByRole('button', {
        name: /reset categories/i
      })
      user.click(target)
    })
  });
});

