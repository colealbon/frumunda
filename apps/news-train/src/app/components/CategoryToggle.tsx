import React, { useCallback, FunctionComponent, Fragment } from 'react';
import { Switch, FormControlLabel,Typography} from '@mui/material';
import { useCategories } from '../react-hooks/useCategories';

const CategoryToggle: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {

  const { categories, publishCategories, inFlight } = useCategories()

  const setCategoriesCallback = useCallback(() => {
    const newCategory = JSON.parse(
      JSON.stringify({
        ...Object.fromEntries(
          Object.entries(JSON.parse(JSON.stringify(categories)))
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
                      .map((attribute : [string, unknown]) => [attribute[0], !attribute[1]])
                  ),
                  ...Object.fromEntries(
                    Object.entries({
                      ...(category[1] as Record<string, unknown>),
                    }).filter((attribute : [string, unknown]) => attribute[0] !== 'checked')
                  ),
                },
              ];
            })
        ),
      })
    );
    const newCategories = { ...categories as object, ...newCategory }
    publishCategories(newCategories)

  }, [categories, props.text, publishCategories]);

  return (
    <Fragment>
      {Object.entries(JSON.parse(JSON.stringify(categories)))
        .filter((category : [string, unknown]) => category[0] === props.text)
        .map((category : [string, unknown]) => {
          const attributes = category[1] as Record<string, unknown>;
          return (
            <FormControlLabel
              disabled={inFlight}
              key={category[0]}
              control={
                <Switch
                  size='medium'
                  checked={Object.values(
                    Object.fromEntries(
                      [Object.entries({...attributes})].flat().filter(
                        (attribute : [string, unknown]) => attribute[0] === 'checked'
                      )
                    )
                  ).some(checked => checked)}
                  onChange={() => setCategoriesCallback()}
                  name={props.text}
                />
              }
              label={<Typography>{props.text}</Typography>}
            />
          );
        })}
    </Fragment>
  );
};

export default CategoryToggle;
