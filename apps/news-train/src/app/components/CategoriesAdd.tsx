import React, {
  ChangeEvent,
  useState,
  useCallback,
} from 'react';
import { TextField } from '@mui/material';
import { useCategories } from '../react-hooks/useCategories'


const CategoriesAdd = () => {
  const [inputValue, setInputValue] = useState('');
  const { categories, setCategories } = useCategories()

  const setInputCallback = useCallback(
    (newInputValue: string) => {
      setInputValue(newInputValue);
    },
    [setInputValue]
  );

  const addCategoryCallback = useCallback(() => {
    const newCategory = JSON.parse(`{"${inputValue}": {"checked": true}}`);
    const newCategories = { ...newCategory, ...JSON.parse(JSON.stringify(categories)) }
    setCategories(newCategories);
  }, [ categories, setCategories, inputValue]);

  return (
      <TextField
        id="addCategoryTextField"
        placeholder="add category here"
        value={inputValue}
        onKeyPress={(event: {key: string}) => {
          [event.key]
            .filter(theKey => theKey === 'Enter')
            .forEach(() => {
              addCategoryCallback();
              setInputCallback('');
            });
        }}
        onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          setInputCallback(event.target.value);
        }}
        fullWidth
      />
  );
};

export default CategoriesAdd;
