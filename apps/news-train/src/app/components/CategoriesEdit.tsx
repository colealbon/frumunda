import React, { FunctionComponent, Suspense } from 'react';
import { useCategories } from '../react-hooks/useCategories'

// import CategoriesAdd from './CategoriesAdd';
// import CategoriesReset from './CategoriesReset';
// import CategoryToggle from './CategoryToggle';
// import CategoryDelete from './CategoryDelete';

const CategoriesEdit: FunctionComponent = () => {
  const { categories } = useCategories()
  return (
      <Suspense fallback={<h2>fetching categories.</h2>}>
          <pre>
            {JSON.stringify(categories, null, 2)}
          </pre>
      </Suspense>
  )
  //     <Box p={1}>
  //       <CategoriesAdd />
  //     </Box>
  //     <Box p={1} maxWidth={600}>
  //       {Object.keys(JSON.parse(JSON.stringify(categories))).map(category => {
  //         return (
  //           <Box display="flex" key={category}>
  //             <Box width="100%">
  //               <CategoryToggle text={category} />
  //             </Box>
  //             <Box flexShrink={0}>
  //               <CategoryDelete text={category} />
  //             </Box>
  //           </Box>
  //         );
  //       })}
  //     </Box>

  //     <Box p={1}>
  //       <CategoriesReset />
  //     </Box>
  // );
};

export default CategoriesEdit;
