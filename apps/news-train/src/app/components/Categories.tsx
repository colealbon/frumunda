import React, { FunctionComponent, createContext } from 'react';
// import { Box } from '@mui/material';
// import CategoriesAdd from './CategoriesAdd';
// import CategoriesReset from './CategoriesReset';
// import CategoryToggle from './CategoryToggle';
// import CategoryDelete from './CategoryDelete';

export const CategoryContext = createContext('');

const Categories: FunctionComponent = () => {
  const defaultCategories = {"science":{"checked":true},"bitcoin":{"checked":true},"local":{"checked":true},"business":{"checked":true},"world":{"checked":true},"politics":{"checked":true},"technology":{"checked":true},"variety":{"checked":true},"us":{"checked":false}}
  // const {categories} = useCategories()
  return (<pre>{JSON.stringify(defaultCategories, null, 2)}</pre>)
  // return (
  //   <>
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
  //   </>
  // );
};

export default Categories;
