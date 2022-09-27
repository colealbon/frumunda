import Dashboard from './Dashboard';
import MainPage from './MainPage';
import { mutate } from 'swr';
import { useStorage } from '../react-hooks/useStorage';
import { MetaMaskProvider } from "metamask-react";
import defaultKeys from '../react-hooks/defaultKeys.json'
import defaultDispatchers from '../react-hooks/defaultDispatchers.json'
import defaultCorsProxies from '../react-hooks/defaultCorsProxies.json';
import CssBaseline from '@mui/material/CssBaseline';

export function App() {
  
  const { fetchFileLocal, loadUserData, fetchFile } = useStorage();

  loadUserData();
  mutate('keys', fetchFile('keys', defaultKeys), {
    optimisticData: defaultKeys,
  });
  
  mutate('dispatchers', fetchFileLocal('dispatchers', defaultDispatchers));

  mutate('corsProxies', fetchFileLocal('corsProxies', defaultCorsProxies), {
    optimisticData: defaultCorsProxies,
  });
  mutate('selectedPage', fetchFileLocal('selectedPage', 'posts'));
  mutate(
    'selectedCategory',
    fetchFileLocal('selectedCategory', 'allCategories')
  );
  console.count()
  return (
    <MetaMaskProvider>
      <CssBaseline />
      <Dashboard>
        <MainPage />
      </Dashboard>
    </MetaMaskProvider>
  );
}
export default App;
