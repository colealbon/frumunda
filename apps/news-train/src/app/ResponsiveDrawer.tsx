import React, {useCallback, Fragment} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DrawerContent from './DrawerContent';
import Donate from './Donate'

const drawerWidth = 240;

export default function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(null);
  const [selectedPageIndex, setSelectedPageIndex] = React.useState(null);

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

  const cloneSelectedCategoryIndex = structuredClone(selectedCategoryIndex)
  const cloneSelectedPageIndex = structuredClone(selectedPageIndex)

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
            cafe-society.news
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
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
          <DrawerContent
            handleCategoryClick={handleListItemClick}
            handlePageIndexClick={handlePageIndexClick} 
            selectedCategoryIndex={cloneSelectedCategoryIndex}
            selectedPageIndex={cloneSelectedPageIndex}
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
          <DrawerContent 
            handlePageIndexClick={handlePageIndexClick}
            handleCategoryClick={handleListItemClick}
            selectedCategoryIndex={cloneSelectedCategoryIndex}
            selectedPageIndex={cloneSelectedPageIndex}
          />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {
          [cloneSelectedPageIndex].flat().filter((pageIndex) => {
            return ['donate'].indexOf(pageIndex) === -1
          }).map((pageIndex: string) => <Fragment key={pageIndex}>{pageIndex}</Fragment>)
        }
        {
          [cloneSelectedPageIndex].flat().filter((pageIndex) => {
            return selectedPageIndex === 'donate'
          }).map(() => <Donate key='donate'/>)
        }
      </Box>
    </Box>
  );
}
