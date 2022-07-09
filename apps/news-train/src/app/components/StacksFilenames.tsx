import React, { FunctionComponent, ReactNode } from 'react';
import useSWR from 'swr';
import {useStacks} from '../react-hooks/useStacks';

const StacksFilenames: FunctionComponent = () => {
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

  const stacksFilenames = structuredClone(data)
  return (<pre>{JSON.stringify(stacksFilenames, null, 2)}</pre>)
};

export default StacksFilenames;
