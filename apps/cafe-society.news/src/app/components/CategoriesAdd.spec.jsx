import { Suspense } from 'react';
import '@testing-library/jest-dom'
import CategoriesAdd from './CategoriesAdd'
import { render, screen, act } from '@testing-library/react';

describe('CategoriesAdd', () => {
  describe('CategoriesAdd component', () => {
    beforeEach(async () => {
      await act(async () => await render(<Suspense fallback={'loading'}><CategoriesAdd /></Suspense>))
    })
    it ('renders add category control', () => {
      const target = screen.getByPlaceholderText('add category here');
      expect(target).toBeInTheDocument()
    })
  });
});
