import { Suspense } from 'react';
import Contribute from './Contribute';
import AppSettings from './AppSettings';
import Classifier from './Classifier';
import CheckedCategory from './CheckedCategory';
import Category from './Category';
import Feed from './Feed';
import Posts from './Posts';
import Dispatchers from './Dispatchers'
import Keys from './Keys';
import Metamask from './Metamask';
import Stacks from './Stacks';
import CategoriesEdit from './CategoriesEdit';
import CorsProxiesEdit from './CorsProxiesEdit';
import FeedsEdit from './FeedsEdit';
import ErrorBoundary from './ErrorBoundary';
import { useStorage } from '../react-hooks/useStorage';
import { Toolbar } from '@mui/material'

import useSWR from 'swr';

export function MainPage() {
  const { fetchFileLocal } = useStorage();
  const { data: selectedPage } = useSWR(
    'selectedPage',
    fetchFileLocal('selectedPage', 'posts')
  );
  const { data: selectedCategory } = useSWR(
    'selectedCategory',
    fetchFileLocal('selectedCategory', 'allCategories')
  );

  const fetchAndRenderPosts = () => {
    return (
      <ErrorBoundary
        key={'errorBoundaryPosts'}
        fallback={<>error fetching posts</>}
      >
        <Suspense fallback={<><Toolbar />loading and processing posts (be patient...)<Toolbar /><Toolbar><div><Contribute /></div></Toolbar></>}>
          <CheckedCategory>
            <Feed>
              <Posts />
            </Feed>
          </CheckedCategory>
        </Suspense>
      </ErrorBoundary>
    );
  };
  // this whole thing could be ternaries, but really should be handled with react router or reach router. 
  return (
    <>
      {[selectedPage]
        .flat()
        .filter(() => {
          return selectedPage === 'contribute';
        })
        .filter(
          () => selectedCategory === '' || selectedCategory === 'allCategories'
        )
        .map(() => (
          <Contribute key="contribute" />
        ))
      }
      {[selectedPage]
        .flat()
        .filter(() => selectedPage === '')
        .filter(() => selectedCategory === '')
        .map(() => fetchAndRenderPosts())}
      {[selectedPage]
        .flat()
        .filter(() => selectedPage === 'posts')
        .filter(() => selectedCategory === 'allCategories')
        .map(() => fetchAndRenderPosts())}
      {[selectedPage]
        .flat()
        .filter(() => selectedPage === 'posts')
        .filter(() => `${selectedCategory}` === '')
        .map(() => fetchAndRenderPosts())}
      {[selectedCategory]
        .flat()
        .filter(() => `${selectedCategory}` !== '')
        .filter(() => selectedCategory !== 'allCategories')
        .map(() => fetchAndRenderPosts())}
      {[selectedPage]
        .flat()
        .filter(() => selectedPage === 'categories')
        .filter(
          () => selectedCategory === '' || selectedCategory === 'allCategories'
        )
        .map(() => {
          return (
            <ErrorBoundary
              key={'errorBoundaryCategories'}
              fallback={<>error fetching categories</>}
            >
              <Suspense fallback={<>...fetching Categories</>}>
                <CategoriesEdit key="categories" />
              </Suspense>
            </ErrorBoundary>
          );
        })}
      {[selectedPage]
        .flat()
        .filter(() => {
          return selectedPage === 'feeds';
        })
        .filter(
          () => selectedCategory === '' || selectedCategory === 'allCategories'
        )
        .map(() => {
          return (
            <ErrorBoundary
              key={'errorBoundaryFeeds'}
              fallback={<>error fetching feeds</>}
            >
              <Suspense fallback={<>...fetching Feeds</>}>
                <FeedsEdit key="feedsedit" />
              </Suspense>
            </ErrorBoundary>
          );
        })}
      {[selectedPage]
        .flat()
        .filter(() => {
          return selectedPage === 'stacks';
        })
        .filter(
          () => selectedCategory === '' || selectedCategory === 'allCategories'
        )
        .map(() => {
          return (
            <ErrorBoundary
              key={'errorBoundaryStacks'}
              fallback={<>error fetching stacks session</>}
            >
              <Suspense fallback={<>updating latest from stacks</>}>
                <Stacks key="stacks" />
              </Suspense>
            </ErrorBoundary>
          );
        })}

      {[selectedPage]
        .flat()
        .filter(() => {
          return selectedPage === 'metamask';
        })
        .filter(
          () => selectedCategory === '' || selectedCategory === 'allCategories'
        )
        .map(() => {
          return (
            <ErrorBoundary
              key={'errorBoundaryMetamask'}
              fallback={<>error fetching metamask session</>}
            >
              <Suspense fallback={<>updating latest from metamask</>}>
                <Metamask key="metamask" />
              </Suspense>
            </ErrorBoundary>
          );
        })}

      {[selectedPage]
        .flat()
        .filter(() => {
          return selectedPage === 'corsproxies';
        })
        .filter(
          () => selectedCategory === '' || selectedCategory === 'allCategories'
        )
        .map(() => {
          return (
            <ErrorBoundary
              key={'errorBoundaryCorsProxies'}
              fallback={<>error fetching cors proxies</>}
            >
              <Suspense fallback={<>...fetching corsproxies </>}>
                <CorsProxiesEdit key="corsproxies" />
              </Suspense>
            </ErrorBoundary>
          );
        })}


        {[selectedPage]
        .flat()
        .filter(() => {
          return selectedPage === 'classifiers';
        })
        .filter(
          () => selectedCategory === '' || selectedCategory === 'allCategories'
        )
        .map(() => {
          return (
            <ErrorBoundary
              key={'errorBoundaryClassifiers'}
              fallback={<>error fetching classifiers</>}
            >
              <Suspense fallback={<>...fetching classifiers </>}>
                <Category key="classifier">
                  <Classifier/>
                </Category>
              </Suspense>
            </ErrorBoundary>
          );
        })}

        {[selectedPage]
        .flat()
        .filter(() => {
          return selectedPage === 'keys';
        })
        .filter(
          () => selectedCategory === '' || selectedCategory === 'allCategories'
        )
        .map(() => {
          return (
            <ErrorBoundary
              key={'errorBoundaryKeys'}
              fallback={<>error fetching keys</>}
            >
              <Suspense fallback={<>...fetching keys </>}>
                <Keys/>
              </Suspense>
            </ErrorBoundary>
          );
        })}

      {[selectedPage]
        .flat()
        .filter(() => {
          return selectedPage === 'dispatchers';
        })
        .filter(
          () => selectedCategory === '' || selectedCategory === 'allCategories'
        )
        .map(() => {
          return (
            <ErrorBoundary
              key={'errorBoundaryKeys'}
              fallback={<>error fetching dispatchers</>}
            >
              <Suspense fallback={<>...fetching dispatchers </>}>
                <Category>
                  <Dispatchers/>
                </Category>
              </Suspense>
            </ErrorBoundary>
          );
        })}

        {[selectedPage]
        .flat()
        .filter(() => {
          return selectedPage === 'appsettings';
        })
        .filter(
          () => selectedCategory === '' || selectedCategory === 'allCategories'
        )
        .map(() => {
          return (
            <ErrorBoundary
              key={'errorBoundaryCorsProxies'}
              fallback={<>error fetching app settings</>}
            >
              <Suspense fallback={<>...fetching app settings </>}>
                <AppSettings key="appsettings" />
              </Suspense>
            </ErrorBoundary>
          );
        })}

    </>
  );
}

export default MainPage;
