import { useEffect, useState, useCallback} from 'react';
import useSWR  from 'swr';
import localforage from 'localforage'

export function useSelectedCategoryIndex () {
  const defaultSelectedCategoryIndex = 'allCategories'
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(defaultSelectedCategoryIndex)

  const setSelectedCategoryIndexCallback = useCallback((newSelectedCategoryIndex: unknown) => {
    setSelectedCategoryIndex(`${newSelectedCategoryIndex}`)
  }, [ setSelectedCategoryIndex])

  useEffect(() => {
    localforage.getItem('selectedCategoryIndex')
    .then((value: unknown) => {
      if (!value) {
        return
      }
      setSelectedCategoryIndexCallback(`${value}`)
    })
  }, [setSelectedCategoryIndexCallback])

  const fallback = `${selectedCategoryIndex}`

  const fetcher = () => {
    return new Promise((resolve, reject) => {
        reject()
    })
  }

  const { data, mutate } = useSWR(
    'selectedCategoryIndex',
    fetcher , 
    {
      fallbackData: fallback,
      shouldRetryOnError: false
    }
  )

  const [inFlight, setInFlight] = useState(false)

  const persistSelectedCategoryIndex = useCallback((newSelectedCategoryIndex: unknown) => {
    setInFlight(true)
    const options = { optimisticData: `${newSelectedCategoryIndex}`, rollbackOnError: false }
    const updateFn = (newSelectedCategoryIndex: string) => {
      return localforage.setItem('selectedCategoryIndex', `${newSelectedCategoryIndex}`)
    }
    mutate(updateFn(`${newSelectedCategoryIndex}`), options);
    setInFlight(false)
  }, [ mutate ])

  return {
    selectedCategoryIndex: data,
    persistSelectedCategoryIndex,
    inFlight,
    mutate
  }
}