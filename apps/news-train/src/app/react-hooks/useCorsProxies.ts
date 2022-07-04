import { useState, useCallback } from 'react';
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
          reject(new Error('no stored corsProxies using defaultCorsProxies'))
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
    const newCorsProxiesClone = structuredClone(newCorsProxies as object)
    const updateFn = (newCorsProxies: object) => {
      return new Promise((resolve) => {
        localforage.setItem('corsProxies', newCorsProxiesClone)
        .then(() => {
          setInFlight(false)
          resolve(newCorsProxies)
        })
      })
    }
    mutate(updateFn(newCorsProxiesClone), {});
  }, [ mutate ])

  const factoryReset = () => {
    const newCorsProxiesClone = structuredClone(defaultCorsProxies)
    persistCorsProxies(newCorsProxiesClone)
  }

  return {
    corsProxies: data,
    persistCorsProxies,
    factoryReset,
    inFlight
  }
}