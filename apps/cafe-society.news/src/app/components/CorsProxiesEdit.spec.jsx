import { Suspense } from 'react';
import '@testing-library/jest-dom'
import CorsProxiesEdit from './CorsProxiesEdit'
import { render, screen, act, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event'

describe('CorsProxiesEdit', () => {
  describe('CorsProxiesEdit component', () => {
    beforeEach(async () => {
      await act(async () => await render(<Suspense fallback={'loading'}><CorsProxiesEdit /></Suspense>))
    })
    it ('renders add corsproxy control', () => {
      const target = screen.getByPlaceholderText('add cors proxy here');
      expect(target).toBeInTheDocument()
    })

    it ('cors proxies add control adds a corsproxy', async () => {
      const addBanana = screen.getByPlaceholderText('add cors proxy here');
      user.type(addBanana, 'banana{enter}')
      await waitFor(() => {
        const bananaCorsproxy = screen.getByText(/banana/i)
        expect(bananaCorsproxy).not.toBeNull()
      })
    })
    it ('reset button removes spurious corsproxy', async () => {
      const addBanana = screen.getByPlaceholderText('add cors proxy here');
      user.type(addBanana, 'banana{enter}')
      await waitFor(() => {
        const bananaCorsproxy = screen.getByText(/banana/i)
        expect(bananaCorsproxy).not.toBeNull()
      })
      const resetButton = screen.getByRole('button', {
        name: /reset cors proxies/i
      })
      user.click(resetButton)
      await waitFor(() => {
        expect(screen.findByText(/banana/i).toBeUndefined)
      })
    })

    it ('reset button removes spurious cors proxy', async () => {
      await waitFor(() => {
        const bananaCorsproxy = screen.getByText(/banana/i)
        expect(bananaCorsproxy).not.toBeNull()
      })
      const deleteScienceButton = screen.getByRole('button', {
        name: /delete cors proxy banana/i
      })
      user.click(deleteScienceButton)
      await waitFor(() => {
        expect(screen.findByText(/banana/i).toBeUndefined)
      })
    })
  })
});

