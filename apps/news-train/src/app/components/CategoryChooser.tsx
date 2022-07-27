import React, { FunctionComponent } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse
} from '@mui/material';
import useSWR, {mutate} from 'swr'
import {useStacks} from '../react-hooks/useStacks'
import defaultCategories from '../react-hooks/defaultCategories.json'

const CategoryChooserCategories: FunctionComponent = () => {
  const {fetchFileLocal, persistLocal} = useStacks()
  const { data: categoriesdata } = useSWR(
    'categories', 
    fetchFileLocal('categories', defaultCategories),
    {fallbackData: defaultCategories}
  )
  const categories = {...categoriesdata as object}
  const { data: selectedCategory } = useSWR('selectedCategory', fetchFileLocal('selectedCategory', ''))

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    
      <List>
        <ListItem key={'category_chooser_allcategories'} disablePadding>
          <ListItemButton 
            key={'category_chooser_button_allcategories'}
            onClick={() => {
              handleClick()
              mutate(
                'selectedCategory',
                persistLocal('selectedCategory', ''),
                {optimisticData: ''}
              )
              mutate(
                'selectedPage',
                persistLocal('selectedPage', 'posts'),
                {optimisticData: 'posts'}
              )
            }
          }>
            <ListItemText key={'CategoryChooserAllCategories'} primary={'posts'} />
          </ListItemButton>
        </ListItem>

        <Collapse in={true} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
        {
          Object.entries({...categories as object})
          .filter(categoryItem =>  Object.assign(categoryItem[1] as object).checked === true)
          .map((categoryItem) => {
            const newCategory = `${categoryItem[0]}`
            const handleClick = () => {
              mutate(
                'selectedCategory',
                persistLocal('selectedCategory', newCategory),
                {optimisticData: newCategory}
              )
              mutate(
                'selectedPage',
                persistLocal('selectedPage', 'posts'),
                {optimisticData: 'posts'}
              )
            }
            return (
              <ListItem key={`category_chooser_${categoryItem[0]}`} disablePadding>
                <ListItemButton 
                  sx={{ pl: 4 }} 
                  key={`category_chooser_button_${categoryItem[0]}`}
                  disabled={`${categoryItem[0]}` === `${selectedCategory}`} 
                  onClick={handleClick}
                > 
                  {
                    [Object.entries(categoryItem[1] as object)
                    .filter(attributeItem => attributeItem[0] === 'label')
                    .map(attributeItem => attributeItem[1])
                    .filter(label => {
                      return !!label
                    })
                    .concat(categoryItem[0])
                    .find(() => true)]
                    .flat()
                    .map((labelOrIndex: string) => <ListItemText key={labelOrIndex} primary={labelOrIndex} />)
                  }
                </ListItemButton>
              </ListItem>
            )
          })
        }
        </List>
      </Collapse>
  </List>
  
  );
}
export default CategoryChooserCategories
