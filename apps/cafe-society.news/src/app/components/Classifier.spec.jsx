import { createContext } from 'react'
import { render } from '@testing-library/react';
import Classifier from './Classifier';
const CategoryContext = createContext('');

describe('Classifier', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <CategoryContext.Provider value={'science'}>
        <Classifier />);
      </CategoryContext.Provider>
    )
    expect(baseElement).toBeTruthy();
  });
});
