import { Suspense, ReactElement } from 'react';
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
  
  const contentForPage: {[key: string]: () => ReactElement} = {
    "contribute": () => <Contribute />,
    "posts": () => <CheckedCategory>
        <Feed>
          <Posts />
        </Feed>
      </CheckedCategory>,
    "categories": () => <CategoriesEdit />,
    "feeds": () => <FeedsEdit />,
    "stacks": () => <Stacks />,
    "metamask": () => <Metamask />,
    "corsproxies": () => <CorsProxiesEdit />,
    "classifiers": () => <Category>
        <Classifier/>
      </Category>,
    "keys": () => <Keys />,
    "dispatchers": () =>  <Dispatchers />,
    "appsettings": () =>  <AppSettings />
  }

  const pageToRender = `${selectedPage || 'posts'}`
  
  return (
    <ErrorBoundary fallback={<>`error fetching ${pageToRender}`</>}>
      <Suspense fallback={<><Toolbar />loading and processing (be patient...)<Toolbar /><Toolbar><div><Contribute /></div></Toolbar></>}>
      {
        contentForPage[pageToRender]()
      }
      </Suspense>
    </ErrorBoundary>
  )
}

export default MainPage;