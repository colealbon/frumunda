import { useState, useCallback} from 'react';
import useSWR  from 'swr';
import localforage from 'localforage'
import { useStacks } from '../react-hooks/useStacks'
import defaultCategories from './defaultCategories.json'

export function useCategories () {
  const { stacksStorage, stacksSession }  = useStacks()

  const fetcher = () => {
    return new Promise((resolve, reject) => {
      if( !stacksSession.isUserSignedIn() ) {
        localforage.getItem('categories')
        .then((value: unknown) => {
          if (!value) {
            reject(new Error('no stored categories using defaultCategories'))
          }
          resolve(value)
        })
      }
      stacksStorage.getFile(`categories`, {
        decrypt: true
      })
      .then((content) => {
        // 'stacks categories'
        const fetchedCategories: object = JSON.parse(`${content}`)
        resolve(fetchedCategories)
      })
      .catch(() => {
        localforage.getItem('categories')
        .then((value: unknown) => {
          if (!value) {
            reject(new Error('no stored categories using defaultCategories'))
          }
          resolve(value)
        })
      })
    })
  }

  const { data, mutate } = useSWR(
    'categories',
    fetcher , 
    {
      suspense: true,
      fallbackData: defaultCategories,
      shouldRetryOnError: false
    }
  )

  const [inFlight, setInFlight] = useState(false)

  const publishCategories = useCallback((newCategories: unknown) => {
    setInFlight(true)
    const newCategoriesClone = structuredClone(newCategories as object)
    const updateFn = (newCategories: object) => {
      const newCategoriesClone = structuredClone(newCategories)
      return new Promise((resolve) => {
        if( !stacksSession.isUserSignedIn() ) {
          localforage.setItem('categories', newCategoriesClone)
          .then(() => {
            setInFlight(false)
            resolve(newCategoriesClone)
          })
          return
        }
        
        stacksStorage.putFile(`categories`, JSON.stringify(newCategoriesClone))
        .catch((error) => console.log(error))
        .finally(() => {
          localforage.setItem('categories', newCategoriesClone)
          setInFlight(false)
          resolve(newCategoriesClone)
        })
      })
    }
    mutate(updateFn(newCategoriesClone));
  }, [ mutate, stacksSession, stacksStorage])

  const factoryReset = () => {
    publishCategories(defaultCategories)
  }

  return {
    categories: data,
    factoryReset, 
    publishCategories, 
    inFlight
  }
}