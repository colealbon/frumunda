import {
  Suspense
} from 'react';

import Contribute from './Contribute'
import Category from './Category'
import Feed from './Feed'
import Posts from './Posts'
import Stacks from './Stacks'
import CategoriesEdit from './CategoriesEdit'
import CorsProxiesEdit from './CorsProxiesEdit'
import FeedsEdit from './FeedsEdit'
import ErrorBoundary from './ErrorBoundary'


import useSWR from 'swr'

export function MainPage() {
  const {data: selectedPage} = useSWR('selectedPage')
  const {data: selectedCategory} = useSWR('selectedCategory')

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
          [selectedPage].flat().filter(() => {
            return selectedPage === 'contribute'
          })
          .filter(() => selectedCategory === '' || selectedCategory === 'allCategories')
          .map(() => <Contribute key='contribute'/>)
        }
        
        {
          [selectedPage].flat()
          .filter(() => selectedPage === 'posts')
          .filter(() => selectedCategory === 'allCategories')
          .map(() => fetchAndRenderPosts())
        }
        {
          [selectedPage].flat()
          .filter(() => selectedPage === 'posts')
          .filter(() => `${selectedCategory}` === '')
          .map(() => fetchAndRenderPosts())
        }
        {
          [selectedCategory].flat()
          .filter(() => `${selectedCategory}` !== '')
          .filter(() => selectedCategory !== 'allCategories')
          .map(() => fetchAndRenderPosts())
        }
        {
          [selectedPage].flat()
          .filter(() => selectedPage === 'categories')
          .filter(() => selectedCategory === '' || selectedCategory === 'allCategories')
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
          [selectedPage].flat().filter(() => {
            return selectedPage === 'feeds'
          })
          .filter(() => selectedCategory === '' || selectedCategory === 'allCategories')
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
          [selectedPage].flat().filter(() => {
            return selectedPage === 'stacks'
          })
          .filter(() => selectedCategory === '' || selectedCategory === 'allCategories')
          .map(() => {
            return (
              <ErrorBoundary key={'errorBoundaryStacks'} fallback={<>error fetching stacks session</>}>
                <Suspense fallback={<>updating latest from stacks</>}>
                  <Stacks key='stacks' />
                </Suspense>
              </ErrorBoundary>
            )
          })
        }
        {
          [selectedPage].flat().filter(() => {
            return selectedPage === 'corsproxies'
          })
          .filter(() => selectedCategory === '' || selectedCategory === 'allCategories')
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
