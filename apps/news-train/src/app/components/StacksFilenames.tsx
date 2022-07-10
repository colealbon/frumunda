import React, { FunctionComponent, ReactNode, createContext} from 'react';
import useSWR from 'swr';
import {useStacks} from '../react-hooks/useStacks';

export const StacksFilenamesContext = createContext({});

type Props = {children: ReactNode}

const StacksFilenames: FunctionComponent<Props> = ({children}: Props) => {

  const { stacksStorage }  = useStacks()

  const fetcher = () => {
    return new Promise((resolve, reject) => {
      const fetchedFilenames: string[] = []
      stacksStorage.listFiles((filename: string) => {
        fetchedFilenames.push(filename)
        return true
      })
      .then(() => {
        resolve(fetchedFilenames)
      })
      .catch((error: Error) => {
        reject(new Error('stacks listFiles error -> is user signed in?'))
      })
    })
  };

  const { data } = useSWR('blockstackStorage', fetcher, {
    suspense: true,
    shouldRetryOnError: false,
    revalidateOnFocus: false
  });

  const stacksFilenames: string[] = data as string[]
  

  return (
  <StacksFilenamesContext.Provider value={stacksFilenames}>
    {children}
  </StacksFilenamesContext.Provider>
  )
}

export default StacksFilenames;
