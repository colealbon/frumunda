import { FunctionComponent } from 'react';
import Button from '@mui/material/Button';
import defaultCategories from '../react-hooks/defaultCategories.json';
import { useStacks } from '../react-hooks/useStacks';
import { mutate } from 'swr';

const CategoriesReset: FunctionComponent = () => {
  const { persistLocal } = useStacks();

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