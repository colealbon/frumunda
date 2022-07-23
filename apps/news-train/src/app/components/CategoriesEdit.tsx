import { FunctionComponent } from 'react';
import useSWR from 'swr'
import {useStacks} from '../react-hooks/useStacks'
import defaultCategories from '../react-hooks/defaultCategories.json'

import CategoriesAdd from './CategoriesAdd';
import CategoriesReset from './CategoriesReset';

import CategoryToggle from './CategoryToggle';
import CategoryDelete from './CategoryDelete';

const CategoriesEdit: FunctionComponent = () => {
  const {fetchFile} = useStacks()
  const { data: categories } = useSWR('categories', fetchFile('categories', defaultCategories))

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
