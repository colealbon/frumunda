import { useCallback} from 'react';
import localforage from 'localforage'
import useSWR  from 'swr';
import defaultClassifiers from './defaultClassifiers.json'

export function useClassifiers () {
  const fetcher = () => {
    return new Promise((resolve, reject) => {
      localforage.getItem('classifiers')
      .then((value: unknown) => {
        if (!value) {
          resolve(defaultClassifiers)
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

  const persistClassifiers = useCallback((newClassifiers: unknown) => {
    const newClassifiersClone = structuredClone(newClassifiers)
    const updateFn = (newClassifiers: object) => {
      const newClassifiersClone = structuredClone(newClassifiers)
      return new Promise((resolve) => {
        localforage.setItem('classifiers', newClassifiersClone)
        resolve(newClassifiersClone)
      })
    }
    mutate(updateFn(newClassifiersClone));
  }, [ mutate ])

  const factoryReset = () => {
    persistClassifiers(defaultClassifiers)
  }
  
  return {
    classifiers: data,
    factoryReset, 
    persistClassifiers
  }
}