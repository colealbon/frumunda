import {
  FunctionComponent,
  ReactNode,
  createContext,
  useContext
} from 'react';
import {useClassifiers} from '../react-hooks/useClassifiers'
import useSWR from 'swr';
import {useStacks} from '../react-hooks/useStacks'
import {StacksFilenamesContext} from './StacksFilenames'
import {CategoryContext} from './Category'

export const ClassifiersFromStacksContext = createContext({});

type Props = {children: ReactNode}

const ClassifiersFromStacks: FunctionComponent<Props> = ({children}: Props ) => {
  const { stacksStorage }  = useStacks()
  const stacksFilenamesContext = useContext(StacksFilenamesContext)
  const stacksFilenames = [...stacksFilenamesContext as string[]] 
  const categoryContext = useContext(CategoryContext)
  const category = `${categoryContext}`
  const {classifiers, persistClassifiers} = useClassifiers()
  const filenameForClassifier = `classifier_${category}`

  const fetcher = (fileName: string, blockstackStorage: any) => {
    return new Promise(resolve => {
      const fetchQueue: unknown[] = []
      stacksFilenames
      .filter((filename: string) => `${filename.toString()}` === filenameForClassifier)
      .filter(noEmpties => !!noEmpties)
      .forEach((filename: string) => fetchQueue.push(
        stacksStorage.getFile(`${filename.toString()}`, {decrypt: true})
        .then((fetchedContent) => {
          const classifiersFromStacks = JSON.parse(`${fetchedContent}`)
          const newClassifiers = structuredClone({...classifiers as object, ...classifiersFromStacks})
          persistClassifiers(newClassifiers)
          resolve(newClassifiers)
        })
      ))

      Promise.all(fetchQueue)
      .then((classifiers) => {
        resolve([])
      })
      .catch((error: Error) => console.log(error))
      .finally(() => resolve([]))
    });
  };

  const { data } = useSWR(`processed_${category}`, fetcher, {
    suspense: true,
    shouldRetryOnError: false,
  });

  const processedPostsForFeed = structuredClone(data)

  return (
    <ClassifiersFromStacksContext.Provider value={processedPostsForFeed}>
      {children}
    </ClassifiersFromStacksContext.Provider>
  );
};

export default ClassifiersFromStacks;
