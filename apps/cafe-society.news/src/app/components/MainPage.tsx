import { Suspense, ReactElement, useRef, useState } from 'react';
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
import { MeshDistortMaterial } from '@react-three/drei'
import { ThemeProvider, useTheme } from 'styled-components'
import { useStorage } from '../react-hooks/useStorage';
import useSWR from 'swr';
import {
  Toolbar
} from '@mui/material'

export function MainPage() {

  const { fetchFileLocal } = useStorage();

  const { data: selectedPage } = useSWR(
    'selectedPage',
    fetchFileLocal('selectedPage', 'posts')
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Sphere = (props: any) => {
    const theme = useTheme()
    return (
      <mesh {...props}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial speed={1} color={theme.colors.third} toneMapped={false} />
      </mesh>
    )
  }
  
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
          <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 5]} />
          <pointLight position={[-10, -10, -10]} />
          <Sphere scale={2} />
        </Canvas>
        }>
        <Toolbar />
        {
          contentForPage[pageToRender]()
        }
          <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 5]} />
            <pointLight position={[-10, -10, -10]} />
            <Sphere scale={2} />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default MainPage;