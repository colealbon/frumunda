// import { useEffect, useState, useCallback} from 'react';
import useSWR  from 'swr';
import axios from 'axios';
import { useSelectedCategoryIndex } from '../react-hooks/useSelectedCategoryIndex'
import { useFeeds } from '../react-hooks/useFeeds'
import { useCorsProxies } from '../react-hooks/useCorsProxies'

export function useFetchedContent () {
  const { selectedCategoryIndex } = useSelectedCategoryIndex();
  const { feeds } = useFeeds()
  const { corsProxies } = useCorsProxies();

  const checkedFeedsForCategory = Object.entries(feeds)
    .filter(feedEntry => {
      if (`${selectedCategoryIndex}` === 'allCategories') {
        return feedEntry
      }
      return Object.entries(feedEntry[1] as object)
        .filter(feedEntryAttribute => {
          return feedEntryAttribute[0] === 'categories';
        })
        .find(feedEntryAttribute => {
          return [feedEntryAttribute[1]].flat().indexOf(`${selectedCategoryIndex}`) !== -1;
        });
    })
    .filter((feedEntry) => {
      return Object.entries(feedEntry[1] as object)
        .filter(feedEntryAttribute => {
          return feedEntryAttribute[0] === 'checked';
        })
        .filter(feedEntryAttribute => {
          return feedEntryAttribute[1] === true;
        })
        .find(() => true);
    })
    .map((feedEntry) => feedEntry[0])

    const checkedCorsProxies = Object.entries(corsProxies)
    .filter(corsProxyEntry => Object.assign(corsProxyEntry[1] as object).checked === true)
    .map((corsProxyEntry: [string, unknown]) => corsProxyEntry[0])
    .filter(noblanks => !!noblanks);
  
  const fetchFeedContent = (feedUrl: string, corsProxies: string[]): Promise<object> => {
    console.log(feedUrl)
    console.log(corsProxies)
    return new Promise((resolve, reject) => {
      const [corsProxy, ...rest] = corsProxies;
      [corsProxy]
        .flat()
        .filter(corsProxyItem => {
          return !!corsProxyItem;
        })
        .forEach(corsProxyItem => {
          console.log(`${corsProxyItem}${feedUrl}`)
          axios
            .get(`${corsProxyItem}${feedUrl}`)
            .then(response => {
              console.log(response)
              resolve(response);
              return;
            })
            .catch(() => {
              if (rest.length === 0) {
                reject();
              }
              fetchFeedContent(feedUrl, rest);
            });
        });
    });
  };
  const fetchFeedContentMulti = (feeds: string[], corsProxies: string[]): Promise<object> => {
    console.log('fetchFeedContentMulti')
    return new Promise((resolve, reject) => {
      const feedQueue: object[] = [];
      Object.values(feeds).map(feed =>
        feedQueue.push(
          new Promise((resolve, reject) => {
            fetchFeedContent(feed, corsProxies)
              .then((fetchedContent: object) => {
                return [fetchedContent].flat().forEach(fetchedContentItem => {
                  resolve([feed, fetchedContent]);
                });
              })
              .catch(() => resolve({}));
          })
        )
      );
      console.log(feedQueue)
      Promise.all(feedQueue).then(fetchedContent => {
        console.log(fetchedContent)
        resolve(fetchedContent);
      })
      .catch(() => resolve({}))
    });
  };
  const fetcher = () => {
    return new Promise((resolve, reject) => {
      fetchFeedContentMulti(checkedFeedsForCategory, checkedCorsProxies)
      .then(fetchedContent => resolve(fetchedContent))
      .catch(error => reject(error))
    })
  }

  const { data } = useSWR(
    `fetchedContent-${selectedCategoryIndex}`,
    fetcher, 
    {
      suspense: true
    }
  )
  
  const fetchedContent: unknown = Object.assign(data as object)

  return {
    fetchedContent
  }
}