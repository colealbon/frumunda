import Dashboard from './Dashboard';
import MainPage from './MainPage';
import { mutate } from 'swr';
import { useStacks } from '../react-hooks/useStacks';
import { MetaMaskProvider } from "metamask-react";
import defaultKeys from '../react-hooks/defaultKeys.json'
import defaultCorsProxies from '../react-hooks/defaultCorsProxies.json';

export function App() {
  
  const { fetchFileLocal, loadUserData, fetchFile } = useStacks();

  loadUserData();
  mutate('keys', fetchFile('keys', defaultKeys), {
    optimisticData: defaultKeys,
  });
  mutate('corsProxies', fetchFileLocal('corsProxies', defaultCorsProxies), {
    optimisticData: defaultCorsProxies,
  });
  mutate('selectedPage', fetchFileLocal('selectedPage', 'posts'));
  mutate(
    'selectedCategory',
    fetchFileLocal('selectedCategory', 'allCategories')
  );

  return (
    <MetaMaskProvider>
      <Dashboard>
        <MainPage />
      </Dashboard>
    </MetaMaskProvider>
  );
}
export default App;
