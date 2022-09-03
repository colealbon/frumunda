import ReactDOM from 'react-dom/client';
import DispatcherDelete from './DispatcherDelete'

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a dispatcher delete component', () => {
    ReactDOM.createRoot(container).render(<DispatcherDelete />);
});

