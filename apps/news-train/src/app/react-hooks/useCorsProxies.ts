import { useEffect, useState, useCallback} from 'react';
import useSWR  from 'swr';
import localforage from 'localforage'
import { useStacks } from '../react-hooks/useStacks'

export function useCorsProxies () {
  const { stacksStorage, stacksSession }  = useStacks()
  const defaultCorsProxies = {
        '/.netlify/functions/node-fetch?url=': { checked: true },
        'http://localhost:8888/.netlify/functions/main?url=': { checked: false },
        '': { checked: false }
  }
  const [corsProxies, setCorsProxies] = useState(defaultCorsProxies)

  const setCorsProxiesCallback = useCallback((newCorsProxies: unknown) => {
    const newCorsProxiesClone = JSON.parse(JSON.stringify(newCorsProxies as object))
    setCorsProxies(newCorsProxiesClone)
  }, [ setCorsProxies])

  useEffect(() => {
    localforage.getItem('corsProxies')
    .then((value: unknown) => {
      if (!value) {
        return
      }
      setCorsProxiesCallback(value)
    })
  }, [setCorsProxiesCallback])

  const fallback = JSON.parse(JSON.stringify(corsProxies))

  const fetcher = () => {
    return Promise.reject(new Error('(hack) do not sync this to blockstack'))
    // return new Promise((resolve, reject) => {
    //   stacksStorage.getFile(`corsProxies`, {
    //     decrypt: true
    //   })
    //   .then((content) => {
    //     const fetchedCorsProxies: object = JSON.parse(`${content}`)
    //     resolve(fetchedCorsProxies)
    //   })
    //   .catch(error => reject())
    // })
  }

  const { data, mutate } = useSWR(
    'corsProxies',
    fetcher , 
    {
      suspense: true,
      fallbackData: fallback,
      shouldRetryOnError: false
    }
  )

  const [inFlight, setInFlight] = useState(false)

  const publishCorsProxies = useCallback((newCorsProxies: unknown) => {
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
  }, [ mutate, stacksSession, stacksStorage])

  const factoryReset = () => {
    const newCorsProxiesClone = JSON.parse(JSON.stringify(defaultCorsProxies))
    localforage.setItem('corsProxies', newCorsProxiesClone)
    publishCorsProxies(newCorsProxiesClone)
  }

  return {
    corsProxies: data,
    setCorsProxies, 
    factoryReset, 
    publishCorsProxies, 
    inFlight
  }
}