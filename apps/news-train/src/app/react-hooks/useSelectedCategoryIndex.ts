import { useEffect, useState, useCallback} from 'react';
import useSWR  from 'swr';
import localforage from 'localforage'

export function useSelectedCategoryIndex () {
  const defaultSelectedCategoryIndex = 'allCategories'
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(defaultSelectedCategoryIndex)

  const setSelectedCategoryIndexCallback = useCallback((newSelectedCategoryIndex: unknown) => {
    const newSelectedCategoryIndexClone = JSON.parse(JSON.stringify(newSelectedCategoryIndex as object))
    setSelectedCategoryIndex(newSelectedCategoryIndexClone)
  }, [ setSelectedCategoryIndex])

  useEffect(() => {
    localforage.getItem('selectedCategoryIndex')
    .then((value: unknown) => {
      if (!value) {
        return
      }
      setSelectedCategoryIndexCallback(value)
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
    const newSelectedCategoryIndexClone = `${newSelectedCategoryIndex}`
    const options = { optimisticData: newSelectedCategoryIndexClone, rollbackOnError: false }
    const updateFn = (newSelectedCategoryIndex: string) => {
      const newSelectedCategoryIndexClone = `${newSelectedCategoryIndex}`
      return new Promise((resolve) => {
        localforage.setItem('selectedCategoryIndex', newSelectedCategoryIndexClone)
        //.then((result) => console.log(result))
        setInFlight(false)
        resolve(newSelectedCategoryIndexClone)
        return
      })
    }
    mutate(updateFn(newSelectedCategoryIndexClone), options);
  }, [ mutate ])

  return {
    selectedCategoryIndex: data,
    persistSelectedCategoryIndex: persistSelectedCategoryIndex,
    inFlight: inFlight,
    mutateSelectedCategoryIndex: mutate
  }
}