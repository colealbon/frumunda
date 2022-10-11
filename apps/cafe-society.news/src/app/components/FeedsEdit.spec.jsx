import { Suspense } from 'react';
import '@testing-library/jest-dom'
import FeedsEdit from './FeedsEdit'
import { render, screen, act, waitFor } from './test/test-utils';
import user from '@testing-library/user-event'

describe('FeedsEdit', () => {
  describe('FeedsEdit component', () => {
    beforeEach(async () => {
      await act(async () => await render(<Suspense fallback={'loading'}><FeedsEdit /></Suspense>))
    })
    it ('renders add feed control', async () => {
      // await waitFor( async () => {
        // getByRole('button', { name: /https\:\//www.thelancet.com/rssfeed/lancet_current.xml/i })
        const knownFeed = screen.findAllByText('https://www.thelancet.com/rssfeed/lancet_current.xml')
        expect(knownFeed).not.toBeNull()
        // const editFeedLabel = screen.findAllByText(/add feed label here \(optional\)/i);
        // expect(editFeedLabel).not.toBeNull()
        const addBanana = screen.getAllByPlaceholderText(/add feed label here \(optional\)/i);
        user.type(addBanana[0], 'banana{enter}')
        // await waitFor(() => {
        //   const bananaLabel = screen.getAllByText(/banana/i)
        //   expect(bananaLabel).not.toBeNull()
        // })
      // })
    })

    it ('feeds add control adds a feed', () => {
      const addBanana = screen.getByPlaceholderText('add feed here');
      user.type(addBanana, 'banana{enter}')
      waitFor(() => {
        const bananaCorsproxy = screen.getByText(/banana/i)
        expect(bananaCorsproxy).not.toBeNull()
      })
    })
    it ('reset button removes spurious feed', () => {
      const addBanana = screen.getByPlaceholderText('add feed here');
      user.type(addBanana, 'banana{enter}')
      waitFor(() => {
        const bananaCorsproxy = screen.getByText(/banana/i)
        expect(bananaCorsproxy).not.toBeNull()
      })
      const resetButton = screen.getByRole('button', {
        name: /reset feeds/i
      })
      user.click(resetButton)
      waitFor(() => {
        expect(screen.findByText(/banana/i).toBeUndefined)
      })
    })
  })
});

