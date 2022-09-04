import {Suspense} from 'react';
import '@testing-library/jest-dom'
import AppSettings from './AppSettings'
import { render, screen, act} from '@testing-library/react';

describe('AppSettings', () => {
  describe('AppSettings component', () => {
    beforeEach(async () => {
      await act(() => render(<Suspense fallback={'loading'}><AppSettings /></Suspense>))
    })
    it ('renders processed posts', () => {
      const target = screen.getByText('hide processed posts');
      expect(target).toBeInTheDocument()
    })
    it ('renders disable machine learning', () => {
      const target = screen.getByText('disable machine learning');
      expect(target).toBeInTheDocument()
    })
    it ('renders ignore ml under 100', () => {
      const target = screen.getByText('ignore machine learning under 100 documents');
      expect(target).toBeInTheDocument()
    })
    it ('renders ml confidence threshold', () => {
      const target = screen.getByText('machine learning confidence threshold: .99');
      expect(target).toBeInTheDocument()
    })
    it ('renders reset button',  () => {
      const target = screen.getByText('reset app settings');
      expect(target).toBeInTheDocument()
    })
  });
});