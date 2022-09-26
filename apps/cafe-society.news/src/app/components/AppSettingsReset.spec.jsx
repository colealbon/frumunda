import { Suspense } from 'react';
import '@testing-library/jest-dom'
import AppSettingsReset from './AppSettingsReset'
import { render, screen, act } from '@testing-library/react';
import user from '@testing-library/user-event'

describe('AppSettingsReset', () => {
  describe('AppSettingsReset - reset app settings button', () => {
    const handleOnClick = jest.fn()
    beforeEach(async () => {
      await act(async () => await render(<Suspense fallback={'loading'}><AppSettingsReset onClick={handleOnClick}/></Suspense>))
    })
    it ('renders clickable reset app settings button', () => {
      const target = screen.getByRole('button', {
        name: /reset app settings/i
      })
      user.click(target)
    })
  });
});