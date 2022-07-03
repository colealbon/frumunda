import React, { FunctionComponent, createContext, useContext, ReactNode } from 'react';
import { useSelectedCategoryIndex } from '../react-hooks/useSelectedCategoryIndex'
import { useCategories } from '../react-hooks/useCategories'
export const CategoryContext = React.createContext('');

type Props = {children: ReactNode}
const Category: FunctionComponent<Props> = ({children}: Props) => {

  const { selectedCategoryIndex } = useSelectedCategoryIndex();
  const { categories } = useCategories()
  
  const checkedCategories = Object.entries(categories)
    .filter(categoryEntry => {
      return ['allCategories', `${categoryEntry[0]}`].indexOf(`${selectedCategoryIndex}`) !== -1
    })
    .filter((categoryEntry) => {
      return Object.entries(categoryEntry[1] as object)
        .filter(categoryEntryAttribute => {
          return categoryEntryAttribute[0] === 'checked';
        })
        .filter(feedEntryAttribute => {
          return feedEntryAttribute[1] === true;
        })
        .find(() => true);
    })
    .map((categoryEntry) => categoryEntry[0])

  return (
    <>
      {
        checkedCategories.map(category => {
          return (
            <CategoryContext.Provider value={`${category}`}>
              {children}
            </CategoryContext.Provider>
          )
        })
      }
    </>
  )
}

export default Category;