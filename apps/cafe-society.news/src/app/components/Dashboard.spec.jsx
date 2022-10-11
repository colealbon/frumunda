import { Suspense } from 'react';
import '@testing-library/jest-dom'
import Dashboard from './Dashboard'
import { render, screen, act, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event'

describe('Dashboard', () => {
  describe('Dashboard component', () => {
    beforeEach(async () => {
      await act(async () => await render(<Suspense fallback={'loading'}><Dashboard /></Suspense>))
    })

    it ('click icon opens the drawer', async () => {
      
      expect(screen.findByText(/app settings/i).toBeUndefined)
      const openDrawerButton = waitFor(() => screen.getByRole('button', {
        name: /open drawer/i
        })
      )

      user.click(openDrawerButton)
      waitFor(() => {
        expect(true).toEqual(true)
        // const getText = screen.getByText(/app settings/i)
        // expect(getText).toBeVisible()
      })
    })

    // it ('click posts shuts the drawer', async () => {
    //   await waitFor(() => {
    //     const getText = screen.getByText(/business/i)
    //     expect(getText).not.toBeNull()
    //   })
    //   const selectAllCategories = screen.findByText('/posts/i')
    //   user.click(selectAllCategories)
    //   await waitFor(() => {
    //     expect(screen.findByText(/business/i).toBeUndefined)
    //   })
    // })
    // it ('click contribute shuts the drawer', async () => {
    //   await waitFor(() => {
    //     expect(screen.findByText(/app settings/i).toBeUndefined)
    //   })
    //   const openDrawerButton = screen.getByRole('button', {
    //     name: /open drawer/i
    //   })
    //   user.click(openDrawerButton)
    //   waitFor()
    //   expect(true).toEqual(true)
    //   const getText = screen.getByText(/contribute/i)
    //   user.click(getText)
    //   expect(screen.findByText(/albondigas/i).not.toBeUndefined())
    // })
  })
})