import { useEffect, useState, useCallback} from 'react';
import useSWR  from 'swr';
import localforage from 'localforage'

export function useSelectedPageIndex () {
  const defaultSelectedPageIndex = 'posts'
  const [selectedPageIndex, setSelectedPageIndex] = useState(defaultSelectedPageIndex)

  const setSelectedPageIndexCallback = useCallback((newSelectedPageIndex: unknown) => {
    const newSelectedPageIndexClone = JSON.parse(JSON.stringify(newSelectedPageIndex as object))
    setSelectedPageIndex(newSelectedPageIndexClone)
  }, [ setSelectedPageIndex])

  useEffect(() => {
    localforage.getItem('selectedPageIndex')
    .then((value: unknown) => {
      if (!value) {
        return
      }

      setSelectedPageIndexCallback(value)
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
    const newSelectedPageIndexClone = `${newSelectedPageIndex}`
    const options = { optimisticData: newSelectedPageIndexClone, rollbackOnError: false }
    const updateFn = (newSelectedPageIndex: string) => {
      return localforage.setItem('selectedPageIndex', `${newSelectedPageIndex}`)
    }
    mutate(updateFn(newSelectedPageIndexClone), options);
    setInFlight(false)
  }, [ mutate ])

  return {
    selectedPageIndex: data,
    persistSelectedPageIndex: persistSelectedPageIndex,
    inFlight: inFlight,
    mutateSelectedPageIndex: mutate
  }
}