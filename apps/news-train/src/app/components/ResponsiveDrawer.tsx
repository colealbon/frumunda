import React, {useCallback, Suspense} from 'react';
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
import Contribute from './Contribute'
import Classifiers from './Classifiers'
import Posts from './Posts'
import Stacks from './Stacks'
import CategoriesEdit from './CategoriesEdit'
import FeedsEdit from './FeedsEdit'
import ErrorBoundary from './ErrorBoundary'
import { useSelectedCategoryIndex } from '../react-hooks/useSelectedCategoryIndex'
import { useSelectedPageIndex } from '../react-hooks/useSelectedPageIndex'

const drawerWidth = 240;

export default function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const {selectedCategoryIndex, persistSelectedCategoryIndex} = useSelectedCategoryIndex();
  const { selectedPageIndex } = useSelectedPageIndex();

  const labelOrEcho = (index: string) => {
    return `${Object.entries({
      classifiers: 'Classifiers',
      contribute: 'Contribute',
      categories: 'Categories',
      community: 'Community',
      commerce: 'Commerce',
      posts: 'Posts',
      feeds: 'Feeds',
      stacks: 'Stacks'
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
    persistSelectedCategoryIndex(cloneSelectedIndex)
  }, [persistSelectedCategoryIndex])

  const handleListItemClick = (listItemIndex: string) => {
    setSelectedCategoryIndexCallback(listItemIndex);
  }

  const cloneSelectedCategoryIndex = `${selectedCategoryIndex}`

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
                  <Suspense fallback={<h2>fetching categories.</h2>}>
                    <CategoryChooser />
                  </Suspense>
                <PageChooser
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
                <Toolbar />
                <Divider />
                  <Suspense fallback={<h2>fetching categories.</h2>}>
                  <CategoryChooser/>
                  </Suspense>
                <PageChooser labelOrEcho={labelOrEcho} />
              </Drawer>
          </Suspense>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />    
        {
          [selectedPageIndex].flat().filter(() => {
            return selectedPageIndex === 'contribute'
          }).map(() => <Contribute key='contribute'/>)
        }
        {
          [selectedPageIndex].flat().filter(() => {
            return selectedPageIndex === 'classifiers'
          }).map(() => <Classifiers key='classifiers'/>)
        }
        {
          [selectedPageIndex].flat().filter(() => {
            return selectedPageIndex === 'posts'
          }).map(() => <Posts key='posts' />)
        }
        {
          [selectedPageIndex].flat().filter(() => {
            return selectedPageIndex === 'categories'
          }).map(() => {
            return (
              <ErrorBoundary key={'errorBoundaryCategories'} fallback={<>error fetching categories</>}>
                <Suspense fallback={<>...fetching Categories</>}>
                  <CategoriesEdit key='categories' />
                </Suspense>
              </ErrorBoundary>
            )
          })
        }
        {
          [selectedPageIndex].flat().filter(() => {
            return selectedPageIndex === 'feeds'
          }).map(() => {
            return (
              <ErrorBoundary key={'errorBoundaryFeeds'} fallback={<>error fetching feeds</>}>
                <Suspense fallback={<>...fetching Feeds</>}>
                  <FeedsEdit key='feedsedit' />
                </Suspense>
              </ErrorBoundary>
            )
          })
        }
        {
          [selectedPageIndex].flat().filter(() => {
            return selectedPageIndex === 'stacks'
          }).map(() => {
            return (
              <ErrorBoundary key={'errorBoundaryStacks'} fallback={<>error fetching stacks session</>}>
                <Suspense fallback={<>...fetching stacks session</>}>
                  <Stacks key='stacks' />
                </Suspense>
              </ErrorBoundary>
            )
          })
        }
      </Box>
    </Box>
  );
}