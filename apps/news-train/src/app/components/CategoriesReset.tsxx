import React, { FunctionComponent, useState } from 'react';
import Button from '@mui/material/Button';
import { useCategories } from '../react-hooks/useCategories';

const CategoriesReset: FunctionComponent = () => {

  const { factoryReset } = useCategories();

  return (
    <Button key="categoriesreset" onClick={() => factoryReset()}>
      reset categories
    </Button>
  );
};
export default CategoriesReset;
