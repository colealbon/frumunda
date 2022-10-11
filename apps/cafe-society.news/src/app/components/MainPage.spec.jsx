import { Suspense } from 'react';
import '@testing-library/jest-dom'
// import useSWR, { mutate } from 'swr';
import "@testing-library/jest-dom/extend-expect";
import MainPage from './MainPage'
import { render, screen, act, waitForElementToBeRemoved} from "./test/test-utils"
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import user from '@testing-library/user-event'

import fetchedFeedContent from './test/fetchedFeedContent'

const server = setupServer(
  rest.get(
    /\/.netlify\/functions\/main/,
    (req, res, ctx) => {
      const url = (req.url.searchParams.get('url'))
      const fetchedContentForURL = fetchedFeedContent[url]
      return res(
        ctx.body(fetchedContentForURL)
      )
    })
);

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => {
  server.resetHandlers()
})


describe('MainPage', () => {
  describe('MainPage component', () => {
    beforeEach(async () => {
      await act(async () => await render(<Suspense fallback={'loading'}><MainPage /></Suspense>))
    })
    it ('renders contribute control', async () => {      
      const target = screen.getByText('fetching and processing posts');
      expect(target).toBeInTheDocument()
      // await waitForElementToBeRemoved(() => screen.queryByText('fetching and processing posts'), {timeout: 4500})
      // const contributeButton = screen.getByText('contribute');
      // user.click(contributeButton)
    })
    // it ('renders public key control', () => {
    //   const target = screen.getByPlaceholderText('public key curve25519_pk');
    //   expect(target).toBeInTheDocument()
    // })
    // it ('renders secret key control', () => {
    //   const target = screen.getByPlaceholderText('secret key curve25519_sk');
    //   expect(target).toBeInTheDocument()
    // })
    // it ('renders reset keys button', () => {
    //   const target = screen.getByText('reset keys');
    //   expect(target).toBeInTheDocument()
    // })
    // it ('renders stuff from storage', async () => {
    //   expect(await screen.findByText('lucky-day')).toBeVisible()
    // })
    // it ('toggle is clickable', async () => {
    //   const toggleControl = await screen.getByTestId('toggle_lucky-day')
    //   user.click(toggleControl)
    //   // await waitFor(() => {
    //   //   const bananaCorsproxy = screen.getByText(/banana/i)
    //   //   expect(bananaCorsproxy).not.toBeNull()
    //   // })

    // })

    // it ('cors proxies add control adds a keys', async () => {
    //   const addBanana = screen.getByPlaceholderText('key label');
    //   user.type(addBanana, 'banana{enter}')
    //   await waitFor(() => {
    //     const bananaCorsproxy = screen.getByText(/banana/i)
    //     expect(bananaCorsproxy).not.toBeNull()
    //   })
    // })
    

  });
});