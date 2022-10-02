import { Suspense} from 'react';
import '@testing-library/jest-dom'
import ErrorBoundary from './ErrorBoundary'
import { render, screen, act, waitFor } from '@testing-library/react';

describe('ErrorBoundary', () => {
  describe('ErrorBoundary component', () => {
    const TestErrorBoundary = () => {
      throw(new Error("this is a test error"))
    }
    beforeEach(async () => {
      render(<Suspense fallback={'loading'}><ErrorBoundary><TestErrorBoundary /></ErrorBoundary></Suspense>)
    })
    it ('renders error boundary', async () => {
        const findErrorMessage = screen.getByText(/Sorry.. there was an error/i)
        expect(findErrorMessage).not.toBeNull()
    })
  })
});

