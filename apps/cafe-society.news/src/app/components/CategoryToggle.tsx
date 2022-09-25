import { FunctionComponent, Fragment, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Switch, FormControlLabel } from '@mui/material';
import { useStorage } from '../react-hooks/useStorage';

const CategoryToggle: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const { data: categories } = useSWR('categories');
  const { persistLocal } = useStorage();
  const [inFlight, setInFlight] = useState(false);

  const toggleCategory = () => {
    const newCategory = {
      ...Object.fromEntries(
        Object.entries({ ...categories })
          .filter((category: [string, unknown]) => category[0] === props.text)
          .map((category: [string, unknown]) => {
            return [
              category[0],
              {
                ...Object.fromEntries(
                  Object.entries({
                    ...(category[1] as Record<string, unknown>),
                  })
                    .filter(
                      (attribute: [string, unknown]) =>
                        attribute[0] === 'checked'
                    )
                    .map((attribute: [string, unknown]) => [
                      attribute[0],
                      !attribute[1],
                    ])
                ),
                ...Object.fromEntries(
                  Object.entries({
                    ...(category[1] as Record<string, unknown>),
                  }).filter(
                    (attribute: [string, unknown]) => attribute[0] !== 'checked'
                  )
                ),
              },
            ];
          })
      ),
    };
    const newCategories = { ...(categories as object), ...newCategory };
    mutate('categories', persistLocal('categories', newCategories), {
      optimisticData: newCategories,
      rollbackOnError: true,
    }).then(() => setInFlight(false));
  };

  return (
    <Fragment>
      {Object.entries({ ...categories })
        .filter((category: [string, unknown]) => category[0] === props.text)
        .map((category: [string, unknown]) => {
          const attributes = category[1] as Record<string, unknown>;
          return (
            <FormControlLabel
              disabled={inFlight}
              key={category[0]}
              control={
                <Switch
                  size="medium"
                  checked={Object.values(
                    Object.fromEntries(
                      [Object.entries({ ...attributes })]
                        .flat()
                        .filter(
                          (attribute: [string, unknown]) =>
                            attribute[0] === 'checked'
                        )
                    )
                  ).some((checked) => checked)}
                  onChange={() => toggleCategory()}
                  name={props.text}
                />
              }
              label={<>{props.text}</>}
            />
          );
        })}
    </Fragment>
  );
};

export default CategoryToggle;
