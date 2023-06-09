import ReactDOM from 'react-dom/client';
import CorsProxyToggle from './CorsProxyToggle'

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render CorsProxyToggle', () => {
    ReactDOM.createRoot(container).render(<CorsProxyToggle />);
});

