import { useState, useCallback} from 'react';
import useSWR  from 'swr';
import localforage from 'localforage'
import defaultProcessedPosts from './defaultProcessedPosts.json'

export function useProcessedPosts () {

  const fetcher = () => localforage.getItem('processedPosts')

  const { data, mutate } = useSWR(
    'processedPosts',
    fetcher , 
    {
      suspense: true
    }
  )

  const [inFlight, setInFlight] = useState(false)

  const persistProcessedPosts = useCallback((newProcessedPosts: unknown) => {
    setInFlight(true)
    const newProcessedPostsClone = structuredClone(newProcessedPosts)
    const updateFn = (newProcessedPosts: object) => {
      const newProcessedPostsClone = structuredClone(newProcessedPosts)
      return new Promise((resolve) => {
        localforage.setItem('processedPosts', newProcessedPostsClone)
        setInFlight(false)
        resolve(newProcessedPostsClone)
      })
    }
    mutate(updateFn(newProcessedPostsClone));
  }, [ mutate ])

  const factoryReset = () => {
    persistProcessedPosts(defaultProcessedPosts)
  }
  
  return {
    processedPosts: data,
    factoryReset, 
    persistProcessedPosts, 
    inFlight
  }
}