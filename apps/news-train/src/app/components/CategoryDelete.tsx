import React, {
  useCallback,
  FunctionComponent,
  Fragment,
} from 'react';
import { IconButton } from '@mui/material';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { useCategories } from '../react-hooks/useCategories';

const CategoryDelete: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const { categories, publishCategories, inFlight } = useCategories()

  const deleteCategory = useCallback(() => {
    const newCategories = JSON.parse(
      JSON.stringify({
        ...Object.fromEntries(
          Object.entries(JSON.parse(JSON.stringify(categories))).filter(
            (category: [string, unknown]) => category[0] !== props.text
          )
        ),
      })
    );
    publishCategories(newCategories);
  }, [categories, props.text, publishCategories]);

  return (
    <Fragment>
      {Object.entries(JSON.parse(JSON.stringify(categories)))
        .filter((category: [string, unknown]) => category[0] === props.text)
        .map((category: [string, unknown]) => {
          return (
            <Fragment key={`${category}`}>
              <IconButton disabled={inFlight} aria-label="Delete Category" onClick={deleteCategory}>
                <DeleteOutlined />
              </IconButton>
            </Fragment>
          );
        })}
    </Fragment>
  );
};

export default CategoryDelete;
