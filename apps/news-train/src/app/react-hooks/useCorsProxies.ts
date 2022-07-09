import { useState, useCallback } from 'react';
import useSWR  from 'swr';
import localforage from 'localforage'

export function useCorsProxies () {

  const defaultCorsProxies = {
    '/.netlify/functions/main?url=': { checked: true },
    'http://localhost:8888/.netlify/functions/main?url=': { checked: false }
  }

  const fetcher = () => {
    return new Promise((resolve) => {
      localforage.getItem('corsProxies')
      .then((corsProxies) => resolve(corsProxies))
      .catch(() => resolve(defaultCorsProxies))
    })
  }

  const { data, mutate } = useSWR(
    'corsProxies',
    fetcher, 
    {
      suspense: true
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

  const corsProxies = structuredClone(data)

  return {
    corsProxies,
    persistCorsProxies,
    factoryReset,
    inFlight
  }
}