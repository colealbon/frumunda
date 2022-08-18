import ReactDOM from 'react-dom/client';
import KeyDelete from './KeyDelete'

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a keys component', () => {
    ReactDOM.createRoot(container).render(<KeyDelete />);
});

