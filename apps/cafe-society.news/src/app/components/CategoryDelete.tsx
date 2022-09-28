import { FunctionComponent, Fragment, useState } from 'react';
import { IconButton } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import useSWR, { mutate } from 'swr';
import { useStorage } from '../react-hooks/useStorage';

const CategoryDelete: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const { persistLocal } = useStorage();
  const { data: categories } = useSWR('categories');

  const deleteCategory = () => {
    const newCategories = {...categories}.delete(props.text)
    mutate('categories', persistLocal('categories', newCategories), {
      optimisticData: newCategories,
      rollbackOnError: true,
    });
  };

  return (
    <Fragment>
      {Object.entries({ ...categories })
        .filter((category: [string, unknown]) => category[0] === props.text)
        .map((category: [string, unknown]) => {
          return (
            <Fragment key={`${category}`}>
              <IconButton
                aria-label={`delete category ${category}`}
                onClick={deleteCategory}
              >
                <DeleteOutlined />
              </IconButton>
            </Fragment>
          );
        })}
    </Fragment>
  );
};

export default CategoryDelete;
