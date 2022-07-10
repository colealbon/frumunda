// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Navigator from './Navigator';
import MainPage from './MainPage'
import StacksFilenames from './StacksFilenames'

export function App() {
  return (
      <Navigator>
        <StacksFilenames>
          <MainPage />
        </StacksFilenames> 
      </Navigator>  
  )
}

export default App;
