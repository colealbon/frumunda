import { Suspense } from 'react';
import '@testing-library/jest-dom'
import { 
  render, 
  screen, 
  act, 
  waitFor
} from '@testing-library/react';
import user from '@testing-library/user-event'
import FeedCategories from './FeedCategories'
//import defaultFeeds from '../react-hooks/defaultFeeds.json';

describe('FeedCategores', () => {
  describe('FeedCategories component', () => {
    beforeEach(async () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      await act(async () => await render(
      <Suspense fallback={'loading'}>
        <FeedCategories text='https://www.thelancet.com/rssfeed/lancet_current.xml' />
      </Suspense>))
    })
    it ('renders', async () => {
      await waitFor(() => {
        expect(screen.getByText('medicine'))
      })
    })
    it ('renders', async () => {
      await waitFor(() => {
        expect(screen.getByText('medicine'))
      })
    })
    it ('click on feed category flips active status', async () => {
      // const { fetchFileLocal } = useStorage();

      await waitFor( async () => {
        const CategoryParent = screen.getByText(/medicine/i).parentNode
        expect(CategoryParent).toHaveClass('MuiChip-colorPrimary');
        const CategoryChip = screen.getByText(/medicine/i)
        await waitFor( async () => {
          user.click(CategoryChip)
          const CategoryParentAfter = screen.getByText(/medicine/i).parentNode
          expect(CategoryParentAfter).toHaveClass('MuiChip-colorDefault');
        }) 
      })
    })
  })
});