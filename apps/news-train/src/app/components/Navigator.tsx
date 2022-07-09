import React, {Suspense, FunctionComponent, ReactNode} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Divider, Toolbar} from '@mui/material';
import Typography from '@mui/material/Typography';
import PageChooser from './PageChooser';
import CategoryChooser from './CategoryChooser'
import { useSelectedPageIndex } from '../react-hooks/useSelectedPageIndex'
import { useSelectedCategoryIndex } from '../react-hooks/useSelectedCategoryIndex'
import { labelOrEcho } from '../utils'

const drawerWidth = 240;

type Props = {children: ReactNode}

const Navigator: FunctionComponent<Props> = ({children}: Props) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { selectedPageIndex } = useSelectedPageIndex();
  const { selectedCategoryIndex } = useSelectedCategoryIndex();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
          {[selectedPageIndex].flat()
          .filter(() => selectedCategoryIndex === '' || selectedCategoryIndex === 'allCategories')
          .map(() => labelOrEcho(`${selectedPageIndex}`))
          }
          {[selectedPageIndex].flat()
          .filter(() => selectedCategoryIndex !== '' )
          .filter(() =>selectedCategoryIndex !== 'allCategories')
          .map(() => `posts - ${selectedCategoryIndex}`)
          }
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Suspense fallback={<>loading categories...</>}>
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
              <Toolbar />
              <Divider />
              <CategoryChooser />
              <PageChooser />
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
              open
            >
              <Toolbar />
              <Divider />
              <Suspense fallback={<>loading menu items</>}>
                <CategoryChooser/>
                <PageChooser/>
              </Suspense>
            </Drawer>
          </Suspense>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default Navigator
