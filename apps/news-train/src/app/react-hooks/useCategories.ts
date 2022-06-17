import { useEffect, useState, useCallback} from 'react';
import useSWR  from 'swr';
import localforage from 'localforage'
import { useStacks } from '../react-hooks/useStacks'

export function useCategories () {
  
  const { stacksStorage, stacksSession }  = useStacks()

  const defaultCategories = {
    "science":{"checked":true, "label": "science"},
    "bitcoin":{"checked":true, "label": "bitcoin"},
    "local":{"checked":true, "label": "local"},
    "business":{"checked":true, "label": "business"},
    "world":{"checked":true, "label": "world"},
    "politics":{"checked":true, "label": "politics"},
    "technology":{"checked":true, "label": "technology"}
  }
  const [categories, setCategories] = useState(defaultCategories)

  const setCategoriesCallback = useCallback((newCategories: unknown) => {
    const newCategoriesClone = JSON.parse(JSON.stringify(newCategories as object))
    setCategories(newCategoriesClone)
  }, [ setCategories])
  useEffect(() => {
    localforage.getItem('categories')
    .then((value: unknown) => {
      if (!value) {
        return
      }
      setCategoriesCallback(value)
    })
  }, [setCategoriesCallback])

  const fallback = JSON.parse(JSON.stringify(categories))

  const fetcher = () => {
    return new Promise((resolve, reject) => {
      stacksStorage.getFile(`categories`, {
        decrypt: true
      })
      .then((content) => {
        const fetchedCategories: object = JSON.parse(`${content}`)
        resolve(fetchedCategories)
      })
      .catch(error => reject())
    })
  }
  const { data, mutate } = useSWR(
    'categories',
    fetcher , 
    {
      suspense: true,
      fallbackData: fallback,
      dedupingInterval: 5000,
      focusThrottleInterval: 5000
    }
  )

  const publishCategories = useCallback((newCategories: unknown) => {
    const newCategoriesClone = JSON.parse(JSON.stringify(newCategories as object))
    const options = { optimisticData: newCategoriesClone, rollbackOnError: false }
    const updateFn = (newCategories: object) => {
      const newCategoriesClone = JSON.parse(JSON.stringify(newCategories))
      return new Promise((resolve) => {
        localforage.setItem('categories', newCategoriesClone)
        if( !stacksSession.isUserSignedIn() ) {
          resolve(newCategoriesClone)
          return
        }
        stacksStorage.putFile(`categories`, JSON.stringify(newCategoriesClone))
        .then((successMessage) => console.log(successMessage))
        .finally(() => {
          resolve(newCategoriesClone)
          return 
        })
      })
    }
    mutate(updateFn(newCategoriesClone), options);

  }, [ mutate, stacksSession, stacksStorage])

  return {
    categories: data,
    setCategories: setCategories,
    publishCategories: publishCategories
  }
}