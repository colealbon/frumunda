import { useState, useCallback} from 'react';
import useSWR  from 'swr';
import localforage from 'localforage'
import defaultClassifiers from './defaultClassifiers.json'

export function useClassifiers () {
  const fetcher = () => {
    return new Promise((resolve, reject) => {
      localforage.getItem('classifiers')
      .then((value: unknown) => {
        if (!value) {
          reject(new Error('no stored classifiers using defaultClassifiers'))
        }
        resolve(value)
      })
    })
  }

  const { data, mutate } = useSWR(
    'classifiers',
    fetcher , 
    {
      suspense: true,
      fallbackData: defaultClassifiers,
      shouldRetryOnError: false
    }
  )

  const [inFlight, setInFlight] = useState(false)

  const persistClassifiers = useCallback((newClassifiers: unknown) => {
    const newClassifiersClone = structuredClone(newClassifiers as object)
    localforage.setItem('classifiers', newClassifiersClone)
    .then(() => {
      setInFlight(false)
      mutate()
    })
    
  }, [mutate])


  const factoryReset = () => {
    persistClassifiers(defaultClassifiers)
  }

  return {
    classifiers: data,
    factoryReset, 
    persistClassifiers,
    inFlight
  }
}