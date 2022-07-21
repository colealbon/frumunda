import {
  FunctionComponent,
  Fragment,
  useState
} from 'react';
import { IconButton } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import useSWR, { mutate } from 'swr';
import {useStacks} from '../react-hooks/useStacks'

const CategoryDelete: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {

  const { persist } = useStacks()
  const { data: categories } = useSWR('categories')
  const [inFlight, setInFlight] = useState(false)
  
  const deleteCategory = () => {
    setInFlight(true)
    const newCategories = {
      ...Object.fromEntries(
        Object.entries(categories).filter(
          (category: [string, unknown]) => category[0] !== props.text
        )
      ),
    }
    mutate(
      'categories', 
      persist('categories', newCategories), 
      { optimisticData: newCategories, rollbackOnError: true }
    )
    .then(() => setInFlight(false))
  }

  return (
    <Fragment>
      {Object.entries(categories)
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
