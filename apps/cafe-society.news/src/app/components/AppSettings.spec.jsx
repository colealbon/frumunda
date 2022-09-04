import {Suspense} from 'react';
import '@testing-library/jest-dom'
import AppSettings from './AppSettings'
import { render, screen, waitFor } from '@testing-library/react';
import "fake-indexeddb/auto";

describe('AppSettings', () => {
  describe('AppSettings component', () => {
    beforeEach( async () => {
      render(<Suspense fallback={'loading'}><AppSettings /></Suspense>)
    })
    it ('renders settings hide processed posts', async () => {
      await waitFor(() => {
        const target = screen.getByText('hide processed posts');
        expect(target).toBeInTheDocument()
      })
    })
    it ('renders settings disable machine learning', async () => {
      await waitFor(() => {
        const target = screen.getByText('disable machine learning');
        expect(target).toBeInTheDocument()
      })
    })
    it ('renders settings ignore machine learning under', async () => {
      await waitFor(() => {
        const target = screen.getByText('ignore machine learning under 100 documents');
        expect(target).toBeInTheDocument()
      })
    })
    it ('renders settings machine learning confidence threshold', async () => {
      await waitFor(() => {
        const target = screen.getByText('machine learning confidence threshold: .99');
        expect(target).toBeInTheDocument()
      })
    })
    it ('renders reset button', async () => {
      await waitFor(() => {
        const target = screen.getByText('reset app settings');
        expect(target).toBeInTheDocument()
      })
    })
  });
});