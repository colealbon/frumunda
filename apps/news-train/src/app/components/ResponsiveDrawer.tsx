import React, {useCallback} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DrawerContent from './DrawerContent';
import CategoriesFetch from './CategoriesFetch'
import DrawerContentCategories from './DrawerContentCategories'
import Contribute from './Contribute'
import Classifiers from './Classifiers'
import Posts from './Posts'
import Categories from './Categories'


const drawerWidth = 240;

export default function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(null);
  const [selectedPageIndex, setSelectedPageIndex] = React.useState('cafe-society.news');
  const labelOrEcho = (index: string) => {
    return `${Object.entries({
      classifiers: 'Classifiers',
      contribute: 'Contribute',
      categories: 'Categories',
      community: 'Community',
      commerce: 'Commerce',
      posts: 'Posts'
    })
    .filter(labelsEntry => labelsEntry[0] === `${index}`)
    .map((labelsEntry) => labelsEntry[1])
    .concat(`${index}`)
    .find(() => true)}`
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const setSelectedCategoryIndexCallback = useCallback((selectedCategoryIndex: string) => {
    const cloneSelectedIndex = structuredClone(selectedCategoryIndex)
    setSelectedCategoryIndex(cloneSelectedIndex)
  }, [setSelectedCategoryIndex])

  const setSelectedPageIndexCallback = useCallback((selectedPageIndex: string) => {
    const cloneSelectedPageIndex = structuredClone(selectedPageIndex)
    setSelectedPageIndex(cloneSelectedPageIndex)
  }, [setSelectedPageIndex])

  const handleListItemClick = (listItemIndex: string) => {
    setSelectedCategoryIndexCallback(listItemIndex);
  }

  const handlePageIndexClick = (pageIndex: string) => {
    setSelectedPageIndexCallback(pageIndex);
  }

  const cloneSelectedCategoryIndex = `${selectedCategoryIndex}`
  const cloneSelectedPageIndex = `${selectedPageIndex}`

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {labelOrEcho(`${selectedPageIndex}`)}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <CategoriesFetch>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            <DrawerContentCategories
              handleCategoryClick={handleListItemClick}
              handlePageIndexClick={handlePageIndexClick} 
              selectedCategoryIndex={cloneSelectedCategoryIndex}
              selectedPageIndex={cloneSelectedPageIndex}
              labelOrEcho={labelOrEcho}
            />
            <DrawerContent
              handlePageIndexClick={handlePageIndexClick} 
              selectedPageIndex={cloneSelectedPageIndex}
              labelOrEcho={labelOrEcho}
            />
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            <DrawerContentCategories
              handleCategoryClick={handleListItemClick}
              handlePageIndexClick={handlePageIndexClick} 
              selectedCategoryIndex={cloneSelectedCategoryIndex}
              selectedPageIndex={cloneSelectedPageIndex}
              labelOrEcho={labelOrEcho}
            />
          <DrawerContent 
            handlePageIndexClick={handlePageIndexClick}
            selectedPageIndex={cloneSelectedPageIndex}
            labelOrEcho={labelOrEcho}
          />
        </Drawer>
        </CategoriesFetch>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {
          [cloneSelectedPageIndex].flat().filter((pageIndex) => {
            return selectedPageIndex === 'contribute'
          }).map(() => <Contribute key='contribute'/>)
        }
        {
          [cloneSelectedPageIndex].flat().filter((pageIndex) => {
            return selectedPageIndex === 'classifiers'
          }).map(() => <Classifiers key='classifiers'/>)
        }
        {
          [cloneSelectedPageIndex].flat().filter((pageIndex) => {
            return selectedPageIndex === 'posts'
          }).map(() => <Posts key='posts' selectedCategoryIndex={cloneSelectedCategoryIndex}/>)
        }
        {
          [cloneSelectedPageIndex].flat().filter((pageIndex) => {
            return selectedPageIndex === 'categories'
          }).map(() => <Categories key='categories' />)
        }
      </Box>
    </Box>
  );
}
