import React, {FunctionComponent, ComponentPropsWithoutRef } from 'react';
import {List,ListItem,ListItemButton,ListItemText,Collapse } from '@mui/material';
import { useSelectedPageIndex } from '../react-hooks/useSelectedPageIndex'

interface PageChooserProps extends ComponentPropsWithoutRef<"button"> {
  labelOrEcho: (index: string) => string
}


const PageChooser: FunctionComponent<PageChooserProps> = (props: PageChooserProps) => {
  const {
    labelOrEcho
  } = {...props}

  const {selectedPageIndex, persistSelectedPageIndex} = useSelectedPageIndex()

  return (
    <div>
      <List>
        <ListItem key={'classifiers'} disablePadding>
          <ListItemButton disabled={ 'classifiers' === `${selectedPageIndex}`} onClick={() => persistSelectedPageIndex('classifiers')} >
            <ListItemText primary={`${labelOrEcho('classifiers')}`} />
          </ListItemButton>
        </ListItem>
        <ListItem key={'contribute'} disablePadding>
          <ListItemButton disabled={ 'contribute' === `${selectedPageIndex}`} onClick={() => persistSelectedPageIndex('contribute')} >
            <ListItemText primary={`${labelOrEcho('contribute')}`} />
          </ListItemButton>
        </ListItem>
        <ListItemText sx={{ pl: 2 }} primary="Settings" />
        <Collapse in={true} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
          <ListItem key={'pageChooserFeeds'} disablePadding>
              <ListItemButton 
                sx={{ pl: 4 }} 
                disabled={'feeds' === `${selectedPageIndex}`} 
                onClick={() => {
                  persistSelectedPageIndex('feeds')
                } }
              >
                <ListItemText primary={`${labelOrEcho('feeds')}`} />
              </ListItemButton>
            </ListItem>
            <ListItem key={'pageChooserCategories'} disablePadding>
              <ListItemButton 
                sx={{ pl: 4 }} 
                disabled={'categories' === `${selectedPageIndex}`} 
                onClick={() => {
                  persistSelectedPageIndex('categories')
                } }
              >
                <ListItemText primary={`${labelOrEcho('categories')}`} />
              </ListItemButton>
            </ListItem>
            <ListItem key={'pageChooserStacks'} disablePadding>
              <ListItemButton 
                sx={{ pl: 4 }} 
                disabled={'stacks' === `${selectedPageIndex}`} 
                onClick={() => {
                  persistSelectedPageIndex('stacks')
                } }
              >
                <ListItemText primary={`${labelOrEcho('stacks')}`} />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </div>
  );
}

export default PageChooser