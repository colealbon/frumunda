import React, {useContext, FunctionComponent, ComponentPropsWithoutRef } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader
} from '@mui/material';
import { CategoriesContext } from './CategoriesFetch';

interface DrawerContentProps extends ComponentPropsWithoutRef<"button"> {
  handleCategoryClick: (index: string) => void
  handlePageIndexClick: (index: string) => void
  selectedCategoryIndex: string
  selectedPageIndex: string
  labelOrEcho: (index: string) => string
}

const DrawerContentCategories: FunctionComponent<DrawerContentProps> = (props: DrawerContentProps) => {
  const {
    handleCategoryClick, 
    handlePageIndexClick, 
    selectedCategoryIndex
  } = {...props}

  const fetchedCategoriesContext = useContext(CategoriesContext);
  const categories = structuredClone(fetchedCategoriesContext)

  return (
      <List
        subheader={
          <ListSubheader component="div" id="categories-subheader">
            <ListItemButton 
            sx={{ pl: 1 }} 
              key={`category_chooser_button_allCategories`}
              disabled={`${selectedCategoryIndex}` === 'allCategories'} 
              onClick={() => {
                  handleCategoryClick('allCategories')
                  handlePageIndexClick('posts')
                }
              }
            >
              All Categories
            </ListItemButton>
          </ListSubheader>
        }
      >
        {
          Object.entries(categories)
          .filter(categoryItem =>  Object.assign(categoryItem[1] as object).checked === true)
          .map((categoryItem) => {
            return (
              <ListItem key={`category_chooser_${categoryItem[0]}`} disablePadding>
              <ListItemButton 
                sx={{ pl: 4 }} 
                key={`category_chooser_button_${categoryItem[0]}`}
                disabled={ `${categoryItem[0]}` === `${selectedCategoryIndex}` && `${categoryItem[0]}` !== 'allCategories'} 
                onClick={() => {
                    handleCategoryClick(`${categoryItem[0]}`)
                    handlePageIndexClick('posts')
                  }
                }
              > {
                [Object.entries(categoryItem[1] as object)
                .filter(attributeItem => attributeItem[0] === 'label')
                .map(attributeItem => attributeItem[1])
                .filter(label => {
                  return !!label
                })
                .concat(categoryItem[0])
                .find(() => true)]
                .flat()
                .map((labelOrIndex: string) => {
                  return (
                    <ListItemText key={labelOrIndex} primary={labelOrIndex} />
                  )
                })
              }
              </ListItemButton>
            </ListItem>
            )
          })
        }
        </List>
  );
}
export default DrawerContentCategories
