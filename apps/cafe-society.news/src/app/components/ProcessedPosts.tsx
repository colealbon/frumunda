import React, {
  FunctionComponent,
  useContext,
  createContext,
  ReactNode,
} from 'react';
import { Storage, StorageOptions } from '@stacks/storage';
import localforage from 'localforage';
import { ParsedFeedContentContext } from './Feed';
import useSWR from 'swr';
import { useStacks } from '../react-hooks/useStacks';
import { shortUrl } from '../utils';

type Props = { children: ReactNode };

export const ProcessedPostsContext = createContext({});
const ProcessedPosts: FunctionComponent<Props> = ({ children }: Props) => {
  const { userSession, fetchStacksFilenames } = useStacks();
  const storageOptions: StorageOptions = { userSession };
  const storage = new Storage(storageOptions);
  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = structuredClone(parsedFeedContentContext);
  const keyForFeed = Object.keys(parsedFeedContent)[0];
  const processedFilenameForFeed = `processed_${shortUrl(keyForFeed)}`;
  const defaultProcessedPosts = JSON.parse(
    `{"${processedFilenameForFeed}":[]}`
  );
  const { data: stacksFilenames } = useSWR(
    'stacksFilenames',
    fetchStacksFilenames,
    { suspense: true }
  );

  const fetcher = () => {
    console.log('fetcher');
    if (!userSession.isUserSignedIn()) {
      localforage.getItem(processedFilenameForFeed).then((value) => {
        if (!value) {
          throw new Error(`no stored ${processedFilenameForFeed}`);
        }
        return value;
      });
    }
    [stacksFilenames]
      .flat()
      .filter((stacksFilename) => {
        return stacksFilename === processedFilenameForFeed;
      })
      .forEach((stacksFilename) => {
        console.log('getFile');
        storage
          .getFile(`${stacksFilename}`, {
            decrypt: true,
          })
          .then((content) => {
            console.log(JSON.parse(`${content}`));
            return JSON.parse(`${content}`);
          })
          .catch((error) => console.log(error));
      });
  };

  const { data: processedPostsdata } = useSWR(
    `processed_${shortUrl(keyForFeed)}`,
    fetcher,
    { suspense: true }
  );
  const processedPosts: object = structuredClone(processedPostsdata);
  // console.log(processedPosts)

  return (
    <ProcessedPostsContext.Provider
      key={JSON.stringify(processedPosts)}
      value={{ ...(processedPosts as object) }}
    >
      <pre>{JSON.stringify(processedPosts, null, 2)}</pre>
    </ProcessedPostsContext.Provider>
  );
};
export default ProcessedPosts;
