import React, { FunctionComponent, useState, useCallback, useContext, useEffect } from 'react';
import CategoriesAdd from './CategoriesAdd';
import { CategoriesContext } from './CategoriesFetch';

// import CategoriesReset from './CategoriesReset';
// import CategoryToggle from './CategoryToggle';
// import CategoryDelete from './CategoryDelete';

const CategoriesEdit: FunctionComponent = () => {

  const [categories, setCategories] = useState()
  const categoriesContext = useContext(CategoriesContext);
  
  const setCategoriesCallback = useCallback((newCategories: object) => {
    const deepCopyCategories = structuredClone(newCategories)
    setCategories(deepCopyCategories)
  }, [setCategories])

  useEffect(() => {
    const defaultCategories = structuredClone(categoriesContext)
    setCategoriesCallback(defaultCategories)
  }, [categoriesContext, setCategoriesCallback] )

  return (
    <>
      <CategoriesAdd setCategoriesCallback={setCategoriesCallback} />
      <pre>
        {JSON.stringify(categories, null, 2)}
      </pre>
    </>
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
