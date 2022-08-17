import ReactDOM from 'react-dom/client';
import KeyToggle from './KeyToggle'

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a KeyToggle component', () => {
    ReactDOM.createRoot(container).render(<KeyToggle />);
});

