import { FunctionComponent } from 'react';
import useSWR, {mutate} from 'swr';
import { useStorage } from '../react-hooks/useStorage';
import defaultCategories from '../react-hooks/defaultCategories.json';

import CategoriesAdd from './CategoriesAdd';
import Button from '@mui/material/Button';

import CategoryToggle from './CategoryToggle';
import CategoryDelete from './CategoryDelete';

const CategoriesEdit: FunctionComponent = () => {
  const { fetchFileLocal, persistLocal } = useStorage();
  const { data: categories } = useSWR(
    'categories',
    fetchFileLocal('categories', defaultCategories),
    { fallbackData: defaultCategories }
  );

  const factoryReset = () => {
    mutate('categories', persistLocal('categories', defaultCategories), {
      optimisticData: defaultCategories,
    });
  };

  return (
    <>
      <CategoriesAdd key="CategoriesAdd" />
      <div />
      <Button onClick={factoryReset}>
        reset categories
      </Button>
      <div />
      {Object.keys(categories as object).map((category) => {
        return (
          <div key={`category-edit-${category}`}>
            <CategoryToggle text={category} />
            <CategoryDelete text={category} />
          </div>
        );
      })}
    </>
  );
};

export default CategoriesEdit;
