import { useState, useCallback} from 'react';
import useSWR  from 'swr';
import localforage from 'localforage'
import { useStacks } from '../react-hooks/useStacks'
import defaultClassifiers from './defaultClassifiers.json'

export function useClassifiers () {
  const { stacksStorage, stacksSession }  = useStacks()

  const fetcher = () => {
    return new Promise((resolve, reject) => {
      if( !stacksSession.isUserSignedIn() ) {
        localforage.getItem('classifiers')
        .then((value: unknown) => {
          if (!value) {
            reject(new Error('no stored classifiers using defaultClassifiers'))
          }
          resolve(value)
        })
      }
      stacksStorage.getFile(`classifiers`, {
        decrypt: true
      })
      .then((content) => {
        // 'stacks classifiers'
        const fetchedClassifiers: object = JSON.parse(`${content}`)
        resolve(fetchedClassifiers)
      })
      .catch(() => {
        localforage.getItem('classifiers')
        .then((value: unknown) => {
          if (!value) {
            reject(new Error('no stored classifiers using defaultClassifiers'))
          }
          resolve(value)
        })
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
  }, [])

  const publishClassifiers = useCallback((newClassifiers: unknown) => {
    setInFlight(true)
    const newClassifiersClone = structuredClone(newClassifiers as object)
    const updateFn = (newClassifiers: object) => {
      const newClassifiersClone = structuredClone(newClassifiers)
      return new Promise((resolve) => {
        if( !stacksSession.isUserSignedIn() ) {
          localforage.setItem('classifiers', newClassifiersClone)
          .then(() => {
            setInFlight(false)
            resolve(newClassifiersClone)
          })
          return
        }
        
        stacksStorage.putFile(`classifiers`, JSON.stringify(newClassifiersClone))
        .catch((error) => console.log(error))
        .finally(() => {
          localforage.setItem('classifiers', newClassifiersClone)
          setInFlight(false)
          resolve(newClassifiersClone)
        })
      })
    }
    mutate(updateFn(newClassifiersClone));
  }, [ mutate, stacksSession, stacksStorage])

  const factoryReset = () => {
    publishClassifiers(defaultClassifiers)
  }

  return {
    classifiers: data,
    factoryReset, 
    publishClassifiers, 
    persistClassifiers,
    inFlight
  }
}