import { createContext } from 'react'
import { render } from '@testing-library/react';
import Contribute from './Contribute';
const CategoryContext = createContext('');


describe('Contribute', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Contribute />);
    expect(baseElement).toBeTruthy();
  });
});


{/* <CategoryContext.Provider key={`${category}`} value={`${category}`}>
{children}
</CategoryContext.Provider> */}