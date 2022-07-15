import {
  FunctionComponent,
  ReactNode,
  createContext,
  useContext
} from 'react';
import {useProcessedPosts} from '../react-hooks/useProcessedPosts'
import useSWR from 'swr';
import {useStacks} from '../react-hooks/useStacks'
import {StacksFilenamesContext} from './StacksFilenames'
import {ParsedFeedContentContext} from './Feed'
import {shortUrl} from '../utils'

export const ProcessedPostsFromStacksContext = createContext({});

type Props = {children: ReactNode}

const ProcessedPostsFromStacks: FunctionComponent<Props> = ({children}: Props ) => {
  const { stacksStorage }  = useStacks()
  const stacksFilenamesContext = useContext(StacksFilenamesContext)
  const stacksFilenames = [...stacksFilenamesContext as string[]] 
  const {processedPosts, persistProcessedPosts} = useProcessedPosts()
  const parsedFeedContentContext = useContext(ParsedFeedContentContext)
  const parsedFeedContent = structuredClone(parsedFeedContentContext as object)
  const keyForFeed = Object.keys(parsedFeedContent)[0]
  const filenameForFeed = `processed_${shortUrl(keyForFeed)}`


  const fetcher = (fileName: string, blockstackStorage: any) => {
    return new Promise(resolve => {
      const fetchQueue: unknown[] = []
      stacksFilenames
      .filter((filename: string) => `${filename.toString()}` === filenameForFeed)
      .filter(noEmpties => !!noEmpties)
      .forEach((filename: string) => fetchQueue.push(
        stacksStorage.getFile(`${filename.toString()}`, {decrypt: true})
        .then((fetchedContent) => {
          const processedPostsFromStacks = JSON.parse(`${fetchedContent}`)
          const newProcessedPosts = structuredClone({...processedPosts as object, ...processedPostsFromStacks})
          persistProcessedPosts(newProcessedPosts)
          resolve(newProcessedPosts)
        })
      ))

      Promise.all(fetchQueue)
      .then(processedPosts => {
        resolve([])
      })
      .catch((error: Error) => console.log(error))
      .finally(() => resolve([]))
    });
  };

  const { data } = useSWR(`processed_${shortUrl(keyForFeed)}`, fetcher, {
    suspense: true,
    shouldRetryOnError: false,
    //dedupingInterval: 600 * 1000,
    //revalidateOnFocus: false
  });

  const processedPostsForFeed = structuredClone(data)

  return (
    <ProcessedPostsFromStacksContext.Provider value={processedPostsForFeed}>
      {children}
    </ProcessedPostsFromStacksContext.Provider>
  );
};

export default ProcessedPostsFromStacks;
