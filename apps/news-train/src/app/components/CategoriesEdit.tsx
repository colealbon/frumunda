import React, { FunctionComponent, Suspense } from 'react';
import { useCategories } from '../react-hooks/useCategories'

import CategoriesAdd from './CategoriesAdd';
import CategoriesReset from './CategoriesReset';

// import CategoryToggle from './CategoryToggle';
// import CategoryDelete from './CategoryDelete';

const CategoriesEdit: FunctionComponent = () => {
  const { categories } = useCategories()

  return (
      <Suspense fallback={<h2>fetching categories.</h2>}>
        <>
          <CategoriesAdd key='CategoriesAdd' />
          <div />
          <CategoriesReset />
        </>
      </Suspense>
  )

  //     <Box p={1}>
  //       <CategoriesReset />
  //     </Box>
  // );
};

export default CategoriesEdit;
