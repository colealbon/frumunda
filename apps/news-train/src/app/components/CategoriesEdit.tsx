import React, { FunctionComponent } from 'react';
import { useCategories } from '../react-hooks/useCategories'

import CategoriesAdd from './CategoriesAdd';
import CategoriesReset from './CategoriesReset';

import CategoryToggle from './CategoryToggle';
import CategoryDelete from './CategoryDelete';

const CategoriesEdit: FunctionComponent = () => {
  const { categories } = useCategories()

  return (

      <>
        <CategoriesAdd key='CategoriesAdd' />
        <div />
        <CategoriesReset />
        <div />
        {Object.keys(categories as object).map(category => {
          return (
            <div key={`category-edit-${category}`}>
              <CategoryToggle text={category} />
              <CategoryDelete text={category} />
            </div>
          );
        })}
      </>

  )
};

export default CategoriesEdit;
