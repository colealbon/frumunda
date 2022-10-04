import {
  Suspense,
  FunctionComponent,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import useSWR from 'swr';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Divider,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PageChooser from './PageChooser';
import CategoryChooser from './CategoryChooser';
import { labelOrEcho } from '../utils';

const drawerWidth = 180;

type Props = { children: ReactNode };

const Navigator: FunctionComponent<Props> = ({ children }: Props) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: selectedPage } = useSWR('selectedPage');
  const { data: selectedCategory } = useSWR('selectedCategory');

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen, setMobileOpen]);

  return (
    <div>
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
            {[selectedPage]
              .flat()
              .filter(
                () =>
                  selectedCategory === '' ||
                  selectedCategory === 'allCategories'
              )
              .map(() => labelOrEcho(`${selectedPage}`))}

            {[selectedPage]
              .flat()
              .filter(() => selectedCategory !== '')
              .filter(() => selectedCategory !== 'allCategories')
              .map(() => `posts - ${selectedCategory}`)}
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
            onClose={() => handleDrawerToggle()}
            onBlur={() => handleDrawerToggle()}
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
    </div>
  );
};

export default Navigator;
