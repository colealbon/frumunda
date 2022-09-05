import {Suspense} from 'react';
import '@testing-library/jest-dom'
import { createContext } from 'react'
import { render, screen, act } from '@testing-library/react';
import Classifier from './Classifier';
const CategoryContext = createContext('');

const ComponentWithContext = (
  <Suspense fallback={'loading'}>
    <CategoryContext.Provider value={'science'}>
      <Classifier />
    </CategoryContext.Provider>
  </Suspense>
)

describe('Classifier', () => {
  describe('Classifier component', () => {
    beforeEach(async () => {
      await act(async () => await render(ComponentWithContext))
    })
    it ('renders category', async () => {
      const target = screen.getByText('submit');
      expect(target).toBeInTheDocument()
    })

  });
});





