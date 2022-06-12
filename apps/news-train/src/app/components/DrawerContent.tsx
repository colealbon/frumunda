import React, {FunctionComponent, ComponentPropsWithoutRef } from 'react';
import {StarBorder, ExpandLess, ExpandMore} from '@mui/icons-material';
import {Divider, List,ListItem,ListItemButton,ListItemIcon,ListItemText,Collapse } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';

interface DrawerContentProps extends ComponentPropsWithoutRef<"button"> {
  handleCategoryClick: (index: string) => void
  handlePageIndexClick: (index: string) => void
  selectedCategoryIndex: string
  selectedPageIndex: string
  labelOrEcho: (index: string) => string
}

const categoryItems = {
  allCategories: 'all categories'
}

const DrawerContent: FunctionComponent<DrawerContentProps> = (props: DrawerContentProps) => {
  const {
    handleCategoryClick, 
    handlePageIndexClick, 
    selectedCategoryIndex,
    selectedPageIndex,
    labelOrEcho
  } = {...props}

  const [openSettings, setOpenSettings] = React.useState(false);

  const handleClickSettings = () => {
    setOpenSettings(!openSettings);
  };

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
              <ListItemButton 
                disabled={ `${index}` === `${selectedPageIndex}` } 
                onClick={() => {
                    handleCategoryClick(`${index}`)
                    handlePageIndexClick('posts')
                  }
                }
              >
                <ListItemIcon>
                  <StarBorder />
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
        <ListItemButton onClick={handleClickSettings}>
          <ListItemText primary="Settings" />
          {openSettings ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSettings} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton 
              sx={{ pl: 4 }} 
              disabled={'categories' === `${selectedPageIndex}`} 
              onClick={() => {
                handlePageIndexClick('categories')
              } }
            >
              <ListItemText primary={`${labelOrEcho('categories')}`} />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </div>
  );
}

export default DrawerContent