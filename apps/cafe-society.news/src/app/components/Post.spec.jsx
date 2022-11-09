import ReactDOM from 'react-dom/client';
import Post from './Post'

// const postContext = useContext(PostContext);
// const postItem = Object.assign(postContext);
// const categoryContext = useContext(CategoryContext);
// const category = `${categoryContext}`;
// const id = `${postItem.link}`;

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
    ReactDOM.createRoot(container).render(<Post />);
});

