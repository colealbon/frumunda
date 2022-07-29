import Dashboard from './Dashboard';
import MainPage from './MainPage'
import {mutate} from 'swr'
import {useStacks} from '../react-hooks/useStacks'
import defaultFeeds from '../react-hooks/defaultFeeds.json'
import defaultCategories from '../react-hooks/defaultCategories.json'
import defaultCorsProxies from '../react-hooks/defaultCorsProxies.json'

export function App() {
  const {fetchFileLocal, loadUserData} = useStacks()
  loadUserData()
  mutate('corsProxies', fetchFileLocal('corsProxies', defaultCorsProxies), {optimisticData: defaultCorsProxies})
  mutate('categories', fetchFileLocal('categories', defaultCategories), {optimisticData: defaultCategories})
  mutate('feeds', fetchFileLocal('feeds', defaultFeeds), {optimisticData: defaultFeeds})
  mutate('selectedPage', fetchFileLocal('selectedPage', 'posts'))
  mutate('selectedCategory', fetchFileLocal('selectedPage', 'selectedCategory'))

  return (
    <Dashboard>
      <MainPage />
    </Dashboard>  
  )
}
export default App;