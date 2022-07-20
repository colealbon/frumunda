import {
  FunctionComponent,
  ReactNode,
  createContext,
  useContext
} from 'react';
import {useProcessedPosts} from '../react-hooks/useProcessedPosts'
import useSWR from 'swr';
import {useStacks} from '../react-hooks/useStacks'
import {ParsedFeedContentContext} from './Feed'
import {shortUrl} from '../utils'

export const ProcessedPostsFromStacksContext = createContext({});

type Props = {children: ReactNode}

const ProcessedPostsFromStacks: FunctionComponent<Props> = ({children}: Props ) => {
  const { fetchFile }  = useStacks()
  const {processedPosts} = useProcessedPosts()
  const parsedFeedContentContext = useContext(ParsedFeedContentContext)
  const parsedFeedContent = structuredClone(parsedFeedContentContext as object)
  const keyForFeed = Object.keys(parsedFeedContent)[0]

  
  // const fetchFromStacks = () => {
  //   return new Promise((resolve, reject) => {
  //     const fetchQueue: unknown[] = []
  //     stacksFilenames
  //     .filter((stacksFilename: string) => `${stacksFilename.toString()}` === filenameForFeed)
  //     .filter(noEmpties => !!noEmpties)
  //     .forEach((filename: string) => fetchQueue.push(
  //       fetchFile(filename)
  //       .then((fetchedContent: string) => {         
  //         resolve(JSON.parse(`${fetchedContent}`))
  //       })
  //     ))

  //     Promise.all(fetchQueue)
  //     .then(processedPosts => {
  //       reject(new Error('stacks file not found'))
  //     })
  //     .catch((error: Error) => reject(error))
  //   });
  // };

  const { data: processedPostsForFeed } = useSWR(
    `processed_${shortUrl(keyForFeed)}`,
    fetchFile, 
    {
      fallbackData: {...processedPosts as object}[keyForFeed]
    });

  return (
    <pre>{JSON.stringify(processedPostsForFeed as object, null, 2)}</pre>
  )

  return (
    <ProcessedPostsFromStacksContext.Provider value={processedPostsForFeed as object}>
      {children}
    </ProcessedPostsFromStacksContext.Provider>
  );
};

export default ProcessedPostsFromStacks;
