import { Suspense, createContext, useContext} from 'react';
import '@testing-library/jest-dom'
import Category from './Category'
import { render, screen, act, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event'
import Feed from './Feed'

const CategoryContext = createContext('science');

describe('Feed', () => {
  describe('Feed component', () => {

    const DisplayCategory = () => {
      const categoryContext = useContext(CategoryContext);
      const category = `${categoryContext}`;
      return (
        <div>{category}</div>
    )}

    beforeEach(async () => {
      await act(async () => await render(<Suspense fallback={'loading'}><CategoryContext.Provider  key={'science'} value={'science'}><Feed><DisplayCategory /></Feed></CategoryContext.Provider></Suspense>))
    })
    it ('renders message if no feeds fetched', async () => {
      await waitFor(() => {
        const getText = screen.getByText(/unable to fetch feed content/i)
        expect(getText).not.toBeNull()
      })
    })
  })
});