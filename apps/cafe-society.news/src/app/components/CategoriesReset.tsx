import { FunctionComponent } from 'react';
import Button from '@mui/material/Button';
import defaultCategories from '../react-hooks/defaultCategories.json';
import { useStorage } from '../react-hooks/useStorage';
import { mutate } from 'swr';

const CategoriesReset: FunctionComponent = () => {
  const { persistLocal } = useStorage();

  const factoryReset = () => {
    mutate('categories', persistLocal('categories', defaultCategories), {
      optimisticData: defaultCategories,
    });
  };

  return (
    <Button key="categoriesreset" onClick={() => factoryReset()}>
      reset categories
    </Button>
  );
};
export default CategoriesReset;
