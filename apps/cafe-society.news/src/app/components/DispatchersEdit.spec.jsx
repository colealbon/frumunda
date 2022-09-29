import { Suspense } from 'react';
import '@testing-library/jest-dom'
import DispatchersEdit from './DispatchersEdit'
import { render, screen, act, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event'

describe('DispatchersEdit', () => {
  describe('DispatchersEdit component', () => {
    beforeEach(async () => {
      await act(async () => await render(<Suspense fallback={'loading'}><DispatchersEdit /></Suspense>))
    })
    it ('renders add dispatcher edit control', () => {
      const target = screen.getByPlaceholderText('add dispatcher name here');
      expect(target).toBeInTheDocument()
    })

    it ('dispatchers edit adds a dispatcher', async () => {
      const addBanana = screen.getByPlaceholderText('add dispatcher name here');
      user.type(addBanana, 'banana{enter}')
      await waitFor(() => {
        const bananaDispatcher = screen.getByText('banana')
        expect(bananaDispatcher).not.toBeNull()
      })
    })
    it ('reset button removes spurious dispatcher', async () => {
      const addBanana = screen.getByPlaceholderText('add dispatcher name here');
      user.type(addBanana, 'banana{enter}')
      await waitFor(() => {
        const bananaDispatcher = screen.getByText('banana')
        expect(bananaDispatcher).not.toBeNull()
      })
      const resetButton = screen.getByRole('button', {
        name: /reset dispatchers/i
      })
      user.click(resetButton)
      await waitFor(() => {
        expect(screen.findByText(/banana/i).toBeUndefined)
      })
    })

    it ('reset button removes spurious dispatcher', async () => {
      await waitFor(() => {
        const bananaSection = screen.getByText('banana')
        expect(bananaSection).not.toBeNull()
      })

      const bananaSection = screen.getByText('banana')
      user.click(bananaSection)

      await waitFor(() => {
        const deleteBananaButton = screen.getByRole('button', {
          name: 'delete dispatcher banana'
        })
        expect(deleteBananaButton).not.toBeNull()
      })

      const deleteBananaButton = screen.getByRole('button', {
        name: 'delete dispatcher banana'
      })

      user.click(deleteBananaButton)
      await waitFor(() => {
        expect(screen.findByText(/banana/i).toBeUndefined)
      })
    })
  })
});

