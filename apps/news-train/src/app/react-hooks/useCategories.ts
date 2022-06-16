import { useEffect, useState, useCallback} from 'react';
import useSWR, { useSWRConfig }  from 'swr';
import localforage from 'localforage'

export function useCategories () {
  const { mutate } = useSWRConfig()

  const defaultCategories = {
    "science":{"checked":true, "label": "science"},
    "bitcoin":{"checked":true, "label": "bitcoin"},
    "local":{"checked":true, "label": "local"},
    "business":{"checked":true, "label": "business"},
    "world":{"checked":true, "label": "world"},
    "politics":{"checked":true, "label": "politics"},
    "technology":{"checked":true, "label": "technology"}
  }
  const [persistCategories, setPersistCategories] = useState(defaultCategories)

  const setPersistCategoriesCallback = useCallback((newCategories: unknown) => {
    const newCategoriesClone = JSON.parse(JSON.stringify(newCategories as object))
    setPersistCategories(newCategoriesClone)
  }, [])

  const setCategories = (newCategories: unknown) => {
    const newCategoriesClone = JSON.parse(JSON.stringify(newCategories))
    localforage.setItem('categories', newCategoriesClone)
    mutate('categories', newCategoriesClone)
  }

  useEffect(() => {
    localforage.getItem('categories')
    .then((value: unknown) => {
      if (!value) {
        return
      }
      setPersistCategoriesCallback(value)
    })
  }, [setPersistCategoriesCallback])

  const fallback = JSON.parse(JSON.stringify(persistCategories))

  const fetcher = () => {
    return new Promise((resolve, reject) => {
      reject()
      //fetch from blockstack
    })
  }

  const { data } = useSWR(
    'categories',
    fetcher , 
    {
      suspense: true,
      fallbackData: fallback
    }
  )

  return {
    categories: data,
    setCategories: setCategories
  }
}