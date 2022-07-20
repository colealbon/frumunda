import Dashboard from './Navigator';
import MainPage from './MainPage'
import { SWRConfig, mutate } from 'swr'
import { useStacks } from '../react-hooks/useStacks'

export function App() {
  const SWRoptions = {
    suspense: true,
    shouldRetryOnError: false,
    revalidateOnFocus: false
  }
  const {
    fetchStacksFilenames,
    fetchFile
  } = useStacks()

  mutate('stacksFilenames', fetchStacksFilenames);
  mutate('categories', fetchFile('categories'));

  return (
    <SWRConfig value={SWRoptions}>
      <Dashboard>
        <MainPage />
      </Dashboard>  
    </SWRConfig>
  )
}

export default App;
