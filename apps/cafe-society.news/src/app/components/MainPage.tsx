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
import { useStorage } from '../react-hooks/useStorage';
import useSWR from 'swr';

export function MainPage() {

  const { fetchFileLocal } = useStorage();

  const { data: selectedPage } = useSWR(
    'selectedPage',
    fetchFileLocal('selectedPage', 'posts')
  );

  const ThreeBox = (props) => {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (ref.current.rotation.x += delta))
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
        <meshStandardMaterial color={hovered ? 'grey' : 'grey'} />
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
    <ErrorBoundary fallback={<>`error fetching ${pageToRender}`</>}>
      <Suspense fallback={
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <ThreeBox position={[-1, -1, -1]} />
        </Canvas>
      }>
      {
        contentForPage[pageToRender]()
      }
      </Suspense>
    </ErrorBoundary>
  )
}

export default MainPage;