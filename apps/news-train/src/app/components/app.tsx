import Dashboard from './Navigator';
import MainPage from './MainPage'
import { SWRConfig, useSWRConfig } from 'swr'
import { useStacks } from '../react-hooks/useStacks'
import defaultFeeds from '../react-hooks/defaultFeeds.json'
import defaultCategories from '../react-hooks/defaultCategories.json'
import defaultCorsProxies from '../react-hooks/defaultCorsProxies.json'

export function App() {
  const {mutate} = useSWRConfig()
  const SWRoptions = {
    suspense: true,
    shouldRetryOnError: false,
    revalidateOnFocus: false
  }
  const {
    fetchStacksFilenames,
    fetchFile,
    loadUserData
  } = useStacks()

  loadUserData()
  fetchStacksFilenames()

  mutate('corsProxies', fetchFile('corsProxies', defaultCorsProxies))
  mutate('categories', fetchFile('categories', defaultCategories))
  mutate('feeds', fetchFile('feeds', defaultFeeds))
 
  return (
    <SWRConfig value={SWRoptions}>
      <Dashboard>
        <MainPage />
      </Dashboard>  
    </SWRConfig>
  )
}

export default App;