import { createContext, FunctionComponent, ReactNode } from 'react';

import useSWR from 'swr';
import { useStorage } from '../react-hooks/useStorage';
import defaultCategories from '../react-hooks/defaultCategories.json';

export const CategoryContext = createContext('');

type Props = { children: ReactNode };
const Category: FunctionComponent<Props> = ({ children }: Props) => {
  const { fetchFileLocal } = useStorage();
  const { data: selectedCategory } = useSWR(
    'selectedCategory',
    fetchFileLocal('selectedCategory', '')
  );
  const { data: categories } = useSWR(
    'categories',
    fetchFileLocal('categories', defaultCategories),
    { fallbackData: defaultCategories }
  );

  const checkedCategories = Object.entries({ ...(categories as object) })
    .filter((categoryEntry) => {
      return (
        ['allCategories', `${categoryEntry[0]}`].indexOf(
          `${selectedCategory || 'allCategories'}`
        ) !== -1
      );
    })
    .filter((categoryEntry) => {
      return Object.entries(categoryEntry[1] as object)
        .filter((categoryEntryAttribute) => {
          return categoryEntryAttribute[0] === 'checked';
        })
        .filter((feedEntryAttribute) => {
          return feedEntryAttribute[1] === true;
        })
        .find(() => true);
    })
    .map((categoryEntry) => categoryEntry[0]);
  
  return (
    <>
      {checkedCategories.map((category) => {
        return (
          <CategoryContext.Provider key={`${category}`} value={`${category}`}>
            {children}
          </CategoryContext.Provider>
        );
      })}
    </>
  );
};

export default Category;
