import { useEffect, useState, useCallback} from 'react';
import useSWR  from 'swr';
import localforage from 'localforage'
import { useStacks } from '../react-hooks/useStacks'

export function useFetchedContent () {
  const { stacksStorage, stacksSession }  = useStacks()
  const defaultFetchedContent = {}
  const [fetchedContent, setFetchedContent] = useState(defaultFetchedContent)

  const setFetchedContentCallback = useCallback((newFetchedContent: unknown) => {
    const newFetchedContentClone = JSON.parse(JSON.stringify(newFetchedContent as object))
    setFetchedContent(newFetchedContentClone)
  }, [ setFetchedContent])

  useEffect(() => {
    localforage.getItem('fetchedContent')
    .then((value: unknown) => {
      if (!value) {
        return
      }
      setFetchedContentCallback(value)
    })
  }, [setFetchedContentCallback])

  const fallback = JSON.parse(JSON.stringify(fetchedContent))

  const fetcher = () => {
    return new Promise((resolve, reject) => {
      stacksStorage.getFile(`fetchedContent`, {
        decrypt: true
      })
      .then((content) => {
        const fetchedFetchedContent: object = JSON.parse(`${content}`)
        resolve(fetchedFetchedContent)
      })
      .catch(error => reject())
    })
  }

  const { data, mutate } = useSWR(
    'fetchedContent',
    fetcher , 
    {
      suspense: true,
      fallbackData: fallback,
      shouldRetryOnError: true,
      errorRetryInterval: 6000,
      dedupingInterval: 6000,
      focusThrottleInterval: 6000,
      errorRetryCount: 3
    }
  )

  const [inFlight, setInFlight] = useState(false)

  const publishFetchedContent = useCallback((newFetchedContent: unknown) => {
    setInFlight(true)
    const newFetchedContentClone = JSON.parse(JSON.stringify(newFetchedContent as object))
    const options = { optimisticData: newFetchedContentClone, rollbackOnError: true }
    const updateFn = (newFetchedContent: object) => {
      const newFetchedContentClone = JSON.parse(JSON.stringify(newFetchedContent))
      return new Promise((resolve) => {
        if( !stacksSession.isUserSignedIn() ) {
          localforage.setItem('fetchedContent', newFetchedContentClone)
          setInFlight(false)
          resolve(newFetchedContentClone)
          return
        }
        stacksStorage.putFile(`fetchedContent`, JSON.stringify(newFetchedContentClone))
        .catch((error) => console.log(error))
        .finally(() => {
          localforage.setItem('fetchedContent', newFetchedContentClone)
          setInFlight(false)
          resolve(newFetchedContentClone)
          return 
        })
      })
    }
    mutate(updateFn(newFetchedContentClone), options);
  }, [ mutate, stacksSession, stacksStorage])

  const factoryReset = () => {
    const newFetchedContentClone = JSON.parse(JSON.stringify(defaultFetchedContent))
    localforage.setItem('fetchedContent', newFetchedContentClone)
    publishFetchedContent(newFetchedContentClone)
  }

  return {
    fetchedContent,
    setFetchedContent, 
    factoryReset, 
    publishFetchedContent, 
    inFlight
  }
}