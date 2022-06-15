import React, {
  ChangeEvent,
  useState,
  useCallback,
  useContext
} from 'react';
import { TextField } from '@mui/material';
import { CategoriesContext } from './CategoriesFetch';

type categoriesAddProps = {
  setCategoriesCallback: (categories: object) => void
};
const CategoriesAdd = ({setCategoriesCallback} : categoriesAddProps) => {
  const [inputValue, setInputValue] = useState('');
  const categoriesContext = useContext(CategoriesContext);
  const defaultCategories: object = structuredClone(categoriesContext)

  const setInputCallback = useCallback(
    (newInputValue: string) => {
      setInputValue(newInputValue);
    },
    [setInputValue]
  );

  const addCategoryCallback = useCallback(() => {
    const newCategory = JSON.parse(`{"${inputValue}": {"checked": true}}`);
    setCategoriesCallback({ ...newCategory, ...JSON.parse(JSON.stringify(defaultCategories)) });
  }, [defaultCategories, setCategoriesCallback, inputValue]);

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
