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
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Html } from '@react-three/drei'
import styled, { ThemeProvider, useTheme } from 'styled-components'
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
  const ThreeBox = (props: any) => {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef({rotation: {x: 0}})
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFrame((state: any, delta: number) => ref.current.rotation.x += delta)
    // Return the view, these are regular Threejs elements expressed in JSX
    return (
      <mesh
        {...props}
        ref={ref}
        scale={clicked ? 1.5 : 1}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'black' : 'yellow'} />
      </mesh>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Sphere = (props: any) => {
    const theme = useTheme()
    return (
      <mesh {...props}>
        <sphereGeometry args={[1, 3, 64]} />
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
        secondary: 'rgba(255, 155, 0, 0.8)',
        third: 'orange'
      },
    }}>
      <ErrorBoundary fallback={<>`error fetching ${pageToRender}`</>}>
        <Suspense fallback={
          <>
          <Toolbar />
        <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 5]} />
          <pointLight position={[-10, -10, -10]} />
          <Sphere scale={2.5} />
        </Canvas>
        </>
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