import { ChangeEvent, useState, useCallback } from 'react';
import { useStorage } from '../react-hooks/useStorage';
import { TextField } from '@mui/material';
import useSWR, { mutate } from 'swr';

const CategoriesAdd = () => {
  const { data: categories } = useSWR('categories');
  const [inFlight, setInFlight] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { persistLocal } = useStorage();

  const setInputCallback = useCallback(
    (newInputValue: string) => {
      setInputValue(newInputValue);
    },
    [setInputValue]
  );

  const addCategory = () => {
    setInFlight(true);
    const newCategory = JSON.parse(`{"${inputValue}": {"checked": true}}`);
    const newCategories = { ...newCategory, ...categories };
    mutate('categories', persistLocal('categories', newCategories), {
      optimisticData: newCategories,
      rollbackOnError: true,
    }).then(() => setInFlight(false));
  };

  return (
    <TextField
      disabled={inFlight}
      id="addCategoryTextField"
      placeholder="add category here"
      value={inputValue}
      onKeyPress={(event: { key: string }) => {
        [event.key]
          .filter((theKey) => theKey === 'Enter')
          .forEach(() => {
            addCategory();
            setInputCallback('');
          });
      }}
      onChange={(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        setInputCallback(event.target.value);
      }}
      fullWidth
    />
  );
};

export default CategoriesAdd;
