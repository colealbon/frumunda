import { useEffect, useState, useCallback} from 'react';
import useSWR  from 'swr';
import localforage from 'localforage'

export function useSelectedPageIndex () {
  const defaultSelectedPageIndex = 'posts'
  const [selectedPageIndex, setSelectedPageIndex] = useState(defaultSelectedPageIndex)

  const setSelectedPageIndexCallback = useCallback((newSelectedPageIndex: unknown) => {
    setSelectedPageIndex(`${newSelectedPageIndex}`)
  }, [ setSelectedPageIndex ])

  useEffect(() => {
    localforage.getItem('selectedPageIndex')
    .then((value: unknown) => {
      if (!value) {
        return
      }
      setSelectedPageIndexCallback(`${value}`)
    })
  }, [setSelectedPageIndexCallback])

  const fallback = `${selectedPageIndex}`

  const fetcher = () => {
    return new Promise((resolve, reject) => {
        reject()
    })
  }

  const { data, mutate } = useSWR(
    'selectedPageIndex',
    fetcher , 
    {
      fallbackData: fallback,
      shouldRetryOnError: false
    }
  )

  const [inFlight, setInFlight] = useState(false)

  const persistSelectedPageIndex = useCallback((newSelectedPageIndex: unknown) => {
    setInFlight(true)
    const options = { optimisticData: `${newSelectedPageIndex}`, rollbackOnError: false }
    const updateFn = (newSelectedPageIndex: string) => {
      return localforage.setItem('selectedPageIndex', `${newSelectedPageIndex}`)
    }
    mutate(updateFn(`${newSelectedPageIndex}`), options);
    setInFlight(false)
  }, [ mutate ])

  return {
    selectedPageIndex: data,
    persistSelectedPageIndex,
    inFlight,
    mutate
  }
}