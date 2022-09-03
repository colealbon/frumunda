import { FunctionComponent, createContext, ReactNode } from 'react';
import useSWR from 'swr';
import { useStorage } from '../react-hooks/useStorage';
import defaultCategories from '../react-hooks/defaultCategories.json';
type Props = { children: ReactNode };

export const CategoryContext = createContext('');

const Classifiers: FunctionComponent<Props> = ({ children }: Props) => {
  const { fetchFileLocal } = useStorage();
  const { data: categoriesdata } = useSWR(
    'categories',
    fetchFileLocal('categories', defaultCategories),
    { fallbackData: defaultCategories }
  );
  const categories = {...categoriesdata as object}

  return (
    <>
    {
      Object.keys(categories).map((category: string) => {
        return (
          <CategoryContext.Provider key={`${category}`} value={`${category}`}>
            {children}
          </CategoryContext.Provider>
        );
      })
    }
    </>
  )
};

export default Classifiers;
