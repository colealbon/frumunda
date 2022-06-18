import React, { FunctionComponent } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse
} from '@mui/material';
import { useSelectedPageIndex } from '../react-hooks/useSelectedPageIndex'
import { useSelectedCategoryIndex } from '../react-hooks/useSelectedCategoryIndex'
import { useCategories } from '../react-hooks/useCategories'

const CategoryChooserCategories: FunctionComponent = () => {
  const { categories } = useCategories()
  const [open, setOpen] = React.useState(true);
  const {selectedPageIndex, persistSelectedPageIndex, mutate: mutateSelectedPageIndex } = useSelectedPageIndex()
  const {selectedCategoryIndex, persistSelectedCategoryIndex, mutate: mutateSelectedCategoryIndex } = useSelectedCategoryIndex()

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    
      <List>
        <ListItem key={'category_chooser_allcategories'} disablePadding>
          <ListItemButton 
            // sx={{ pl: 4 }} 
            key={'category_chooser_button_allcategories'}
            onClick={() => {
              handleClick()
              persistSelectedCategoryIndex('allCategories')
              persistSelectedPageIndex('posts')
              }
            }
          >
            <ListItemText key={'CategoryChooserAllCategories'} primary={'Posts'} />
          </ListItemButton>
        </ListItem>

        <Collapse in={true} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
        {
          Object.entries(categories as object)
          .filter(categoryItem =>  Object.assign(categoryItem[1] as object).checked === true)
          .map((categoryItem) => {
            const categoryIndex = `${categoryItem[0]}`
            const handleClick = () => {
                persistSelectedCategoryIndex(categoryIndex)
                persistSelectedPageIndex('posts')
            }
            return (
              <ListItem key={`category_chooser_${categoryItem[0]}`} disablePadding>
                <ListItemButton 
                  sx={{ pl: 4 }} 
                  key={`category_chooser_button_${categoryItem[0]}`}
                  disabled={`${categoryItem[0]}` === `${selectedCategoryIndex}`} 
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
