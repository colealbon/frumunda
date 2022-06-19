import React from 'react';
import { useSelectedCategoryIndex } from '../react-hooks/useSelectedCategoryIndex'
import { useFeeds } from '../react-hooks/useFeeds'

const Posts = () => {
  const { feeds } = useFeeds()
  const { selectedCategoryIndex } = useSelectedCategoryIndex();

  const checkedFeedsForCategory = (category: string) => {
    const theFeeds = Object.entries(JSON.parse(JSON.stringify(feeds)))
      .filter(feedEntry => {
        if (`${selectedCategoryIndex}` === 'allCategories') {
          return feedEntry
        }
        return Object.entries(JSON.parse(JSON.stringify(feedEntry[1])))
          .filter(feedEntryAttribute => {
            return feedEntryAttribute[0] === 'categories';
          })
          .find(feedEntryAttribute => {
            return [feedEntryAttribute[1]].flat().indexOf(`${selectedCategoryIndex}`) !== -1;
          });
      })
      .filter(feedEntry => {
        return Object.entries(JSON.parse(JSON.stringify(feedEntry[1])))
          .filter(feedEntryAttribute => {
            return feedEntryAttribute[0] === 'checked';
          })
          .filter(feedEntryAttribute => {
            return feedEntryAttribute[1] === true;
          })
          .find(() => true);
      })
      .map(theFeed => theFeed[0])
    return theFeeds;
  };

  const payload = checkedFeedsForCategory(`${selectedCategoryIndex}`)

  return (
    <>
    <pre>{`${JSON.stringify(payload, null, 2)}`} </pre>
    <pre>{`${JSON.stringify(selectedCategoryIndex, null, 2)}`} </pre>
    </>
  );
};

export default Posts;
