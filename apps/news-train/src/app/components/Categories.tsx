import React, { FunctionComponent, createContext } from 'react';

export const CategoriesContext = createContext({});

const Categories: FunctionComponent = () => {
  const defaultCategories = {"science":{"checked":true},"bitcoin":{"checked":true},"local":{"checked":true},"business":{"checked":true},"world":{"checked":true},"politics":{"checked":true},"technology":{"checked":true},"variety":{"checked":true},"us":{"checked":true}}
  return (<pre>{JSON.stringify(defaultCategories, null, 2)}</pre>)
};

export default Categories;
