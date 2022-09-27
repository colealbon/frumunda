import { Suspense } from 'react';
import '@testing-library/jest-dom'
import CategoryChooser from './CategoryChooser'
import { render, screen, act, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event'

describe('CategoryChooser', () => {
  describe('CategoryChooser component', () => {
    beforeEach(async () => {
      await act(async () => await render(<Suspense fallback={'loading'}><CategoryChooser /></Suspense>))
    })
    it ('renders checked category', async () => {
      await waitFor(() => {
        const getText = screen.getByText(/business/i)
        expect(getText).not.toBeNull()
      })
    })
    it ('does not render unchecked category ', async () => {
      await waitFor(() => {
        expect(screen.findByText(/maritime/i).toBeUndefined)
      })
    })

    it ('click posts shuts the drawer', async () => {
      await waitFor(() => {
        const getText = screen.getByText(/business/i)
        expect(getText).not.toBeNull()
      })
      const selectAllCategories = screen.findByText('/posts/i')
      user.click(selectAllCategories)
      await waitFor(() => {
        expect(screen.findByText(/business/i).toBeUndefined)
      })
    })
    // it ('click icon opens the drawer', async () => {
    //   const openDrawerButton = screen.getByRole('button', {
    //     name: /open drawer/i
    //   })
    //   // user.click(openDrawerButton)
    //   // await waitFor(() => {
    //   //   expect(true).toEqual(true)
    //   //   // const getText = screen.getByText(/posts/i)
    //   //   // expect(getText).toBeVisible()
    //   // })
    // })
  })
});