import ReactDOM from 'react-dom/client';
import CorsProxiesReset from './CorsProxiesReset'

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a classifier component', () => {
    ReactDOM.createRoot(container).render(<CorsProxiesReset />);
});

