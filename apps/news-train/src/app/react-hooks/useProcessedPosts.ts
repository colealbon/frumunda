import { useState, useCallback} from 'react';
import localforage from 'localforage'
import useSWR  from 'swr';
import defaultProcessedPosts from './defaultProcessedPosts.json'

export function useProcessedPosts () {
  const fetcher = () => {
    return new Promise((resolve, reject) => {
      localforage.getItem('processedPosts')
      .then((value: unknown) => {
        if (!value) {
          resolve(defaultProcessedPosts)
        }
        resolve(value)
      })
    })
  }

  const { data, mutate } = useSWR(
    'processedPosts',
    fetcher , 
    {
      suspense: true,
      fallbackData: defaultProcessedPosts,
      shouldRetryOnError: false
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