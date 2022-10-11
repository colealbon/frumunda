import { Suspense, ReactElement } from 'react';
import Contribute from './Contribute';
import AppSettings from './AppSettings';
import Classifier from './Classifier';
import CheckedCategory from './CheckedCategory';
import Category from './Category';
import Feed from './Feed';
import Posts from './Posts';
import DispatchersEdit from './DispatchersEdit'
import Keys from './Keys';
import Metamask from './Metamask';
import Stacks from './Stacks';
import CategoriesEdit from './CategoriesEdit';
import CorsProxiesEdit from './CorsProxiesEdit';
import FeedsEdit from './FeedsEdit';
import ErrorBoundary from './ErrorBoundary';
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { ThemeProvider } from 'styled-components'
import { useStorage } from '../react-hooks/useStorage';
import useSWR from 'swr';

import {
  Toolbar
} from '@mui/material'
import earth from './earth.jpeg'

export function MainPage() {

  const { fetchFileLocal } = useStorage();

  const { data: selectedPage } = useSWR(
    'selectedPage',
    fetchFileLocal('selectedPage', 'posts')
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  
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
    "dispatchers": () =>  <DispatchersEdit />,
    "appsettings": () =>  <AppSettings />
  }

  const pageToRender = `${selectedPage || 'posts'}`
  
  return (
    <ThemeProvider
    theme={{
      colors: {
        primary: '#b16268',
        secondary: 'rgba(246, 248, 25)',
        third: 'orange'
      },
    }}>
      <ErrorBoundary fallback={<>`error fetching ${pageToRender}`</>}>
        <Suspense fallback={
          <div style={{ height:'100vh', backgroundColor: 'black' }}>
            <Canvas>
              <Stars />
              <ambientLight />
              <pointLight position={[10, 10, 5]} />
              <pointLight position={[-10, -10, -10]} />
            </Canvas>
          </div>
        }>
        <Toolbar />
          {
            contentForPage[pageToRender]()
          } 
        </Suspense>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default MainPage;