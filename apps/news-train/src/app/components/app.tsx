import Dashboard from './Dashboard';
import MainPage from './MainPage'
import { mutate } from 'swr'
import localforage from 'localforage'
import { useStacks } from '../react-hooks/useStacks'
import defaultFeeds from '../react-hooks/defaultFeeds.json'
import defaultCategories from '../react-hooks/defaultCategories.json'
import defaultCorsProxies from '../react-hooks/defaultCorsProxies.json'

export function App() {
  const {
    fetchFile,
  } = useStacks()

  // loadUserData()
  // fetchStacksFilenames()

  mutate('corsProxies', localforage.getItem('corsProxies'), {optimisticData: defaultCorsProxies})
  mutate('categories', fetchFile('categories', defaultCategories), {optimisticData: defaultCategories})
  mutate('feeds', fetchFile('feeds', defaultFeeds), {optimisticData: defaultFeeds})
  // mutate('stacksFilenames', fetchStacksFilenames, {optimisticData: []})


  return (
    <Dashboard>
      <MainPage />
    </Dashboard>  
  )
}
export default App;