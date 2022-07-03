import { useState, useCallback} from 'react';
import useSWR  from 'swr';
import localforage from 'localforage'

export function useCorsProxies () {

  const defaultCorsProxies = {
    '/.netlify/functions/main?url=': { checked: false },
    'http://localhost:8888/.netlify/functions/main?url=': { checked: true },
    '': { checked: false }
  }

  const fetcher = () => {
    return new Promise((resolve, reject) => {
      localforage.getItem('corsProxies')
      .then((value: unknown) => {
        if (!value) {
          reject(new Error('no local corsProxies to recover'))
        }
        resolve(value)
      })
    })
  }

  const { data, mutate } = useSWR(
    'corsProxies',
    fetcher, 
    {
      suspense: true,
      fallbackData: defaultCorsProxies,
      shouldRetryOnError: false
    }
  )

  const [inFlight, setInFlight] = useState(false)

  const persistCorsProxies = useCallback((newCorsProxies: unknown) => {
    setInFlight(true)
    const newCorsProxiesClone = JSON.parse(JSON.stringify(newCorsProxies as object))
    const options = { optimisticData: newCorsProxiesClone, rollbackOnError: true }
    const updateFn = (newCorsProxies: object) => {
      return new Promise((resolve) => {
        localforage.setItem('corsProxies', newCorsProxiesClone)
        setInFlight(false)
        resolve(newCorsProxiesClone)
        return 
      })
    }
    mutate(updateFn(newCorsProxiesClone), options);
  }, [ mutate ])

  const factoryReset = () => {
    const newCorsProxiesClone = JSON.parse(JSON.stringify(defaultCorsProxies))
    persistCorsProxies(newCorsProxiesClone)
  }

  return {
    corsProxies: data,
    persistCorsProxies,
    factoryReset,
    inFlight
  }
}