import { useState, useCallback} from 'react';
import useSWR  from 'swr';
import { useStacks } from '../react-hooks/useStacks'
import defaultCategories from './defaultCategories.json'

export function useCategories () {
  const { fetchFile, persistFile }  = useStacks()
  
  const { data: categories } = useSWR(
    'categories',
    fetchFile('categories') , 
    {
      fallbackData: defaultCategories,
    }
  )

  const [inFlight, setInFlight] = useState(false)

  const publishCategories = useCallback((newCategories: unknown) => {
    setInFlight(true)
    const newCategoriesClone = structuredClone(newCategories as object)
    persistFile(`categories`, newCategoriesClone)
    setInFlight(false)
  }, [persistFile])

  const factoryReset = () => {
    publishCategories(defaultCategories)
  }

  return {
    categories,
    factoryReset, 
    publishCategories,
    inFlight
  }
}