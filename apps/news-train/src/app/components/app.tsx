import Dashboard from './Dashboard';
import MainPage from './MainPage'
import { SWRConfig, useSWRConfig } from 'swr'
import { useStacks } from '../react-hooks/useStacks'
import defaultFeeds from '../react-hooks/defaultFeeds.json'
import defaultCategories from '../react-hooks/defaultCategories.json'
import defaultCorsProxies from '../react-hooks/defaultCorsProxies.json'

export function App() {
  const {mutate} = useSWRConfig()
  const {
    fetchStacksFilenames,
    fetchFile,
    loadUserData
  } = useStacks()

  loadUserData()
  fetchStacksFilenames()

  mutate('corsProxies', fetchFile('corsProxies', {fallbackData: defaultCorsProxies}))
  mutate('categories', fetchFile('categories', {fallbackData: defaultCategories}))
  mutate('feeds', fetchFile('feeds', {fallbackData: defaultFeeds}))
  //mutate('stacksFilenames', fetchStacksFilenames, {optimisticData: []})
  console.log('app')

  return (
    <Dashboard>
      <MainPage />
    </Dashboard>  
  )
}
export default App;