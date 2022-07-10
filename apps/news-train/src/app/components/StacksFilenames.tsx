import React, { FunctionComponent, ReactNode } from 'react';
import useSWR from 'swr';
import {useStacks} from '../react-hooks/useStacks';
import StacksFileDelete from './StacksFileDelete';

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
  return (
  <>
    {
      stacksFilenames.map((filename: string) => {
        return (
          <div key={filename}>
            <StacksFileDelete text={filename}/>
            {filename}
          </div>
        )
      })
    }
  </>
  )
}

export default StacksFilenames;
