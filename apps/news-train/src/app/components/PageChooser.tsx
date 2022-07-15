import {FunctionComponent } from 'react';
import {List,ListItem,ListItemButton,ListItemText,Collapse } from '@mui/material';
import { useSelectedPageIndex } from '../react-hooks/useSelectedPageIndex'
import { useSelectedCategoryIndex } from '../react-hooks/useSelectedCategoryIndex'
import { labelOrEcho } from '../utils'

const PageChooser: FunctionComponent = () => {

  const {selectedPageIndex, persistSelectedPageIndex} = useSelectedPageIndex()
  const {persistSelectedCategoryIndex} = useSelectedCategoryIndex()

  return (
    <div>
      <List>
        <ListItem key={'classifiers'} disablePadding>
          <ListItemButton disabled={ 'classifiers' === `${selectedPageIndex}`} onClick={() => {
            persistSelectedPageIndex('classifiers')
            persistSelectedCategoryIndex('')
          }} >
            <ListItemText primary={`${labelOrEcho('classifiers')}`} />
          </ListItemButton>
        </ListItem>
        <ListItem key={'contribute'} disablePadding>
          <ListItemButton disabled={ 'contribute' === `${selectedPageIndex}`} onClick={() => {
            persistSelectedPageIndex('contribute')
            persistSelectedCategoryIndex('')
          }} >
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
                  persistSelectedCategoryIndex('')
                }}
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
                  persistSelectedCategoryIndex('')
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
                  persistSelectedCategoryIndex('')
                } }
              >
                <ListItemText primary={`${labelOrEcho('stacks')}`} />
              </ListItemButton>
            </ListItem>
            <ListItem key={'pageChooserCorsProxies'} disablePadding>
              <ListItemButton 
                sx={{ pl: 4 }} 
                disabled={'corsproxies' === `${selectedPageIndex}`} 
                onClick={() => {
                  persistSelectedPageIndex('corsproxies')
                  persistSelectedCategoryIndex('')
                } }
              >
                <ListItemText primary={`${labelOrEcho('corsproxies')}`} />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </div>
  );
}

export default PageChooser