import React, {Suspense} from 'react';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import CssBaseline from '@mui/material/CssBaseline';
// import Drawer from '@mui/material/Drawer';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
import {Divider, Toolbar} from '@mui/material';
// import Typography from '@mui/material/Typography';
// import PageChooser from './PageChooser';
import Category from './Category'
// import CategoryChooser from './CategoryChooser'
import Contribute from './Contribute'
import StacksFilenames from './StacksFilenames'
import Classifiers from './Classifiers'
import Feed from './Feed'
import Posts from './Posts'
import Stacks from './Stacks'
import CategoriesEdit from './CategoriesEdit'
import CorsProxiesEdit from './CorsProxiesEdit'
import FeedsEdit from './FeedsEdit'
import ErrorBoundary from './ErrorBoundary'
import CorsProxies from './CorsProxies'
import ProcessedPosts from './ProcessedPosts'
import { useSelectedPageIndex } from '../react-hooks/useSelectedPageIndex'
import { useSelectedCategoryIndex } from '../react-hooks/useSelectedCategoryIndex'
// import { labelOrEcho } from '../utils'
// const drawerWidth = 240;

export function MainPage() {
//   const [mobileOpen, setMobileOpen] = React.useState(false);
  const { selectedPageIndex } = useSelectedPageIndex();
  const { selectedCategoryIndex } = useSelectedCategoryIndex();

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

  const fetchAndRenderPosts = () => {
    return (
      <ErrorBoundary key={'errorBoundaryPosts'} fallback={<>error fetching posts</>}>
        <Suspense fallback={`loading processed posts...`}>
            <CorsProxies>
              <Category>
                <Feed>
                  <ProcessedPosts>
                    <Posts />
                  </ProcessedPosts>
                </Feed>
              </Category>
            </CorsProxies>
        </Suspense>
      </ErrorBoundary>
    )
  }

  return (
    <>
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
          .map(() => fetchAndRenderPosts())
        }
        {
          [selectedPageIndex].flat()
          .filter(() => selectedPageIndex === 'posts')
          .filter(() => `${selectedCategoryIndex}` === '')
          .map(() => fetchAndRenderPosts())
        }
        {
          [selectedCategoryIndex].flat()
          .filter(() => `${selectedCategoryIndex}` !== '')
          .filter(() => selectedCategoryIndex !== 'allCategories')
          .map(() => fetchAndRenderPosts())
        }
        {
          [selectedPageIndex].flat()
          .filter(() => selectedPageIndex === 'categories')
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
      </>
  );
}

export default MainPage
