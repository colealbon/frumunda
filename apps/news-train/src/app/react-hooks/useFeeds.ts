import { useState, useCallback } from 'react';
import useSWR  from 'swr';
import localforage from 'localforage'

export function useFeeds () {

  const defaultFeeds = 
  {
    "https://material.io/feed.xml":{"checked":false,"categories":["technology"]},
    "https://www.eff.org/rss/updates.xml":{"checked":true,"categories":["politics"]},
    "https://gcaptain.com/feed/":{"checked":true,"categories":["world"]},
    "https://softwareengineeringdaily.com//feed/podcast/":{"checked":true,"categories":["technology"]},
    "https://www.livescience.com/feeds/all":{"checked":true,"categories":["science"]},
    "https://bitcoinops.org/feed.xml":{"checked":true,"categories":["bitcoin"]},
    "https://feeds.businessinsider.com/custom/all":{"checked":false,"categories":["business"]},
    "https://electrek.co/web-stories/feed/":{"checked":false,"categories":["technology"]},
    "https://www.teslarati.com/feed/":{"checked":true,"categories":["technology"]},
    "https://www.reutersagency.com/feed/":{"checked":false,"categories":["variety"]},
    "https://en.mercopress.com/rss/":{"checked":true,"categories":["world"]},
    "https://sputniknews.com/keyword_News_Feed/":{"checked":false,"categories":["world"]},
    "http://oembed.libsyn.com?item_id=15015401&format=xml":{"checked":false,"categories":[]},
    "https://consortiumnews.com/feed/":{"checked":false,"categories":["politics"]},
    "https://scheerpost.com/feed/":{"checked":true,"categories":["politics"]},
    "http://feeds.feedburner.com/scitechdaily?format=xml":{"checked":true,"categories":["technology"]},
    "https://cointelegraph.com/rss":{"checked":false,"categories":["bitcoin"]},
    "https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml":{"checked":true,"categories":["bitcoin"]},
    "http://rss.slashdot.org/Slashdot/slashdotMain":{"checked":false,"categories":["technology"]},
    "https://sf.streetsblog.org/feed/":{"checked":true,"categories":["local"]},
    "https://www.themoscowtimes.com/rss/news":{"checked":false,"categories":["world"]},
    "https://news.bitcoin.com/feed/":{"checked":false,"categories":["bitcoin"]},
    "https://lifehacker.com/rss":{"categories":["variety"],"checked":false},
    "https://www.statnews.com/feed":{"checked":false,"categories":["technology"]},
    "https://theintercept.com/feed/?lang=en":{"checked":false,"categories":["politics"]},
    "https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/rss.xml":{"checked":false,"categories":["world"]},
    "https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/us/rss.xml":{"checked":false,"categories":["us"]},
    "https://rt.com/rss":{"checked":false,"categories":["world"]},
    "https://ft.com/?format=rss":{"checked":true,"categories":["business"]},
    "https://www.scmp.com/rss/91/feed":{"checked":true,"categories":["world"]},
    "https://www.scmp.com/rss/5/feed":{"checked":false,"categories":["world"]},
    "https://oilprice.com/rss/main":{"checked":false,"categories":["world"]},
    "https://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en":{"categories":["variety"],"checked":false}
  }

  const fetcher = () => {
    return new Promise((resolve, reject) => {
      localforage.getItem('feeds')
      .then((value: unknown) => {
        if (!value) {
          reject(new Error('no stored feeds using defaultFeeds'))
        }
        resolve(value)
      })
    })
  }

  const { data, mutate } = useSWR(
    'feeds',
    fetcher , 
    {
      suspense: true,
      fallbackData: defaultFeeds,
      shouldRetryOnError: false
    }
  )

  const [inFlight, setInFlight] = useState(false)

  const persistFeeds = useCallback((newFeeds: unknown) => {
    setInFlight(true)
    const newFeedsClone = structuredClone(newFeeds as object)
    const updateFn = (newFeeds: object) => {
      return new Promise((resolve) => {
        localforage.setItem('feeds', newFeedsClone)
        .then(() => {
          setInFlight(false)
          resolve(newFeedsClone)
        })
      })
    }
    mutate(updateFn(newFeedsClone), {})
  }, [ mutate ])

  const factoryReset = () => {
    const newFeedsClone = structuredClone(defaultFeeds)
    persistFeeds(newFeedsClone)
  }

  return {
    feeds: data,
    persistFeeds,
    factoryReset,
    inFlight
  }
}