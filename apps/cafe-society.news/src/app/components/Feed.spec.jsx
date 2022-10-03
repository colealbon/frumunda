import { Suspense, createContext, useContext} from 'react';
import '@testing-library/jest-dom'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { 
  render, 
  screen, 
  act, 
  waitFor
} from '@testing-library/react';
import user from '@testing-library/user-event'
import Feed from './Feed'
import CheckedCategory from './CheckedCategory'
import {useStorage} from '../react-hooks/useStorage'
import fetchedFeedContent from './test/fetchedFeedContent'
import Posts from './Posts'

const ParsedFeedContentContext = createContext('')
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
afterEach(() => server.resetHandlers())

describe('Feed', () => {
  describe('Feed component', () => {
    beforeEach(async () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      jest.mock('../react-hooks/useStorage', () => {
        return jest.fn(() => ({
           fetchFileLocal: (filename) => 'science'
        }))
      })
      const DisplayFeed = () => {
        const parsedFeedContent = useContext(ParsedFeedContentContext);
        const feedContent = {...parsedFeedContent}
        return (
          <pre>{JSON.stringify(feedContent, null, 2)}</pre>
      )}
      await act(async () => await render(
      <Suspense fallback={'loading'}>
        <CheckedCategory>
          <Feed>
            <DisplayFeed />
          </Feed>
        </CheckedCategory>
      </Suspense>))
    })
    it ('renders message if no feeds fetched', async () => {
      await waitFor(async () => {
        const getText = screen.getByText(/loading/i)
        expect(getText).not.toBeNull()
      })
    })
  })
});