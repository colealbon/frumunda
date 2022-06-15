import React, { FunctionComponent, ComponentPropsWithoutRef, Suspense} from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse
} from '@mui/material';

import {useCategories} from '../react-hooks/useCategories'
interface CategoryChooserProps extends ComponentPropsWithoutRef<"button"> {
  handleCategoryClick: (index: string) => void
  handlePageIndexClick: (index: string) => void
  selectedCategoryIndex: string
  selectedPageIndex: string
  labelOrEcho: (index: string) => string
}

const CategoryChooserCategories: FunctionComponent<CategoryChooserProps> = (props: CategoryChooserProps) => {
  const {
    handleCategoryClick, 
    handlePageIndexClick, 
    selectedCategoryIndex
  } = {...props}
  const { categories } = useCategories()
  const [open, setOpen] = React.useState(true);

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
              handleCategoryClick('allCategories')
              handlePageIndexClick('posts')
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
            return (
              <ListItem key={`category_chooser_${categoryItem[0]}`} disablePadding>
                <ListItemButton 
                  sx={{ pl: 4 }} 
                  key={`category_chooser_button_${categoryItem[0]}`}
                  disabled={`${categoryItem[0]}` === `${selectedCategoryIndex}`} 
                  onClick={() => {
                      handleCategoryClick(`${categoryItem[0]}`)
                      handlePageIndexClick('posts')
                    }
                  }
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
