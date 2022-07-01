import React, {Suspense} from 'react';
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
import Feeds from './Feeds'
import Stacks from './Stacks'
import CategoriesEdit from './CategoriesEdit'
import CorsProxiesEdit from './CorsProxiesEdit'
import FeedsEdit from './FeedsEdit'
import ErrorBoundary from './ErrorBoundary'
import CorsProxiesLoad from './CorsProxiesLoad'
import { useSelectedPageIndex } from '../react-hooks/useSelectedPageIndex'
import { useSelectedCategoryIndex } from '../react-hooks/useSelectedCategoryIndex'

const drawerWidth = 240;

export const labelOrEcho = (index: string) => {
  return `${Object.entries({
    classifiers: 'Classifiers',
    contribute: 'Contribute',
    categories: 'Categories',
    community: 'Community',
    commerce: 'Commerce',
    posts: 'Posts',
    feeds: 'Feeds',
    stacks: 'Stacks',
    corsproxies: 'Cors Proxies'
  })
  .filter(labelsEntry => labelsEntry[0] === `${index}`)
  .map((labelsEntry) => labelsEntry[1])
  .concat(`${index}`)
  .find(() => true)}`
}



export default function ResponsiveDrawer() {
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
          .map(() => 'Posts')
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
                  <Suspense fallback={<h2>fetching categories.</h2>}>
                    <CategoryChooser />
                  </Suspense>
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
        {
          [selectedPageIndex].flat().filter(() => {
            return selectedPageIndex === 'contribute'
          })
          .filter(() => selectedCategoryIndex === '' || selectedCategoryIndex === 'allCategories')
          .map(() => <Contribute key='contribute'/>)
        }
        {
          [selectedPageIndex].flat().filter(() => {
            return selectedPageIndex === 'classifiers'
          })
          .filter(() => selectedCategoryIndex === '' || selectedCategoryIndex === 'allCategories')
          .map(() => <Classifiers key='classifiers'/>)
        }
        {
          [selectedPageIndex].flat()
          .filter(() => selectedPageIndex === 'posts')
          .filter(() => selectedCategoryIndex === 'allCategories')
          
          .map(() => {
            return (
              <ErrorBoundary key={'errorBoundaryPosts'} fallback={<>error fetching posts</>}>
                <Suspense fallback={<>{`fetching ${selectedCategoryIndex} posts...`}</>}>
                  <CorsProxiesLoad>
                    <Feeds key='feedsdisplay' />
                  </CorsProxiesLoad>
                </Suspense>
              </ErrorBoundary>
            )
          })
        }
        {
          [selectedPageIndex].flat()
          .filter(() => selectedPageIndex === 'posts')
          .filter(() => selectedCategoryIndex === '')
          .map(() => {
            return (
              <ErrorBoundary key={'errorBoundaryFeeds'} fallback={<>error fetching posts</>}>
                <Suspense fallback={<>{`fetching ${selectedCategoryIndex} posts...`}</>}>
                  <CorsProxiesLoad>
                    <Feeds key='feedsdisplay' />
                  </CorsProxiesLoad>
                </Suspense>
              </ErrorBoundary>
            )
          })
        }
        {
          [selectedCategoryIndex].flat()
          .filter(() => selectedCategoryIndex !== '')
          .filter(() => selectedCategoryIndex !== 'allCategories')
          .map(() => {
            return (
              <ErrorBoundary key={'errorBoundaryFeeds'} fallback={<>error fetching posts</>}>
                <Suspense fallback={<>{`fetching ${selectedCategoryIndex} posts...`}</>}>
                  <CorsProxiesLoad>
                    <Feeds key='feedsdisplay' />
                  </CorsProxiesLoad>
                </Suspense>
              </ErrorBoundary>
            )
          })
        }
        {
          [selectedPageIndex].flat().filter(() => {
            return selectedPageIndex === 'categories'
          })
          .filter(() => selectedCategoryIndex === '' || selectedCategoryIndex === 'allCategories')
          .map(() => {
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
          })
          .filter(() => selectedCategoryIndex === '' || selectedCategoryIndex === 'allCategories')
          .map(() => {
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
          })
          .filter(() => selectedCategoryIndex === '' || selectedCategoryIndex === 'allCategories')
          .map(() => {
            return (
              <ErrorBoundary key={'errorBoundaryStacks'} fallback={<>error fetching stacks session</>}>
                <Suspense fallback={<>...fetching stacks session</>}>
                  <Stacks key='stacks' />
                </Suspense>
              </ErrorBoundary>
            )
          })
        }
        {
          [selectedPageIndex].flat().filter(() => {
            return selectedPageIndex === 'corsproxies'
          })
          .filter(() => selectedCategoryIndex === '' || selectedCategoryIndex === 'allCategories')
          .map(() => {
            return (
              <ErrorBoundary key={'errorBoundaryCorsProxies'} fallback={<>error fetching cors proxies</>}>
                <Suspense fallback={<>...fetching corsproxies </>}>
                  <CorsProxiesEdit key='corsproxies' />
                </Suspense>
              </ErrorBoundary>
            )
          })
        }
      </Box>
    </Box>
  );
}