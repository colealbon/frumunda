import { useEffect, useState, useCallback} from 'react';
import useSWR  from 'swr';
import localforage from 'localforage'
import { useStacks } from '../react-hooks/useStacks'
import defaultProcessedPosts from './defaultProcessedPosts.json'

export function useProcessedPosts () {
  const { stacksStorage, stacksSession }  = useStacks()
  const [processedPosts, setProcessedPosts] = useState(defaultProcessedPosts)

  const setProcessedPostsCallback = useCallback((newProcessedPosts: unknown) => {
    const newProcessedPostsClone = JSON.parse(JSON.stringify(newProcessedPosts as object))
    setProcessedPosts(newProcessedPostsClone)
  }, [ setProcessedPosts])

  useEffect(() => {
    localforage.getItem('processedPosts')
    .then((value: unknown) => {
      if (!value) {
        return
      }
      setProcessedPostsCallback(value)
    })
  }, [setProcessedPostsCallback])

  const fetcher = () => {
    return new Promise((resolve, reject) => {
      stacksStorage.getFile(`processedPosts`, {
        decrypt: true
      })
      .then((content) => {
        const fetchedProcessedPosts: object = JSON.parse(`${content}`)
        resolve(fetchedProcessedPosts)
      })
      .catch(error => reject())
    })
  }

  const { data, mutate } = useSWR(
    'processedPosts',
    fetcher , 
    {
      suspense: true,
      fallbackData: defaultProcessedPosts
      // shouldRetryOnError: true,
      // errorRetryInterval: 6000,
      // dedupingInterval: 6000,
      // focusThrottleInterval: 6000,
      // errorRetryCount: 3
    }
  )

  const [inFlight, setInFlight] = useState(false)

  const publishProcessedPosts = useCallback((newProcessedPosts: unknown) => {
    setInFlight(true)
    const newProcessedPostsClone = JSON.parse(JSON.stringify(newProcessedPosts as object))
    const options = { optimisticData: newProcessedPostsClone, rollbackOnError: true }
    const updateFn = (newProcessedPosts: object) => {
      const newProcessedPostsClone = JSON.parse(JSON.stringify(newProcessedPosts))
      return new Promise((resolve) => {
        if( !stacksSession.isUserSignedIn() ) {
          localforage.setItem('processedPosts', newProcessedPostsClone)
          setInFlight(false)
          resolve(newProcessedPostsClone)
          return
        }
        stacksStorage.putFile(`processedPosts`, JSON.stringify(newProcessedPostsClone))
        .catch((error) => console.log(error))
        .finally(() => {
          localforage.setItem('processedPosts', newProcessedPostsClone)
          setInFlight(false)
          resolve(newProcessedPostsClone)
          return 
        })
      })
    }
    mutate(updateFn(newProcessedPostsClone), options);
  }, [ mutate, stacksSession, stacksStorage])

  const factoryReset = () => {
    const newProcessedPostsClone = JSON.parse(JSON.stringify(defaultProcessedPosts))
    localforage.setItem('processedPosts', newProcessedPostsClone)
    publishProcessedPosts(newProcessedPostsClone)
  }

  console.log(data)
  
  return {
    processedPosts: data,
    setProcessedPosts, 
    factoryReset, 
    publishProcessedPosts, 
    inFlight
  }
}