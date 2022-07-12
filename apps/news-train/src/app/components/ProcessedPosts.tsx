import React, {
  FunctionComponent,
  ReactNode,
  createContext,
  useContext,
} from 'react';
import {useProcessedPosts} from '../react-hooks/useProcessedPosts'
// import {useProcessedPosts} from '../react-hooks/useProcessedPosts'
import useSWR from 'swr';
import { ParsedFeedContentContext } from './Feed'
import { shortUrl } from '../utils.js'

export const ProcessedPostsContext = createContext({});

type Props = {children: ReactNode}

const ProcessedPosts: FunctionComponent<Props> = ({children}: Props ) => {
  const {processedPosts} = useProcessedPosts()
  // const blockstackStorageContext = useContext(BlockstackStorageContext);
  // const blockstackStorage = Object.assign(blockstackStorageContext);
  const parsedFeedContentContext = useContext(ParsedFeedContentContext)
  const parsedFeedContent = structuredClone(parsedFeedContentContext as object)
  const keyForFeed = Object.keys(parsedFeedContent)[0]

  // const fetcher = (fileName: string, blockstackStorage: any) => {
  //   return new Promise(resolve => {
  //     const fetchQueue: any[] = []
  //     Object.values(blockstackFilenames)
  //     .filter(notEmpty => !!notEmpty)
  //     .filter((filename: any) => `${filename.toString()}` === filenameForFeed)
  //     .forEach((filename: any) => fetchQueue.push(
  //       blockstackStorage.getFile(`${filename.toString()}`, {decrypt: true})
  //       .then((fetchedContent: string) => {
  //         resolve(unique(fetchedContent.split(',').map((postText: string) => {
  //           return(removePunctuation(removeTrackingGarbage(postText)))
  //         })))
  //       })
  //     ))

  //     Promise.all(fetchQueue)
  //     .then(processedPosts => {
  //       resolve([])
  //     })
  //     .catch((error: any) => console.log(error))
  //     .finally(() => resolve([]))
  //   });
  // };

  const fetcher = () => {
    return new Promise(resolve => {
      const processedPostsForFeed = Object.entries(processedPosts as object)
        .filter(processedPostsEntry => {
            return processedPostsEntry[0] === keyForFeed
        })
        .map(processedPostsEntry => processedPostsEntry[1])
        .find(() => true)
      resolve(processedPostsForFeed)
    })
  }

  const { data, error } = useSWR(`processed_${shortUrl(keyForFeed)}`, fetcher, {
    suspense: true,
    shouldRetryOnError: false,
    //dedupingInterval: 600 * 1000,
    //revalidateOnFocus: false
  });

  if (error) {
    return (
      <ProcessedPostsContext.Provider value={[]}>
        {children}
      </ProcessedPostsContext.Provider>
    )
  }

  const processedPostsForFeed = structuredClone(data)

  return (
    <ProcessedPostsContext.Provider value={processedPostsForFeed}>
      {children}
    </ProcessedPostsContext.Provider>
  );
};

export default ProcessedPosts;
