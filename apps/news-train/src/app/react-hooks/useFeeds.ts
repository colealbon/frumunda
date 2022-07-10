import { useState, useCallback } from 'react';
import useSWR  from 'swr';
import localforage from 'localforage'
import defaultFeeds from './defaultFeeds.json'

export function useFeeds () {

  const [inFlight, setInFlight] = useState(false)

  const fetcher = () => {
    return new Promise((resolve, reject) => {
      localforage.getItem('feeds')
      .then((value: unknown) => {
        if (!value) {
          resolve(defaultFeeds)
        }
        resolve(value)
      })
    })
  }

  const { data, mutate } = useSWR(
    'feeds',
    fetcher , 
    {
      suspense: true,
      shouldRetryOnError: false
    }
  )

 

  const persistFeeds = useCallback((newFeeds: unknown) => {
    setInFlight(true)
    const newFeedsClone = structuredClone(newFeeds as object)
    const updateFn = (newFeeds: object) => {
      return new Promise((resolve) => {
        localforage.setItem('feeds', newFeedsClone)
        .then(() => {
          setInFlight(false)
          resolve(newFeedsClone)
        })
      })
    }
    mutate(updateFn(newFeedsClone), {})
  }, [ mutate ])

  const factoryReset = () => {
    const newFeedsClone = structuredClone(defaultFeeds)
    persistFeeds(newFeedsClone)
  }

  return {
    feeds: data,
    persistFeeds,
    factoryReset,
    inFlight
  }
}