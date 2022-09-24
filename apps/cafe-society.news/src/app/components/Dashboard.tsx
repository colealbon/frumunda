import {
  Suspense,
  FunctionComponent,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import useSWR from 'swr';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';

import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Divider, Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';
import PageChooser from './PageChooser';
import CategoryChooser from './CategoryChooser';
import { labelOrEcho } from '../utils';
import localforage from 'localforage';

const drawerWidth = 180;

type Props = { children: ReactNode };

const Dashboard: FunctionComponent<Props> = ({ children }: Props) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: selectedPage } = useSWR(
    'selectedPage',
    () => localforage.getItem('selectedPage'),
    { fallbackData: 'posts' }
  );
  const { data: selectedCategory } = useSWR('selectedCategory', () =>
    localforage.getItem('selectedCategory')
  );

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen, setMobileOpen]);

  const setDrawerClosed = useCallback(() => {
    setMobileOpen(false);
  }, [setMobileOpen]);

  return (
    <Box sx={{ display: 'flex'}} style={{ backgroundColor: '#E7EBF0', padding: '0px'}}>
      
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
            {[selectedPage]
              .flat()
              .filter(
                () =>
                  selectedCategory === '' ||
                  selectedCategory === 'allCategories'
              )
              .map(() => labelOrEcho(`${selectedPage}`.replace('posts', 'cafe-society.news')))}
            {[selectedPage]
              .flat()
              .filter(() => selectedCategory !== '')
              .filter(() => selectedCategory !== 'allCategories')
              .map(() =>
                `cafe-society.news - ${selectedCategory}`
                  .replace(` - undefined`, '')
                  .replace(` - null`, '')
              )}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Suspense fallback={<>loading categories...</>}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setDrawerClosed()}
            onBlur={() => setDrawerClosed()}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
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
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
            open
          >
            <Toolbar />
            <Divider />
            <Suspense fallback={<>loading menu items</>}>
              <CategoryChooser />
              <PageChooser />
            </Suspense>
          </Drawer>
        </Suspense>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Dashboard;
