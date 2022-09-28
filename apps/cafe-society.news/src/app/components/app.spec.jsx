import ReactDOM from 'react-dom/client';
import App from './app'

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
    ReactDOM.createRoot(container).render(<App />);
});

    // it ('click icon opens the drawer', async () => {
    //   const openDrawerButton = screen.getByRole('button', {
    //     name: /open drawer/i
    //   })
    //   // user.click(openDrawerButton)
    //   // await waitFor(() => {
    //   //   expect(true).toEqual(true)
    //   //   // const getText = screen.getByText(/posts/i)
    //   //   // expect(getText).toBeVisible()
    //   // })
    // })

