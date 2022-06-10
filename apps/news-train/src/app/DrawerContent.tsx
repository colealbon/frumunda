import React, {FunctionComponent, ComponentPropsWithoutRef } from 'react';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';

interface Props extends ComponentPropsWithoutRef<"button"> {
  handleCategoryClick: (index: string) => void
  handlePageIndexClick: (index: string) => void
  selectedCategoryIndex: string
  selectedPageIndex: string
}

const categoryItems = {
  allCategories: 'all categories'
}

const pageItems = {
  settings: 'Settings',
  classifiers: 'Classifiers',
  donate: 'Donate'
}

const DrawerContent: FunctionComponent<Props> = (props: Props) => {
  const {
    handleCategoryClick, 
    handlePageIndexClick, 
    selectedCategoryIndex,
    selectedPageIndex
  } = {...props}
  return (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {
          Object.entries(categoryItems).map((categoryItemEntry: [string, string]) => {
            const index = categoryItemEntry[0]
            const label = categoryItemEntry[1]
            return (
              <ListItem key={`${index}`} disablePadding>
              <ListItemButton disabled={ `${index}` === `${selectedCategoryIndex}` } onClick={() => handleCategoryClick(`${index}`)} >
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={`${label}`} />
              </ListItemButton>
            </ListItem>
            )
          })
        }
      </List>
      <Toolbar />
      <Divider />
      <List>
        {
        Object.entries(pageItems).map((routeItemEntry: [string, string]) => {
          const index = routeItemEntry[0]
          const label = routeItemEntry[1]
          return (
            <ListItem key={`${index}`} disablePadding>
            <ListItemButton disabled={ `${index}` === `${selectedPageIndex}`} onClick={() => handlePageIndexClick(`${index}`)} >
              <ListItemText primary={`${label}`} />
            </ListItemButton>
          </ListItem>
          )
        })
        }
      </List>
    </div>
  );
}

export default DrawerContent