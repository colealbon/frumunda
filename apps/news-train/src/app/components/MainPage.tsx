import {Suspense} from 'react';

import Contribute from './Contribute'
import Category from './Category'
import Feed from './Feed'
import Posts from './Posts'
import Stacks from './Stacks'
import CategoriesEdit from './CategoriesEdit'
import CorsProxiesEdit from './CorsProxiesEdit'
import FeedsEdit from './FeedsEdit'
import ErrorBoundary from './ErrorBoundary'
import { useSelectedPageIndex } from '../react-hooks/useSelectedPageIndex'
import { useSelectedCategoryIndex } from '../react-hooks/useSelectedCategoryIndex'

export function MainPage() {
  const { selectedPageIndex } = useSelectedPageIndex();
  const { selectedCategoryIndex } = useSelectedCategoryIndex();

  const fetchAndRenderPosts = () => {
    return (
      <ErrorBoundary key={'errorBoundaryPosts'} fallback={<>error fetching posts</>}>
        <Suspense fallback={`loading and processing posts (be patient...)`}>
          <Category>
            <Feed>
              <Posts />
            </Feed>
          </Category>

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
                <Suspense fallback={<>fetching stacks stuff</>}>
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
