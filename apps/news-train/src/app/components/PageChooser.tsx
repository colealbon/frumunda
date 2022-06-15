import React, {FunctionComponent, ComponentPropsWithoutRef } from 'react';
import {List,ListItem,ListItemButton,ListItemText,Collapse } from '@mui/material';

interface PageChooserProps extends ComponentPropsWithoutRef<"button"> {
  handlePageIndexClick: (index: string) => void
  selectedPageIndex: string
  labelOrEcho: (index: string) => string
}

const DrawerContent: FunctionComponent<PageChooserProps> = (props: PageChooserProps) => {
  const {
    handlePageIndexClick, 
    selectedPageIndex,
    labelOrEcho
  } = {...props}

  return (
    <div>
      <List>
        <ListItem key={'classifiers'} disablePadding>
          <ListItemButton disabled={ 'classifiers' === `${selectedPageIndex}`} onClick={() => handlePageIndexClick('classifiers')} >
            <ListItemText primary={`${labelOrEcho('classifiers')}`} />
          </ListItemButton>
        </ListItem>
        <ListItem key={'contribute'} disablePadding>
          <ListItemButton disabled={ 'contribute' === `${selectedPageIndex}`} onClick={() => handlePageIndexClick('contribute')} >
            <ListItemText primary={`${labelOrEcho('contribute')}`} />
          </ListItemButton>
        </ListItem>
        <ListItemText sx={{ pl: 2 }} primary="Settings" />
        <Collapse in={true} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem key={'category_chooser_allcategories'} disablePadding>
              <ListItemButton 
                sx={{ pl: 4 }} 
                disabled={'categories' === `${selectedPageIndex}`} 
                onClick={() => {
                  handlePageIndexClick('categories')
                } }
              >
                <ListItemText primary={`${labelOrEcho('categories')}`} />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </div>
  );
}

export default DrawerContent